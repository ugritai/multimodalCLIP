from django.urls import path
from . import views


urlpatterns = [
    path('upload/', views.upload_csv),
    path('<str:username>/', views.get_user_datasets),
    path('<int:dataset_id>/delete/', views.delete_dataset),
    path('<int:dataset_id>/download/', views.download_dataset),
    path('<int:dataset_id>/snippet/', views.get_dataset_snippet),
]
