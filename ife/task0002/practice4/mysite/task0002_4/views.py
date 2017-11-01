import json
from django.shortcuts import HttpResponse, render
from django.http import JsonResponse


def index(request):
    context = {}
    return render(request, 'task0002_4.html', context)

def suggest(request):
    input = request.POST["input"]
    return_json = {
        "hint" : [input+"123", input+"abc", input+"666", 
                    input+"233", input+"hehe",  input+"er"]
    }
    return JsonResponse(return_json)
