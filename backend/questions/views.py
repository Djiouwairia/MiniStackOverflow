from rest_framework import generics, permissions, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Q
from .models import Question, Answer, Comment, Tag, Vote
from .serializers import (
    QuestionListSerializer,
    QuestionDetailSerializer,
    AnswerSerializer,
    CommentSerializer,
    TagSerializer,
    VoteSerializer
)


class QuestionListCreateView(generics.ListCreateAPIView):
    """List all questions or create a new question"""
    queryset = Question.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'views']
    filterset_fields = ['tags']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return QuestionDetailSerializer
        return QuestionListSerializer
    
    def get_queryset(self):
        queryset = Question.objects.all()
        
        # Filter by tag name
        tag_name = self.request.query_params.get('tag', None)
        if tag_name:
            queryset = queryset.filter(tags__name=tag_name)
        
        # Filter unanswered questions
        unanswered = self.request.query_params.get('unanswered', None)
        if unanswered:
            queryset = queryset.annotate(num_answers=Count('answers')).filter(num_answers=0)
        
        # Sort by popularity (votes)
        sort = self.request.query_params.get('sort', None)
        if sort == 'votes':
            queryset = queryset.annotate(
                vote_sum=Count('votes', filter=Q(votes__value=1)) - Count('votes', filter=Q(votes__value=-1))
            ).order_by('-vote_sum')
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class QuestionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete a question"""
    queryset = Question.objects.all()
    serializer_class = QuestionDetailSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1
        instance.save(update_fields=['views'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def perform_update(self, serializer):
        # Only author can update
        if serializer.instance.author != self.request.user:
            return Response(
                {"detail": "Vous ne pouvez modifier que vos propres questions."},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save()
    
    def perform_destroy(self, instance):
        # Only author can delete
        if instance.author != self.request.user:
            return Response(
                {"detail": "Vous ne pouvez supprimer que vos propres questions."},
                status=status.HTTP_403_FORBIDDEN
            )
        instance.delete()


class AnswerCreateView(generics.CreateAPIView):
    """Create an answer to a question"""
    serializer_class = AnswerSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        question_id = self.kwargs.get('question_id')
        serializer.save(
            author=self.request.user,
            question_id=question_id
        )


class AnswerDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update or delete an answer"""
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def perform_update(self, serializer):
        if serializer.instance.author != self.request.user:
            return Response(
                {"detail": "Vous ne pouvez modifier que vos propres réponses."},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save()
    
    def perform_destroy(self, instance):
        if instance.author != self.request.user:
            return Response(
                {"detail": "Vous ne pouvez supprimer que vos propres réponses."},
                status=status.HTTP_403_FORBIDDEN
            )
        instance.delete()


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def accept_answer(request, pk):
    """Accept an answer as the best answer"""
    try:
        answer = Answer.objects.get(pk=pk)
        question = answer.question
        
        # Only question author can accept answer
        if question.author != request.user:
            return Response(
                {"detail": "Seul l'auteur de la question peut accepter une réponse."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Remove previous accepted answer if exists
        Answer.objects.filter(question=question, is_accepted=True).update(is_accepted=False)
        
        # Accept this answer
        answer.is_accepted = True
        answer.save()
        
        serializer = AnswerSerializer(answer, context={'request': request})
        return Response(serializer.data)
    
    except Answer.DoesNotExist:
        return Response(
            {"detail": "Réponse introuvable."},
            status=status.HTTP_404_NOT_FOUND
        )


class CommentCreateView(generics.CreateAPIView):
    """Create a comment on an answer"""
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        answer_id = self.kwargs.get('answer_id')
        serializer.save(
            author=self.request.user,
            answer_id=answer_id
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def vote_question(request, pk):
    """Vote on a question"""
    try:
        question = Question.objects.get(pk=pk)
        value = request.data.get('value')
        
        if value not in [1, -1]:
            return Response(
                {"detail": "La valeur du vote doit être 1 ou -1."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update or create vote
        vote, created = Vote.objects.update_or_create(
            user=request.user,
            question=question,
            defaults={'value': value}
        )
        
        return Response({
            "vote_count": question.vote_count,
            "user_vote": value
        })
    
    except Question.DoesNotExist:
        return Response(
            {"detail": "Question introuvable."},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def vote_answer(request, pk):
    """Vote on an answer"""
    try:
        answer = Answer.objects.get(pk=pk)
        value = request.data.get('value')
        
        if value not in [1, -1]:
            return Response(
                {"detail": "La valeur du vote doit être 1 ou -1."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update or create vote
        vote, created = Vote.objects.update_or_create(
            user=request.user,
            answer=answer,
            defaults={'value': value}
        )
        
        return Response({
            "vote_count": answer.vote_count,
            "user_vote": value
        })
    
    except Answer.DoesNotExist:
        return Response(
            {"detail": "Réponse introuvable."},
            status=status.HTTP_404_NOT_FOUND
        )


class TagListView(generics.ListAPIView):
    """List all tags"""
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.AllowAny]
