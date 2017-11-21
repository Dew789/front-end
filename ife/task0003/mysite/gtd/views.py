#!/usr/bin/env python
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, QueryDict
from django.views.generic import View
from django.db import IntegrityError
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.csrf import requires_csrf_token
import datetime

from .models import TopClass, SecondClass, Task


@requires_csrf_token
def index(request):
    context = {}
    default_obj = TopClass.objects.get(name="默认分类")
    context['default'] = default_obj
    context['top_class_list'] = TopClass.objects.exclude(name="默认分类")

    all_todo_num = 0
    for task in Task.objects.all():
        if not task.status:
            all_todo_num+=1
    context['all_todo_num'] = all_todo_num

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

    def delete(self, request, classid, aspect):
        item = TopClass.objects.get(pk=classid)
        item.delete()
        return HttpResponse(status=200)

    def get(self, request, classid, aspect):
        item = TopClass.objects.get(pk=classid)
        aspect = aspect.rstrip("/")

        if aspect == "all":
            resp = JsonResponse(item.task_all())
        elif aspect == "todo":
            resp = JsonResponse(item.task_todo())
        elif aspect == "finish":
            resp = JsonResponse(item.task_finish())
        return resp


class SecondClassView(View):

    def post(self, request):
        name = request.POST['name']
        top_class_name = request.POST['topClass']
        if top_class_name == "默认分类":
            return HttpResponse(status=500, content="不能添加子分类, ")

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

    def delete(self, request, classid, aspect):
        item = SecondClass.objects.get(pk=classid)
        item.delete()
        return HttpResponse(status=200)

    def get(self, request, classid, aspect):
        item = SecondClass.objects.get(pk=classid)
        aspect = aspect.rstrip("/")

        if aspect == "all":
            resp = JsonResponse(item.task_all())
        elif aspect == "todo":
            resp = JsonResponse(item.task_todo())
        elif aspect == "finish":
            resp = JsonResponse(item.task_finish())
        return resp

def checkFormat(caption, duedate, content):
    if (not caption) or (not content):
        return "标题正文不能为空, "
    if len(caption) > 20:
        return "标题字数不能超过20, "
    if len(content) > 200:
        return "正文字数不能超过200, "
    try:
        year, month, day = map(int, duedate.split("-"))
        datetime.date(year, month, day)
    except:
        return "日期格式为xxxx-xx-xx,且为正确时间, "

class TaskView(View):

    def post(self, request, aspect):
        caption = request.POST['caption']
        duedate = request.POST['duedate']
        duedate = duedate.split(":")[1]
        content = request.POST['content'].strip()
        classtype = request.POST['classType']
        classid = request.POST['classid']

        result = checkFormat(caption, duedate, content)
        if result:
            return HttpResponse(status=500, content=result)

        if classtype == "top-class":
            top_class =  TopClass.objects.get(pk=classid)
            item = Task(caption=caption, due_date=duedate, 
                task_text=content, top_class=top_class)
            item.save()
        elif classtype == "second-class":
            second_class = SecondClass.objects.get(pk=classid)
            item = Task(caption=caption, due_date=duedate, 
                task_text=content, second_class=second_class)
            item.save()

        return HttpResponse(status=200, content=item.pk)

    def get(self, request, aspect):
        aspect = aspect.rstrip("/")

        if aspect == "all":
            resp = JsonResponse(Task.task_all())
        elif aspect == "todo":
            resp = JsonResponse(Task.task_todo())
        elif aspect == "finish":
            resp = JsonResponse(Task.task_finish())
        return resp


class TaskItemView(View):

    def delete(self ,request, taskid):
        item = Task.objects.get(pk=taskid)
        if item.top_class:
            class_item = item.top_class
        else:
            class_item = item.second_class
        class_type = class_item.__class__.__name__
        class_type = class_type[0:-5].lower() + "-" + "class"
        t = {
            "class_type": class_type,
            "class_id": class_item.pk
        }

        item.delete()
        return JsonResponse(t)

    def get(self ,request, taskid):
        item = Task.objects.get(pk=taskid)
        result = {}
        result["title"] = item.caption
        result["date"] = item.due_date.__str__()
        result["content"] = item.task_text
        result["status"] = item.status

        resp = JsonResponse(result)
        return resp

    def put(self ,request, taskid):
        item = Task.objects.get(pk=taskid)
        data = QueryDict(request.body)
        if data.get("status"):
            item.status = True
            if item.top_class:
                class_item = item.top_class
            else:
                class_item = item.second_class
            class_type = class_item.__class__.__name__
            class_type = class_type[0:-5].lower() + "-" + "class"
            t = {
                "class_type": class_type,
                "class_id": class_item.pk
            }

            item.save()
            return JsonResponse(t)
        else:
            caption = data['caption']
            duedate = data['duedate']
            duedate = duedate.split(":")[1]
            content = data['content'].strip()

            result = checkFormat(caption, duedate, content)
            if result:
                return HttpResponse(status=500, content=result)

            item.task_text = content
            item.due_date = duedate
            item.caption = caption
            item.save()
        return HttpResponse(status=200)
