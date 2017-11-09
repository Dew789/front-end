from django.shortcuts import render
from django.http import HttpResponse, QueryDict
from django.views.generic import View
from django.db import IntegrityError

from .models import TopClass, SecondClass, Task


def index(request):
    top_class = TopClass.objects.all()
    context = {}
    context['top_class'] = top_class
    return render(request, 'task0003.html', context)

class TopClassView(View):

    def post(self, request):
        name = request.POST['name']
        item = TopClass(name = name)
        try:
            item.save()
        except IntegrityError:
            return HttpResponse(status=500, content="名字重复,")
        return HttpResponse(status=200)


class TopClassItemView(View):

    def delete(self, request, name):
        item = TopClass.objects.get(name = name)
        item.delete()
        return HttpResponse(status=200)
        