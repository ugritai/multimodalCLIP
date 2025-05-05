from django.contrib import admin
from apps.prediction_models.models import HuggingFaceModel

# Register your models here.
admin.site.register(HuggingFaceModel)