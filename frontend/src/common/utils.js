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
    ascent.forEach(function (item) {
        var _lat = item.latitude;
        // Correct for API giving us longitudes outside [-180, 180]
        _lon = item.longitude;
        if (_lon > 180.0) {
            _lon = _lon - 360.0;
        }

        flight_path.push([_lat, _lon, item.altitude]);
    });

    // Add the Descent or Float track to the flight path array.
    descent.forEach(function (item) {
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

export const toDegreesMinutesAndSeconds = (coordinate) => {
    var absolute = Math.abs(coordinate);
    var degrees = Math.floor(absolute);
    var minutesNotTruncated = (absolute - degrees) * 60;
    var minutes = Math.floor(minutesNotTruncated);
    var seconds = Math.floor((minutesNotTruncated - minutes) * 60);

    return degrees + "°" + minutes + "’" + seconds + "\"";
}

export const convertDMS = (lat, lng) => {
    var latitude = toDegreesMinutesAndSeconds(lat);
    var latitudeCardinal = lat >= 0 ? "N" : "S";

    var longitude = toDegreesMinutesAndSeconds(lng);
    var longitudeCardinal = lng >= 0 ? "E" : "W";

    return latitude + "" + latitudeCardinal + " , " + longitude + " " + longitudeCardinal;
}

export const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
}

export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}



export const zeroPad = (num, places) => {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}


export const requestApi = (url, callback) => {
    axios
        .get(url, { /*オプションがあれば書く*/ })
        .then(response => {
            callback(response)
        })
        .catch(e => {
            console.log("Error occurred in API")
            console.log(e)
        });
}