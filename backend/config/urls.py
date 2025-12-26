from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse  # AJOUTE CET IMPORT

def api_root(request):
    """Vue pour la racine qui affiche les endpoints disponibles"""
    return JsonResponse({
        'message': 'Mini StackOverflow API',
        'endpoints': {
            'admin': '/admin/',
            'api_auth': '/api/auth/',
            'api_questions': '/api/questions/',
            'api_tags': '/api/tags/',
        },
        'status': 'operational',
        'version': '1.0'
    })

urlpatterns = [
    path('', api_root, name='root'),  # AJOUTE CETTE LIGNE
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/', include('questions.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    