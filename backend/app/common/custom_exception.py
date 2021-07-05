# import sys
# sys.path.append('../')
# from ..main import app

class APIException(Exception):
    def __init__(self, msg: str):
        self.msg = msg
    """
    Base API exception.
    """
    status_code = 500


class RequestException(APIException):
    def __init__(self, msg: str):
        self.msg = msg
    """
    Raised if request is invalid.
    """
    status_code = 400


class InvalidDatasetException(APIException):
    def __init__(self, msg: str):
        self.msg = msg
    """
    Raised if the dataset specified in the request is invalid.
    """
    status_code = 404


class PredictionException(APIException):
    def __init__(self, msg: str):
        self.msg = msg
    """
    Raised if the solver raises an exception.
    """
    status_code = 400


class InternalException(APIException):
    def __init__(self, msg: str):
        self.msg = msg
    """
    Raised when an internal error occurs.
    """
    status_code = 500


class NotYetImplementedException(APIException):
    def __init__(self, msg: str):
        self.msg = msg
    """
    Raised when the functionality has not yet been implemented.
    """
    status_code = 501