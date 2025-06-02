from rest_framework import serializers
from apps.classifications.models import ClassificationProcess

class ClassificationProcessesSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    dataset = serializers.StringRelatedField()

    class Meta:
        model = ClassificationProcess
        fields = '__all__'