from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError


class User(AbstractUser):
    """Custom User model"""
    email = models.EmailField(unique=True, blank=False, null=False)
    bio = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    reputation = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.username
    
    def clean(self):
        """Validation avant sauvegarde"""
        super().clean()
        
        # Valider que l'email n'est pas vide
        if not self.email:
            raise ValidationError({'email': 'Email est obligatoire'})
        
        # Valider le format de l'email
        if '@' not in self.email:
            raise ValidationError({'email': 'Email invalide'})
    
    def save(self, *args, **kwargs):
        """Forcer la validation avant sauvegarde"""
        self.full_clean()
        super().save(*args, **kwargs)
    
    class Meta:
        ordering = ['-created_at']