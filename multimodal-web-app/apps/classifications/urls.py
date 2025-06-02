from django.urls import path
from . import views


urlpatterns = [
     path('test_celery/', views.test_celery),
     path('<str:username>/', views.get_user_classifications),
]
