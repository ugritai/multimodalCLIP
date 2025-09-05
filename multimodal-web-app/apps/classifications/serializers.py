from rest_framework import serializers
from apps.classifications.models import ClassificationProcess

class ClassificationProcessesSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    dataset = serializers.StringRelatedField()

    class Meta:
        model = ClassificationProcess
        fields = '__all__'

class NewClassificationRequestSerializer(serializers.Serializer):
    dataset_id = serializers.IntegerField()
    mode = serializers.CharField()
    fusion_method = serializers.CharField()
    predictor = serializers.CharField()
    model_name = serializers.CharField()
    class_column = serializers.CharField()
    descriptions = serializers.ListField(
        child=serializers.CharField(), allow_empty=False
    )
    text_column = serializers.CharField()
    image_column = serializers.CharField()
    
    sample_size = serializers.IntegerField()
    reference_sample_size = serializers.IntegerField(required=False)