from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets
from django.shortcuts import render
from django.http import JsonResponse, HttpResponseNotAllowed, HttpResponse

# Create your views here.

@csrf_exempt
def compare_multimodal(request):
    if request.method != "POST":
        return HttpResponse(status=405)
    else:
        return JsonResponse({"status": "OK"})
