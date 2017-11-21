#!/usr/bin/env python
from django.db import models


class _BaseCLass(object):

    def task_all(self):
        d = {}
        for task in self.tasks:
            due_date = task.due_date.__str__()
            item = (task.caption, task.pk, task.status)
            if due_date in d:
                d[due_date].append(item)
            else:
                d[due_date] = [item]
        return d

    def task_todo(self):
        d = {}
        for task in self.tasks:
            if not task.status:
                due_date = task.due_date.__str__()
                item = (task.caption, task.pk, task.status)
                if due_date in d:
                    d[due_date].append(item)
                else:
                    d[due_date] = [item]
        return d

    def task_finish(self):
        d = {}
        for task in self.tasks:
            if task.status:
                due_date = task.due_date.__str__()
                item = (task.caption, task.pk, task.status)
                if due_date in d:
                    d[due_date].append(item)
                else:
                    d[due_date] = [item]
        return d

    def todo_num(self):
        count = 0
        for task in self.tasks:
            if not task.status:
                count+=1

        return count

    def __str__(self):
        return self.name
        

class TopClass(_BaseCLass, models.Model):
    name = models.CharField(max_length=10, unique=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        task_list = []
        for task in self.task_set.all():
            task_list.append(task)
        for sec_class in self.secondclass_set.all():
            for task in sec_class.task_set.all():
                task_list.append(task)
        self.tasks = task_list


class SecondClass(_BaseCLass, models.Model):
    name = models.CharField(max_length=10)
    top_class = models.ForeignKey(TopClass)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        task_list = []
        for task in self.task_set.all():
            task_list.append(task)
        self.tasks = task_list


class Task(models.Model):
    task_text = models.CharField(max_length=200)
    due_date = models.DateField('deadline')
    caption = models.CharField(max_length=30)
    status = models.BooleanField(default=False)
    second_class = models.ForeignKey(SecondClass, null=True)
    top_class = models.ForeignKey(TopClass, null=True)

    @classmethod
    def task_all(cls):
        d = {}
        for task in cls.objects.all():
            due_date = task.due_date.__str__()
            item = (task.caption, task.pk, task.status)
            if due_date in d:
                d[due_date].append(item)
            else:
                d[due_date] = [item]
        return d

    @classmethod
    def task_todo(cls):
        d = {}
        for task in cls.objects.all():
            if not task.status:
                due_date = task.due_date.__str__()
                item = (task.caption, task.pk, task.status)
                if due_date in d:
                    d[due_date].append(item)
                else:
                    d[due_date] = [item]
        return d

    @classmethod
    def task_finish(cls):
        d = {}
        for task in cls.objects.all():
            if task.status:
                due_date = task.due_date.__str__()
                item = (task.caption, task.pk, task.status)
                if due_date in d:
                    d[due_date].append(item)
                else:
                    d[due_date] = [item]
        return d

    def __str__(self):
        return "%s %s\n %s" % (self.caption, self.due_date, self.task_text)
