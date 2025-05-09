from celery import shared_task
from apps.datasets.models import Dataset
from apps.classifications.models import ClassificationProcess
import time


@shared_task
def predict_dataset(dataset_id:int, classification_id:int, model_name:str):
    try:
        time.sleep(10)
        classification_process = ClassificationProcess.objects.get(id = classification_id)
        classification_process.status = "PROCESSING"
        classification_process.save()
        time.sleep(10)
        classification_process.status = "FINISHED"
        classification_process.save()
    except Exception as ex: 
        print(ex)
        if classification_process:
            classification_process.status = "ERROR"
            classification_process.save()

