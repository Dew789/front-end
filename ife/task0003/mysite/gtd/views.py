from django.shortcuts import render
from django.http import HttpResponse, QueryDict
from django.views.generic import View
from django.db import IntegrityError
from django.core.exceptions import ObjectDoesNotExist


from .models import TopClass, SecondClass, Task


def index(request):
    context = {}
    default_obj = TopClass.objects.get(name="默认分类")
    context['default'] = default_obj
    context['top_class_list'] = TopClass.objects.all()[1:]
    context['default_task'] = default_obj.task_all()
    print(default_obj.task_all())
    return render(request, 'task0003.html', context)

class TopClassView(View):

    def post(self, request):
        name = request.POST['name']
        item = TopClass(name=name)
        try:
            item.save()
        except IntegrityError:
            return HttpResponse(status=500, content="名字重复, ")
        except:
            return HttpResponse(status=500)
        return HttpResponse(status=200, content=item.pk)


class TopClassItemView(View):

    def delete(self, request, classid):
        item = TopClass.objects.get(pk=classid)
        item.delete()
        return HttpResponse(status=200)


class SecondClassView(View):

    def post(self, request):
        name = request.POST['name']
        top_class_name = request.POST['topClass']
        try:
            top_class = TopClass.objects.get(name=top_class_name)
        except:
            return HttpResponse(status=500, content="一级分类不存在, ")
        # 防止topclass下出现重名secondclass
        try:
            SecondClass.objects.get(name=name, top_class=top_class)
        except ObjectDoesNotExist:
            item = SecondClass(name=name, top_class=top_class)
            item.save()
            return HttpResponse(status=200, content=item.pk)
        else:
            return HttpResponse(status=500, content="名字重复, ")


class SecondClassItemView(View):

    def delete(self, request, classid):
        item = SecondClass.objects.get(pk=classid)
        item.delete()
        return HttpResponse(status=200)


class TaskView(View):

    def post(self, request):
        caption = request.POST['caption']
        duedate = request.POST['duedate']
        duedate = duedate.split(":")[1]        
        content = request.POST['content'].strip()
        id_name = request.POST['idName']
        classid = request.POST['classid']

        if id_name == "class-list":
            classid = 1
            id_name = "top-class"

        if id_name == "top-class":           
            top_class =  TopClass.objects.get(pk=classid)
            item = Task(caption=caption, due_date=duedate, 
                task_text=content, top_class=top_class)
            item.save()
        elif id_name == "second-class":
            second_class = SecondClass.objects.get(pk=classid)
            item = Task(caption=caption, due_date=duedate, 
                task_text=content, second_class=second_class)
            item.save()

        return HttpResponse(status=200)
