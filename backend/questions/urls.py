from django.urls import path
from .views import (
    QuestionListCreateView,
    QuestionDetailView,
    AnswerCreateView,
    AnswerDetailView,
    CommentCreateView,
    TagListView,
    vote_question,
    vote_answer,
    accept_answer,
)

urlpatterns = [
    # Questions
    path('questions/', QuestionListCreateView.as_view(), name='question_list'),
    path('questions/<int:pk>/', QuestionDetailView.as_view(), name='question_detail'),
    
    # Answers
    path('questions/<int:question_id>/answers/', AnswerCreateView.as_view(), name='answer_create'),
    path('answers/<int:pk>/', AnswerDetailView.as_view(), name='answer_detail'),
    path('answers/<int:pk>/accept/', accept_answer, name='accept_answer'),
    
    # Comments
    path('answers/<int:answer_id>/comments/', CommentCreateView.as_view(), name='comment_create'),
    
    # Votes
    path('questions/<int:pk>/vote/', vote_question, name='vote_question'),
    path('answers/<int:pk>/vote/', vote_answer, name='vote_answer'),
    
    # Tags
    path('tags/', TagListView.as_view(), name='tag_list'),

]

