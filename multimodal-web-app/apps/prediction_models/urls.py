from django.urls import path
from . import views


urlpatterns = [
    path('upload/', views.upload_model),
    path('delete/', views.delete_model),
    path('get_all/', views.get_all_models),
]