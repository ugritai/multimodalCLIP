from django.urls import path
from djoser.views import TokenCreateView, TokenDestroyView
from . import views

accounts_urlpatterns = [
    path('auth/login/', TokenCreateView.as_view()),
    path('auth/logout/', TokenDestroyView.as_view()),
    path('auth/password/change/', views.change_password),
]