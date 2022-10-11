#!/usr/bin/env python3
import boto3
from botocore import UNSIGNED
from botocore.config import Config
import datetime
from botocore.exceptions import ClientError
# Script to find which dataset is the latest avaliable on S3

import os
import schedule

def download_dataset():
    s3 = boto3.client('s3', config=Config(signature_version=UNSIGNED))

    BUCKET = "noaa-gfs-bdp-pds"

    candidate_time  = datetime.datetime.utcnow()
    candidate_time = candidate_time.replace(hour=18, minute=0, second=0,microsecond=0)

    for x in range(30): # check for the last 30 possible candidates
        candidate_time_string = candidate_time.strftime("gfs.%Y%m%d/%H/atmos/gfs.t%Hz.pgrb2.0p50.f192")
    
        try: # test if the file exists
            s3.head_object(
                Bucket=BUCKET,
                Key=candidate_time_string
            )
            latest_gfs = candidate_time_string
            break
        except ClientError as e:
            if e.response['ResponseMetadata']['HTTPStatusCode'] == 404:
                pass
        
        candidate_time = candidate_time - datetime.timedelta(hours=6)
    else:
        raise RuntimeError("Could not find latest GFS data")

    command_time_string = candidate_time.strftime("%Y%m%d%H")
    print(f"Found latest to be {command_time_string}.")
    if not os.path.exists(f"/srv/tawhiri-datasets/{command_time_string}"):
        print(f"Start download {command_time_string}")
        # the assumption is that this script will only ever run inside docker
        os.system(f"/tawhiri-downloader/_build/default/main.exe one -base-url aws-mirror {command_time_string}")
        print(f"Done download {command_time_string}")
    else:
        print(f"Dataset {command_time_string} Existed ")

    # return 


schedule.every(1).hours.do(download_dataset)
while True:
    schedule.run_pending()