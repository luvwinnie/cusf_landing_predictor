#!/usr/bin/python
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

#!/usr/bin/env python3
import boto3
from botocore import UNSIGNED
from botocore.config import Config
import datetime
from botocore.exceptions import ClientError
# Script to find which dataset is the latest avaliable on S3

import os

DEFAULT_DIRECTORY = '/srv/tawhiri-datasets'
DEFAULT_HISTORY_DIRECTORY = '/srv/tawhiri-datasets-history'

class MyHandler(FileSystemEventHandler):
    def on_created(self, event):
        downloading_files = [path for path in sorted(os.listdir(DEFAULT_DIRECTORY)) if "download-" in path]
        history = [path for path in sorted(os.listdir(DEFAULT_DIRECTORY)) if "download-" not in path]
        for path in history:
            if not os.path.exists(f"{DEFAULT_HISTORY_DIRECTORY}/tawhiri-datasets-history/{path}")
                shutil.copy(os.path.join(DEFAULT_DIRECTORY,path),f"{DEFAULT_HISTORY_DIRECTORY}/{path}")
        


if __name__ == "__main__":
    event_handler = MyHandler()
    observer = Observer()
    observer.schedule(event_handler, path='/data/', recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()