import datetime


from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse

class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published')

    def __str__(self):
        return self.question_text

    def was_published_recently(self):
        return now - datetime.timedelta(days=1) <= self.pub_date <= now

    def get_absolute_url(self):
        return reverse('polls:detail', args=(self.id,))


class Choice(models.Model):
    # The Beloged Choice
    question = models.ForeignKey(Question)
    # The User select the choice
    user = models.ManyToManyField(User, blank=True, related_name='user_choice')
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)

    def __str__(self):
        return self.choice_text
