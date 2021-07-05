import os
import datetime
from typing import Optional
from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.encoders import generate_encoders_by_class_tuples
from core.config import settings
from predictors import interpolate
from predictors.warnings import WarningCounts
from predictors.dataset import Dataset as WindDataset
from predictors import solver,models

from db import database
from common.utils import _rfc3339_to_timestamp,_timestamp_to_rfc3339,ruaumoko_ds,\
    API_VERSION,PROFILE_STANDARD,PROFILE_FLOAT,LATEST_DATASET_KEYWORD
from common.custom_exception import RequestException,InternalException,PredictionException


router = APIRouter(
    prefix=f"{settings.api_v1_str}/predictor",
    tags=['Predictor']
)
get_db = database.get_db

def run_prediction(req):
    """
    Run the prediction.
    """
    # Response dict
    resp = {
        "request": req,
        "prediction": [],
    }

    warningcounts = WarningCounts()

    # Find wind data location
    ds_dir = os.getenv('WIND_DATASET_DIR', WindDataset.DEFAULT_DIRECTORY)

    # Dataset
    try:
        if req['dataset'] == LATEST_DATASET_KEYWORD:
            tawhiri_ds = WindDataset.open_latest(persistent=True, directory=ds_dir)
        else:
            tawhiri_ds = WindDataset(datetime.fromtimestamp(req['dataset']), directory=ds_dir)
    except IOError:
        raise InvalidDatasetException(msg="No matching dataset found.")
    except ValueError as e:
        raise InvalidDatasetException(msg="{}".format(*e.args))

    # Note that hours and minutes are set to 00 as Tawhiri uses hourly datasets
    resp['request']['dataset'] = \
            tawhiri_ds.ds_time.strftime("%Y-%m-%dT%H:00:00Z")

    # Stages
    if req['profile'] == PROFILE_STANDARD:
        stages = models.standard_profile(req['ascent_rate'],
                                         req['burst_altitude'],
                                         req['descent_rate'],
                                         tawhiri_ds,
                                         ruaumoko_ds(),
                                         warningcounts)
    elif req['profile'] == PROFILE_FLOAT:
        stages = models.float_profile(req['ascent_rate'],
                                      req['float_altitude'],
                                      req['stop_datetime'],
                                      tawhiri_ds,
                                      warningcounts)
    else:
        raise InternalException("No implementation for known profile.")

    # Run solver
    try:
        result = solver.solve(req['launch_datetime'], req['launch_latitude'],
                              req['launch_longitude'], req['launch_altitude'],
                              stages)
    except Exception as e:
        raise PredictionException(msg="Prediction did not complete: '%s'." %
                                  str(e))

    # Format trajectory
    if req['profile'] == PROFILE_STANDARD:
        resp['prediction'] = _parse_stages(["ascent", "descent"], result)
    elif req['profile'] == PROFILE_FLOAT:
        resp['prediction'] = _parse_stages(["ascent", "float"], result)
    else:
        raise InternalException("No implementation for known profile.")

    # Convert request UNIX timestamps to RFC3339 timestamps
    for key in resp['request']:
        if "datetime" in key:
            resp['request'][key] = _timestamp_to_rfc3339(resp['request'][key])

    resp["warnings"] = warningcounts.to_dict()

    return resp

def _parse_stages(labels, data):
    """
    Parse the predictor output for a set of stages.
    """
    assert len(labels) == len(data)

    prediction = []
    for index, leg in enumerate(data):
        stage = {}
        stage['stage'] = labels[index]
        stage['trajectory'] = [{
            'latitude': lat,
            'longitude': lon,
            'altitude': alt,
            'datetime': _timestamp_to_rfc3339(dt),
            } for dt, lat, lon, alt in leg]
        prediction.append(stage)
    return prediction

def parse_request(data):
    """
    Parse the request.
    """
    req = {"version": API_VERSION}

    # Generic fields
    req['launch_latitude'] = \
        _extract_parameter(data, "launch_latitude", float,
                           validator=lambda x: -90 <= x <= 90)
    req['launch_longitude'] = \
        _extract_parameter(data, "launch_longitude", float,
                           validator=lambda x: 0 <= x < 360)
    req['launch_datetime'] = \
        _extract_parameter(data, "launch_datetime", _rfc3339_to_timestamp)
    req['launch_altitude'] = \
        _extract_parameter(data, "launch_altitude", float, ignore=True)

    # If no launch altitude provided, use Ruaumoko to look it up
    if req['launch_altitude'] is None:
        try:
            req['launch_altitude'] = ruaumoko_ds().get(req['launch_latitude'],
                                                       req['launch_longitude'])
        except Exception:
            raise InternalException("Internal exception experienced whilst " +
                                    "looking up 'launch_altitude'.")

    # Prediction profile
    req['profile'] = _extract_parameter(data, "profile", str,
                                        PROFILE_STANDARD)

    launch_alt = req["launch_altitude"]

    if req['profile'] == PROFILE_STANDARD:
        req['ascent_rate'] = _extract_parameter(data, "ascent_rate", float,
                                                validator=lambda x: x > 0)
        req['burst_altitude'] = \
            _extract_parameter(data, "burst_altitude", float,
                               validator=lambda x: x > launch_alt)
        req['descent_rate'] = _extract_parameter(data, "descent_rate", float,
                                                 validator=lambda x: x > 0)
    elif req['profile'] == PROFILE_FLOAT:
        req['ascent_rate'] = _extract_parameter(data, "ascent_rate", float,
                                                validator=lambda x: x > 0)
        req['float_altitude'] = \
            _extract_parameter(data, "float_altitude", float,
                               validator=lambda x: x > launch_alt)
        req['stop_datetime'] = \
            _extract_parameter(data, "stop_datetime", _rfc3339_to_timestamp,
                               validator=lambda x: x > req['launch_datetime'])
    else:
        raise RequestException(msg="Unknown profile '%s'." % req['profile'])

    # Dataset
    req['dataset'] = _extract_parameter(data, "dataset", _rfc3339_to_timestamp,
                                        LATEST_DATASET_KEYWORD)

    return req


def _extract_parameter(data, parameter, cast, default=None, ignore=False,
                       validator=None):
    """
    Extract a parameter from the POST request and raise an exception if any
    parameter is missing or invalid.
    """
    if parameter not in data:
        if default is None and not ignore:
            raise RequestException(msg="Parameter '%s' not provided in request." %
                                   parameter)
        return default

    try:
        result = cast(data[parameter])
    except Exception:
        raise RequestException(msg="Unable to parse parameter '%s': %s." %
                               (parameter, data[parameter]))

    if validator is not None and not validator(result):
        raise RequestException(msg="Invalid value for parameter '%s': %s." %
                               (parameter, data[parameter]))

    return result



@router.get('/predict')
def get_user(profile:str,launch_datetime:str,
    launch_latitude:float,launch_longitude:float,
    launch_altitude:int,burst_altitude:int,
    ascent_rate:int,descent_rate:int
    ):
    data = {
        "profile":profile,
        "launch_datetime":launch_datetime,
        "launch_latitude":launch_latitude,
        "launch_longitude":launch_longitude,
        "launch_altitude":launch_altitude,
        "burst_altitude":burst_altitude,
        "ascent_rate":ascent_rate,
        "descent_rate":descent_rate,
    }
    print(profile)
    print(launch_datetime)
    parse_request(data)
    # print(launch_datetime.strptime(iso_str, '%Y-%m-%dT%H:%M:%S.%fZ'))
    # print(_rfc3339_to_timestamp(launch_datetime))
    return run_prediction(parse_request(data))