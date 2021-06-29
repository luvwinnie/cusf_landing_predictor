import L from "leaflet";
import moment from "moment-timezone/moment-timezone";

export const parsePrediction = (prediction) => {
    // Convert a prediction in the Tawhiri API format to a Polyline.

    var flight_path = [];
    var launch = {};
    var burst = {};
    var landing = {};
    var _lon = null;
    var ascent = prediction[0].trajectory;
    var descent = prediction[1].trajectory;

    // Add the ascent track to the flight path array.
    ascent.forEach(function(item) {
        var _lat = item.latitude;
        // Correct for API giving us longitudes outside [-180, 180]
        _lon = item.longitude;
        if (_lon > 180.0) {
            _lon = _lon - 360.0;
        }

        flight_path.push([_lat, _lon, item.altitude]);
    });

    // Add the Descent or Float track to the flight path array.
    descent.forEach(function(item) {
        var _lat = item.latitude;
        _lon = item.longitude;
        // Correct for API giving us longitudes outside [-180, 180]
        if (_lon > 180.0) {
            _lon = _lon - 360.0;
        }

        flight_path.push([_lat, _lon, item.altitude]);
    });

    // Populate the launch, burst and landing points
    var launch_obj = ascent[0];
    _lon = launch_obj.longitude;
    if (_lon > 180.0) {
        _lon = _lon - 360.0;
    }
    launch.latlng = L.latLng([launch_obj.latitude, _lon, launch_obj.altitude]);
    launch.datetime = moment.utc(launch_obj.datetime);

    var burst_obj = descent[0];
    _lon = burst_obj.longitude;
    if (_lon > 180.0) {
        _lon = _lon - 360.0;
    }
    burst.latlng = L.latLng([burst_obj.latitude, _lon, burst_obj.altitude]);
    burst.datetime = moment.utc(burst_obj.datetime);

    var landing_obj = descent[descent.length - 1];
    _lon = landing_obj.longitude;
    if (_lon > 180.0) {
        _lon = _lon - 360.0;
    }
    landing.latlng = L.latLng([
        landing_obj.latitude,
        _lon,
        landing_obj.altitude,
    ]);
    landing.datetime = moment.utc(landing_obj.datetime);

    var profile = null;
    if (prediction[1].stage == "descent") {
        profile = "standard_profile";
    } else {
        profile = "float_profile";
    }

    var flight_time = landing.datetime.diff(launch.datetime, "seconds");

    return {
        flight_path: flight_path,
        launch: launch,
        burst: burst,
        landing: landing,
        profile: profile,
        flight_time: flight_time,
    };
};
