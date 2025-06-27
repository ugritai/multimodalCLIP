from rest_framework import serializers
from apps.datasets.models import Dataset

class DatasetSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    class Meta:
        model = Dataset
        fields = '__all__'