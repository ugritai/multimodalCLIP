# visualization/routing.py
from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/visualize/", consumers.VisualizationConsumer.as_asgi()),
]