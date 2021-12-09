import os

import rfc3339
import strict_rfc3339
from core.config import settings
from dateutil.parser import parse as parse_rfc3339
from predictors.ruaumoko import Dataset as ElevationDataset

API_VERSION = 1
LATEST_DATASET_KEYWORD = "latest"
PROFILE_STANDARD = "standard_profile"
PROFILE_FLOAT = "float_profile"

# Util functions ##############################################################


def ruaumoko_ds():
    if not hasattr("ruaumoko_ds", "once"):
        ds_loc = os.getenv('ELEVATION_DATASET', ElevationDataset.default_location+"/elevation")
        ruaumoko_ds.once = ElevationDataset(ds_loc)

    return ruaumoko_ds.once


def _rfc3339_to_timestamp(dt):
    """
    Convert from a RFC3339 timestamp to a UNIX timestamp.
    """
    return strict_rfc3339.rfc3339_to_timestamp(dt)


def _timestamp_to_rfc3339(dt):
    """
    Convert from a UNIX timestamp to a RFC3339 timestamp.
    """
    return strict_rfc3339.timestamp_to_rfc3339_utcoffset(dt)


def _rfc3339_to_datetime(dt):
    return parse_rfc3339(dt)


def _datetime_to_rfc3339(dt):
    return rfc3339.rfc3339(dt)
