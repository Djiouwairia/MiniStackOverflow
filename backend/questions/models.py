from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Tag(models.Model):
    """Tag model for categorizing questions"""
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']


class Question(models.Model):
    """Question model"""
    title = models.CharField(max_length=300)
    content = models.TextField()
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='questions'
    )
    tags = models.ManyToManyField(Tag, related_name='questions')
    views = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    @property
    def vote_count(self):
        return self.votes.filter(value=1).count() - self.votes.filter(value=-1).count()
    
    @property
    def answer_count(self):
        return self.answers.count()
    
    @property
    def has_accepted_answer(self):
        return self.answers.filter(is_accepted=True).exists()
    
    class Meta:
        ordering = ['-created_at']


class Answer(models.Model):
    """Answer model"""
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name='answers'
    )
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='answers'
    )
    content = models.TextField()
    is_accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Answer by {self.author.username} on {self.question.title}"
    
    @property
    def vote_count(self):
        return self.votes.filter(value=1).count() - self.votes.filter(value=-1).count()
    
    class Meta:
        ordering = ['-is_accepted', '-created_at']


class Comment(models.Model):
    """Comment model for answers"""
    answer = models.ForeignKey(
        Answer,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    content = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Comment by {self.author.username}"
    
    class Meta:
        ordering = ['created_at']


class Vote(models.Model):
    """Vote model for questions and answers"""
    VOTE_CHOICES = (
        (1, 'Upvote'),
        (-1, 'Downvote'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    value = models.SmallIntegerField(choices=VOTE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Generic relation to vote on questions or answers
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name='votes',
        null=True,
        blank=True
    )
    answer = models.ForeignKey(
        Answer,
        on_delete=models.CASCADE,
        related_name='votes',
        null=True,
        blank=True
    )
    
    class Meta:
        # Ensure a user can only vote once per question/answer
        unique_together = [
            ['user', 'question'],
            ['user', 'answer']
        ]
    
    def __str__(self):
        if self.question:
            return f"{self.user.username} voted {self.value} on question"
        return f"{self.user.username} voted {self.value} on answer"
