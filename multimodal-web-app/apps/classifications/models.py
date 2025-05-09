from django.db import models
from apps.datasets.models import Dataset

STATUSES = [
    ('IN_QUEUE', 'IN_QUEUE'),
    ('PROCESSING', 'PROCESSING'),
    ('FINISHED', 'FINISHED'),
    ('ERROR', 'ERROR'),
]

# Create your models here.
class ClassificationProcess(models.Model):
    id = models.AutoField(primary_key=True)
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE)
    creation_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=255, choices=STATUSES, default='UNQUEUE')
    model_name = models.CharField(max_length=255)