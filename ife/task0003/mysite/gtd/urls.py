#!/usr/bin/env python
from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),

    url(r'^topclass/$', views.TopClassView.as_view(), name='topclass'),
    url(r'^topclass/(?P<classid>\d+)/(?P<aspect>(?:all|todo|finish)/)?$', 
        views.TopClassItemView.as_view(), name='topclassitem'),

    url(r'^secondclass/$', views.SecondClassView.as_view(), 
        name='secondclass'),
    url(r'^secondclass/(?P<classid>\d+)/(?P<aspect>(?:all|todo|finish)/)?$', 
        views.SecondClassItemView.as_view(), name='secondclassitem'),

    url(r'^task/(?P<aspect>(?:all|todo|finish)/)?$', views.TaskView.as_view(), name='task'),
    url(r'^task/(?P<taskid>\d+)/$', views.TaskItemView.as_view(), name='taskitem'),
]
