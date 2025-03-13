from django.urls import path
from . import views


urlpatterns = [
    path('classify_image/', views.classify_image),
    path('zero_shot_prediction/', views.zero_shot_prediction),
    path('predict_csv/', views.predict_csv),
]
