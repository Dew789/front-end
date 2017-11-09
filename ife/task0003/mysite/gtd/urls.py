from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^topclass/$', views.TopClassView.as_view(), name='topclass'),
    url(r'^topclass/(?P<name>\S+)/$', 
        views.TopClassItemView.as_view(), name='topclassitem') 
]
