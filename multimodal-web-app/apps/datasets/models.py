from django.db import models
from django.conf import settings

DATASET_TYPES = [('csv', 'csv')]

# Create your models here.
class Dataset(models.Model):
    dataset_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    dataset_name = models.CharField(max_length=255)
    upload_date = models.DateTimeField(auto_now_add=True)
    dataset_type = models.CharField(max_length=255, choices=DATASET_TYPES)
    separator = models.CharField(max_length=1, null=True)

    class Meta:
        constraints = [
        models.UniqueConstraint(fields=['user', 'dataset_name'], name='unique filename per user')
    ]