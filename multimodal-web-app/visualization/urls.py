from django.urls import path, include
from . import views
from rest_framework import routers
from rest_framework.documentation import include_docs_urls

# router = routers.DefaultRouter()
# router.register(f'visualizations', VisualizationView, 'visualizations')

urlpatterns = [
    # path('api/v1/', include(router.urls)),
    # path('docs/', include_docs_urls(title="Visualization")),
    path('compare', views.compare_multimodal)
]
