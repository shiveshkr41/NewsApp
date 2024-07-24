from django.urls import path
from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

router = DefaultRouter()
router.register('users', UserViewSet)


urlpatterns = [
     path('login/', views.login_view, name='login'),
    path('login_status/', views.check_login_status, name='login_status'),
    path('logout/', views.logout, name='api-logout'),
    path('signup/', views.signup, name='api-signup'),
    path('profile/', views.profile, name='api-profile'),
    path('update-profile/', views.update_profile, name='api-update-profile'),
    path('update-password/', views.update_password, name='api-update-password'),
    path('user-posts/', views.user_posts, name='api-user-posts'),
    path('create-post/', views.create_post, name='api-create-post'),
    path('manage-post/<int:pk>/', views.manage_post, name='api-manage-post'),
    path('categories/', views.CategoryListView.as_view(), name='api-category-list'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='api-category-detail'),
    path('posts/', views.PostListView.as_view(), name='api-post-list'),
    path('posts/<int:pk>/', views.PostDetailView.as_view(), name='api-post-detail'),
    path('comments/', views.CommentListView.as_view(), name='api-comment-list'),
    path('comments/<int:pk>/', views.CommentDetailView.as_view(), name='api-comment-detail'),
    path('api/home/', views.home, name='home'),
    path('users/<int:id>/', views.UserDetailView.as_view(), name='user-detail'),
    path('category/<int:pk>/posts/', views.CategoryPostsAPIView.as_view(), name='category-posts-api'),
    path('category_name/<int:pk>/', views.get_category_name, name='get-category-name'),
    path('csrf-token/', views.get_csrf_token, name='csrf-token'),
]
