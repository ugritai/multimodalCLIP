from django.urls import path
from . import views


urlpatterns = [
    path('upload/', views.upload_model),
    path('<int:model_id>/delete/', views.delete_model),
    path('<str:username>/', views.get_user_models),
]