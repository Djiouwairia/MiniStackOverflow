from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    questions_count = serializers.SerializerMethodField()
    answers_count = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'bio', 'avatar',
            'reputation', 'created_at', 'questions_count', 'answers_count'
        ]
        read_only_fields = ['id', 'reputation', 'created_at']
    
    def get_questions_count(self, obj):
        return obj.questions.count()
    
    def get_answers_count(self, obj):
        return obj.answers.count()


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password": "Les mots de passe ne correspondent pas."
            })
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Detailed user profile serializer"""
    questions_count = serializers.SerializerMethodField()
    answers_count = serializers.SerializerMethodField()
    total_votes = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'bio', 'avatar',
            'reputation', 'created_at', 'questions_count',
            'answers_count', 'total_votes'
        ]
    
    def get_questions_count(self, obj):
        return obj.questions.count()
    
    def get_answers_count(self, obj):
        return obj.answers.count()
    
    def get_total_votes(self, obj):
        questions_votes = sum([q.vote_count for q in obj.questions.all()])
        answers_votes = sum([a.vote_count for a in obj.answers.all()])
        return questions_votes + answers_votes
