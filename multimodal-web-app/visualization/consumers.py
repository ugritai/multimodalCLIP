import json
import base64
import pandas as pd
from PIL import Image
from io import BytesIO, StringIO
from channels.generic.websocket import WebsocketConsumer

class VisualizationConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        type = text_data_json['type']
        if type == 'UploadFile':
            self.handleUploadFile(text_data_json)

    def handleUploadFile(self, text_data_json):
        base64File = text_data_json['data']
        textFile = base64.b64decode(base64File).decode('utf-8')
        self.df = pd.read_csv(StringIO(textFile), delimiter='\t')
        self.send(text_data=json.dumps({"type": "ReturnHeaders", "headers": list(self.df.columns)}))