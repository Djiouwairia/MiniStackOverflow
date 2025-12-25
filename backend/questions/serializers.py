from rest_framework import serializers
from .models import Question, Answer, Comment, Tag, Vote
from users.serializers import UserSerializer


class TagSerializer(serializers.ModelSerializer):
    questions_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Tag
        fields = ['id', 'name', 'description', 'questions_count']
    
    def get_questions_count(self, obj):
        return obj.questions.count()


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']


class AnswerSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    vote_count = serializers.ReadOnlyField()
    user_vote = serializers.SerializerMethodField()
    
    class Meta:
        model = Answer
        fields = [
            'id', 'question', 'author', 'content', 'is_accepted',
            'vote_count', 'user_vote', 'comments', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_accepted']
    
    def get_user_vote(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            vote = Vote.objects.filter(user=request.user, answer=obj).first()
            return vote.value if vote else None
        return None


class QuestionListSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    vote_count = serializers.ReadOnlyField()
    answer_count = serializers.ReadOnlyField()
    has_accepted_answer = serializers.ReadOnlyField()
    
    class Meta:
        model = Question
        fields = [
            'id', 'title', 'author', 'tags', 'vote_count',
            'answer_count', 'has_accepted_answer', 'views', 'created_at'
        ]


class QuestionDetailSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Tag.objects.all(),
        source='tags',
        write_only=True
    )
    answers = AnswerSerializer(many=True, read_only=True)
    vote_count = serializers.ReadOnlyField()
    answer_count = serializers.ReadOnlyField()
    user_vote = serializers.SerializerMethodField()
    
    class Meta:
        model = Question
        fields = [
            'id', 'title', 'content', 'author', 'tags', 'tag_ids',
            'vote_count', 'answer_count', 'answers', 'user_vote',
            'views', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'views', 'created_at', 'updated_at']
    
    def get_user_vote(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            vote = Vote.objects.filter(user=request.user, question=obj).first()
            return vote.value if vote else None
        return None


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['value']
