from rest_framework.decorators import api_view
from django.shortcuts import render
from django.http import JsonResponse, HttpResponseNotAllowed, HttpResponse

# Create your views here.

@api_view(['POST'])
def compare_multimodal(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    else:
        return JsonResponse({"status": "OK"})
