import os
from django.db import models
from django.conf import settings
from enum import Enum
from datasets import load_dataset
import pandas as pd

class DatasetTypes(Enum):
    CSV = 'csv'
    HUGGING_FACE = 'huggingface'

DATASET_TYPES = [(x.value, x.value) for x in DatasetTypes]

# Create your models here.
class Dataset(models.Model):
    dataset_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    dataset_name = models.CharField(max_length=255)
    upload_date = models.DateTimeField(auto_now_add=True)
    dataset_type = models.CharField(max_length=255, choices=DATASET_TYPES)
    separator = models.CharField(max_length=1, null=True)
    metadata = models.JSONField(null=True)
    private  = models.BooleanField(default=False)

    def __str__(self):
        return self.dataset_name

    class Meta:
        constraints = [
        models.UniqueConstraint(fields=['user', 'dataset_name'], name='unique filename per user')
    ]
        
    def load_dataset_as_pandas(self):
        if self.dataset_type == DatasetTypes.CSV.value:
            return self._load_from_disk()
        elif self.dataset_type == DatasetTypes.HUGGING_FACE.value:
            return self._load_from_hugging_face()

    def _load_from_disk(self):
        file_path = f'data/{self.user.username}/{self.dataset_id}/{self.dataset_name}'
        if not os.path.exists(file_path):
            raise Exception(f'Dataset {self.dataset_name} not found in disk')
        
        df = pd.read_table(file_path, delimiter=self.separator, index_col=False)
        return df

    def _load_from_hugging_face(self):
        ds = load_dataset(self.dataset_name, self.metadata['config'], split=self.metadata['split'])
        return ds.to_pandas()