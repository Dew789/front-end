from django.db import models

class TopClass(models.Model):
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

    def __str__(self):
        return self.name


class SecondClass(models.Model):
    name = models.CharField(max_length=10)
    top_class = models.ForeignKey(TopClass)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        task_list = []
        for task in self.task_set.all():
            task_list.append(task)
        self.tasks = task_list

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

    def __str__(self):
        return self.name


class Task(models.Model):
    task_text = models.CharField(max_length=200)
    due_date = models.DateField('deadline')
    caption = models.CharField(max_length=30)
    status = models.BooleanField(default=False)
    second_class = models.ForeignKey(SecondClass, null=True)
    top_class = models.ForeignKey(TopClass, null=True)

    def __str__(self):
        return "%s %s\n %s" % (self.caption, self.due_date, self.task_text)
