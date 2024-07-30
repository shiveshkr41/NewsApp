from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .serializers import CategorySerializer, PostSerializer, CommentSerializer, CategoryNameSerializer
from newsApp.models import Category, Post, Comment
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import ensure_csrf_cookie
from django.urls import reverse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, UserLoginSerializer
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer
from rest_framework import viewsets
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import AllowAny


from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})

def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = authenticate(username=data['username'], password=data['password'])
        if user is not None:
            login(request, user)
            return JsonResponse({'status': 'Login successful'})
        else:
            return JsonResponse({'status': 'Invalid credentials'}, status=401)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@ensure_csrf_cookie
def check_login_status(request):
    if request.user.is_authenticated:
        return JsonResponse({'status': 'Authenticated'})
    else:
        return JsonResponse({'status': 'Not authenticated'}, status=401)

def logout_view(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'status': 'Logged out'})
    return JsonResponse({'error': 'Invalid request method'}, status=405)

class CategoryPostsAPIView(APIView):
    def get(self, request, pk=None):
        if pk is None:
            return Response({"error": "Category not found."}, status=status.HTTP_404_NOT_FOUND)

        category = get_object_or_404(Category, id=pk)
        posts = Post.objects.filter(categories=category, status='1').order_by('-date_created')
        posts_serializer = PostSerializer(posts, many=True)
        
        latest_posts = Post.objects.filter(status='1').order_by('-date_created')[:10]
        latest_serializer = PostSerializer(latest_posts, many=True)
        
        data = {
            'category': CategorySerializer(category).data,
            'page': 'category_post',
            'page_title': f'{category.name} Posts',
            'posts': posts_serializer.data,
            'latest': latest_serializer.data
        }

        return Response(data, status=status.HTTP_200_OK)



class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'id' 



class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class PostListView(generics.ListCreateAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        return Post.objects.filter(status=1).order_by('-date_created')
    
class CategoryListView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer



class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class CommentListView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        user.save()
        token = Token.objects.create(user=user)
        return Response({'token': token.key, 'user': serializer.data})
    return Response(serializer.errors, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(user)
    return Response({'token': token.key, 'user': serializer.data})

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed!")
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    if request.method == 'POST':
        request.user.auth_token.delete()
        logout(request)
        return Response({'status': 'success'}, status=status.HTTP_200_OK)
    else:
        return Response({'status': 'failed'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    serializer = UserSerializer(user, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_password(request):
    user = request.user
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        if not user.check_password(serializer.data.get('password')):
            return Response({'status': 'failed', 'msg': 'Current password is incorrect'},
                            status=status.HTTP_400_BAD_REQUEST)
        user.set_password(serializer.data.get('new_password'))
        user.save()
        return Response({'status': 'success', 'msg': 'Password updated successfully'},
                        status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_posts(request):
    posts = Post.objects.filter(user=request.user)
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def manage_post(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == 'PUT':
        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

from django.http import JsonResponse
def home(request):
    posts = Post.objects.filter(status='1').order_by('-date_created').all()
    latest_top = posts[:2]
    latest_bottom = posts[2:12]

    data = {
        'page': 'home',
        'page_title': 'Home',
        'latest_top': [{
            'id': post.id,
            'title': post.title,
            'short_description': post.short_description,
            'content': post.content,
            'date_created': post.date_created,
            'username': post.user.username,
        } for post in latest_top],
        'latest_bottom': [{
            'id': post.id,
            'title': post.title,
            'short_description': post.short_description,
            'content': post.content,
            'date_created': post.date_created,
            'username': post.user.username,
        } for post in latest_bottom],
    }
    return JsonResponse(data)



@api_view(['GET'])
@permission_classes([AllowAny])
def get_category_name(request, pk):
    category = get_object_or_404(Category, pk=pk)
    serializer = CategoryNameSerializer(category)
    return Response(serializer.data)