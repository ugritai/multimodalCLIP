from django.conf import settings
from django.db import models

# Create your models here.
class HuggingFaceModel(models.Model):
    model_id = models.AutoField(primary_key=True)
    model_name = models.CharField(max_length=255)
    upload_date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    class Meta:
        constraints = [
        models.UniqueConstraint(fields=['user', 'model_name'], name='unique model name per user')
    ]