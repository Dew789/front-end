from django.db import models

class TopClass(models.Model):
    name = models.CharField(max_length=10, unique=True)

    def __str__():
        return name


class SecondClass(models.Model):
    name = models.CharField(max_length=10)
    top_class = models.ForeignKey(TopClass)

    def __str__():
        return name


class Task(models.Model):
    task_text = models.CharField(max_length=200)
    due_date = models.DateTimeField('deadline')        
    caption = models.CharField(max_length=30)
    status = models.BooleanField(default=False)
    second_class = models.ForeignKey(SecondClass)
    top_class = models.ForeignKey(TopClass)

    def __str__(self):
        return "%s %s\n %s" % (caption, due_date, task_text)
