from django.db import models

# Create your models here.
class HuggingFaceModel(models.Model):
    model_name = models.CharField(primary_key=True, max_length=255)
    upload_date = models.DateTimeField(auto_now_add=True)