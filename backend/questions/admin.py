from django.contrib import admin
from .models import Question, Answer, Comment, Tag, Vote


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'created_at', 'views']
    list_filter = ['created_at', 'tags']
    search_fields = ['title', 'content']
    filter_horizontal = ['tags']


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ['question', 'author', 'is_accepted', 'created_at']
    list_filter = ['is_accepted', 'created_at']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['answer', 'author', 'created_at']
    list_filter = ['created_at']


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ['user', 'value', 'question', 'answer', 'created_at']
    list_filter = ['value', 'created_at']
