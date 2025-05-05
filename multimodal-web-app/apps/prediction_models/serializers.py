from rest_framework import serializers
from apps.prediction_models.models import HuggingFaceModel

class HuggingFaceModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = HuggingFaceModel
        fields = '__all__'