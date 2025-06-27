from django.urls import path
from . import views


urlpatterns = [
     path('classify_dataset/', views.classify_dataset),
     path('user/<str:username>/', views.get_user_classifications),
     path('dataset/<int:dataset_id>/', views.get_dataset_classifications),
     path('<int:classification_id>/info/', views.get_classifications_info),
     path('<int:classification_id>/result/', views.get_classifications_result),
     path('<int:classification_id>/delete/', views.delete_classification),
]
