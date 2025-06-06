from datetime import datetime
from celery import shared_task
from apps.classifications.models import ClassificationProcess
from apps.classifications.predictors import FewShotPredictor, ZeroShotPredictor
import json
import traceback

class ClassificationLog:
    def __init__(self, classification_process :ClassificationProcess,status :str, result :str):
        self.classification_id = classification_process.id
        self.dataset = classification_process.dataset.dataset_id
        self.user =classification_process.dataset.user
        self.model = classification_process.model_name
        self.status = status
        self.result = result
        self.timestamp = datetime.now()
    
    def to_dict(self):
        return {
            'classification_id': self.classification_id,
            'dataset': self.dataset,
            'user': self.user.id,
            'model': self.model,
            'status': self.status,
            'result': self.result,
            'timestamp': self.timestamp.strftime('%Y-%m-%dT%H:%M:%S.%f')
        }

    def save(self):
        path = f'data/{self.user}/{self.dataset}/classification_{self.classification_id}.json'
        with open(path, 'w') as file:
            file.write(json.dumps(self.to_dict()))

@shared_task
def predict_dataset(classification_id:int):
    try:
        classification_process = ClassificationProcess.objects.get(id = classification_id)
    except Exception as ex:
        print(ex)
    try:
        classification_process.status = "PROCESSING"
        classification_process.save()

        predictor = classification_process.parameters['predictor']
        if classification_process.parameters['predictor'] == "FEW_SHOT":
            predictor = FewShotPredictor(classification_process)
        elif classification_process.parameters['predictor'] == "ZERO_SHOT":
            predictor = ZeroShotPredictor(classification_process)
        else:
            raise Exception(f'Predictor not supported: {predictor}')
        
        res = predictor.predict()

        log = ClassificationLog(classification_process, "FINISHED", res)
        log.save()
        classification_process.status = "FINISHED"
        classification_process.save()
    except Exception as ex:
        handleException(classification_process, ex)

def handleException(classification_process :ClassificationProcess, ex :Exception):
    classification_process.status = "ERROR"
    classification_process.save()
    error_result = {
        'message': str(ex),
        'stacktrace': traceback.format_exc()
    }
    log = ClassificationLog(classification_process, "ERROR", error_result)
    log.save()

