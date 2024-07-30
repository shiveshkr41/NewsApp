from django.contrib import admin
from django.urls import path, include
from newsApp import views
from django.contrib.auth import views as auth_views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.home, name="home-page"),
    path('login/', auth_views.LoginView.as_view(template_name="login.html", redirect_authenticated_user=True), name='login-page'),
    path('logout/', views.logoutuser, name='logout'),
    path('categories/', views.list_categories, name='category-list'),
    path('category/create/', views.create_category, name='category-create'),
    path('category/update/<int:pk>/', views.update_category, name='category-update'),
    path('category/delete/<int:pk>/', views.delete_category, name='category-delete'),
    path('signup/', views.signup, name="signup"),
    path('userlogin/', views.login_user, name="login-user"),
    path('profile/', views.profile, name="profile-page"),
    path('update_profile/', views.update_profile, name="update-profile"),
    path('update_password/', views.update_password, name="update-password"),
    path('new_post/', views.manage_post, name="new-post"),
    path('edit_post/<int:post_id>/', views.manage_post, name="edit-post"),
    path('save_post/', views.save_post, name="save-post"),
    path('post/<int:pk>/', views.view_post, name="view-post"),
    path('posts/', views.list_posts, name="all-posts"),
    path('category/<int:pk>/', views.category_posts, name="category-post"),
    path('delete_post/<int:pk>/', views.delete_post, name="delete-post"),
    path('tags/', views.tag_list, name='tag-list'),
    # In urls.py
    path('tag/<int:pk>/', views.tag_posts, name='tag-posts'),
    path('tag/create/', views.create_tag, name="tag-create"),  # Add this line for tag creation
    path('tag/delete/<int:pk>/', views.delete_tag, name="tag-delete"),  # Add this line for tag deletion
    path('apis/', include('apis.urls')),
    path('latest-posts/', views.latest_posts, name='latest-posts'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
