from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, render
import json


from django.core.urlresolvers import reverse
from django.views import generic
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from .models import Question, Choice
from .forms import LoginForm, UserRegistrationForm
from django.contrib import messages

# class IndexView(generic.ListView):
#     template_name = 'polls/index.html'
#     context_object_name = 'latest_question_list'
# 
#     def get_queryset(self):
#         """Return the last five published questions."""
#         return Question.objects.filter(pub_date__lte=timezone.now()).order_by('-pub_date')[:5]
# 
# class DetailView(generic.DetailView):
#     model = Question
#     template_name = 'polls/detail.html'
# 
#     def get_queryset(self):
#         """Excludes any questions that aren't published yet."""
#         return Question.objects.filter(pub_date__lte=timezone.now())
# 
# class ResultsView(generic.DetailView):
#     model = Question
#     template_name = 'polls/results.html'


def index(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            user = authenticate(username=cd['username'],
                                password=cd['password'])
            if user is not None:
                login(request, user)
                return HttpResponseRedirect(reverse('polls:index'))
            else:
                messages.error(request, 'Wrong user or password')
        else:
            messages.error(request, 'Invalid login')
    else:
        form = LoginForm()
    context = {}
    latest_question_list = Question.objects.filter(pub_date__lte=timezone.now()).order_by('-pub_date')[:5]
    context['latest_question_list'] = latest_question_list
    context['form'] = form
    return render(request, 'index/ftmp_121_ub/index.html', context)

def detail(request, question_id):
    if request.user.is_authenticated:
        question = Question.objects.get(pub_date__lte=timezone.now(), pk=question_id)
        return render(request, 'polls/detail.html', {'question': question})
    else:
        messages.error(request, 'Login to Vote')
        return HttpResponseRedirect(reverse('polls:index'))

def results(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    context = {'question': question}
    # Calculate the user's name
    users = ''
    user_count = 0
    for choice in question.choice_set.all():
        for user in choice.user.all():
            user_count += 1
            users = users +  user.username  + ", "

    context['users'] = users
    context['user_count'] = user_count
    return render(request, 'polls/results.html', context)

@login_required
def vote(request, question_id):
    p = get_object_or_404(Question, pk=question_id)
    try:
        selected_choice = p.choice_set.get(pk=request.POST['choice'])
    except (KeyError, Choice.DoesNotExist):
        # Redisplay the question voting form.
        return render(request, 'polls/detail.html', {
            'question': p,
            'error_message': "You didn't select a choice.",
        })
    else:
        if request.user in selected_choice.user.all():
            messages.error(request, 'You have already vote!')
        else:   
            selected_choice.votes += 1
            selected_choice.user.add(request.user)
            selected_choice.save()
        return HttpResponseRedirect(reverse('polls:results', args=(p.id,)))

@login_required
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('polls:index'))

def register(request):
    if request.method == 'POST':
        user_form = UserRegistrationForm(request.POST)
        if user_form.is_valid():
            new_user = user_form.save(commit=False)
            new_user.set_password(user_form.cleaned_data['password'])
            new_user.save()
            messages.success(request, 'Congratulations! Register successfully.')
            return HttpResponseRedirect(reverse('polls:index'))
    else:
        user_form = UserRegistrationForm()
    return render(request, 'polls/register.html', {'user_form': user_form})

def get_lucky(request):
    question = Question.objects.order_by('?')[0]
    question_text = question.question_text
    question_url = request.build_absolute_uri(question.get_absolute_url())
    return_json = {
        "question_text": question_text,
        "question_url": question_url
    }
    return HttpResponse(json.dumps(return_json), content_type='application/json')
