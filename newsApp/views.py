from django.shortcuts import render,redirect
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.contrib import messages
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Post, Category, Tag 
import json
from django.http import JsonResponse
from newsApp import models, forms

from django.shortcuts import render, redirect, get_object_or_404

from .forms import CategoryForm,TagForm
# views.py



def tag_list(request):
    tags = Tag.objects.all()
    return render(request, 'tag_list.html', {'tags': tags})

def tag_posts(request, pk):
    tag = get_object_or_404(Tag, pk=pk)
    posts = Post.objects.filter(tags=tag)
    return render(request, 'tag_posts.html', {'tag': tag, 'posts': posts})


def create_tag(request):
    if request.method == 'POST':
        form = TagForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('home-page')  # Redirect to desired page after tag creation
    else:
        form = TagForm()
    return render(request, 'create_tag.html', {'form': form})

def delete_tag(request, pk):
    tag = Tag.objects.get(pk=pk)
    if request.method == 'POST':
        tag.delete()
        return redirect('home-page')  # Redirect to desired page after tag deletion
    return render(request, 'delete_tag.html', {'tag': tag})

@login_required
def create_category(request):
    if request.method == 'POST':
        form = CategoryForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Category created successfully.')
            return redirect('category-list')
    else:
        form = CategoryForm()
    return render(request, 'create_category.html', {'form': form})

@login_required
def update_category(request, pk):
    category = get_object_or_404(Category, pk=pk)
    if request.method == 'POST':
        form = CategoryForm(request.POST, instance=category)
        if form.is_valid():
            form.save()
            messages.success(request, 'Category updated successfully.')
            return redirect('category-list')
    else:
        form = CategoryForm(instance=category)
    return render(request, 'update_category.html', {'form': form})

@login_required
def delete_category(request, pk):
    category = get_object_or_404(Category, pk=pk)
    if request.method == 'POST':
        category.delete()
        messages.success(request, 'Category deleted successfully.')
        return redirect('category-list')
    return render(request, 'delete_category.html', {'category': category})

def list_categories(request):
    categories = Category.objects.all()
    return render(request, 'list_categories.html', {'categories': categories})

def context_data():
    context = {
        'site_name': 'Simple News Portal',
        'page' : 'home',
        'page_title' : 'News Portal',
        'categories' : models.Category.objects.filter(status = 1).all(),
    }
    return context

# Create your views here.

def home(request):
    context = context_data()
    posts = models.Post.objects.filter(status = 1).order_by('-date_created').all()
    context['page'] = 'home'
    context['page_title'] = 'Home'
    context['latest_top'] = posts[:2]
    context['latest_bottom'] = posts[2:12]
    print(posts)
    return render(request, 'home.html', context)

#login

def login_user(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                return JsonResponse({'status': 'success'})
            else:
                return JsonResponse({'status': 'failed', 'msg': 'Inactive account'})
        else:
            return JsonResponse({'status': 'failed', 'msg': 'Invalid credentials'})

    return JsonResponse({'status': 'failed', 'msg': 'Method not allowed'}, status=405)



#signup
def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return HttpResponse({'status': 'success'})
        else:
            errors = form.errors.as_json()
            return HttpResponse({'status': 'failed', 'msg': errors})
    else:
        form = UserCreationForm()
    return render(request, 'signup.html', {'form': form})

#Logout
def logoutuser(request):
    logout(request)
    return redirect('/')


@login_required
def update_profile(request):
    context = context_data()
    context['page_title'] = 'Update Profile'
    user = User.objects.get(id = request.user.id)
    if not request.method == 'POST':
        form = forms.UpdateProfile(instance=user)
        context['form'] = form
        print(form)
    else:
        form = forms.UpdateProfile(request.POST, instance=user)
        if form.is_valid():
            form.save()
            messages.success(request, "Profile has been updated")
            return redirect("profile-page")
        else:
            context['form'] = form
            
    return render(request, 'update_profile.html',context)


@login_required
def update_password(request):
    context = context_data()
    context['page_title'] = "Update Password"
    if request.method == 'POST':
        form = forms.UpdatePasswords(user = request.user, data= request.POST)
        if form.is_valid():
            form.save()
            messages.success(request,"Your Account Password has been updated successfully")
            update_session_auth_hash(request, form.user)
            return redirect("profile-page")
        else:
            context['form'] = form
    else:
        form = forms.UpdatePasswords(request.POST)
        context['form'] = form
    return render(request,'update_password.html',context)

@login_required
def profile(request):
    context = context_data()
    context['page'] = 'profile'
    context['page_title'] = "Profile"
    return render(request,'profile.html', context)

@login_required
def manage_post(request, post_id=None):
    if post_id:
        post = Post.objects.get(id=post_id)
        selected_categories = list(post.categories.values_list('id', flat=True))
        selected_tags = list(post.tags.values_list('id', flat=True))
    else:
        post = None
        selected_categories = []
        selected_tags = []

    categories = Category.objects.all()
    tags = Tag.objects.all()
    context = {
        'post': post,
        'categories': categories,
        'tags': tags,
        'selected_categories': selected_categories,
        'selected_tags': selected_tags,
    }
    return render(request, 'manage_post.html', context)


@login_required
def save_post(request):
    resp = {'status': 'failed', 'msg': '', 'id': None}
    if request.method == 'POST':
        post_id = request.POST.get('id')
        instance = models.Post.objects.get(id=post_id) if post_id else None
        form = forms.SavePostForm(request.POST, request.FILES, instance=instance)

        if form.is_valid():
            post = form.save()
            resp['id'] = post.id
            resp['status'] = 'success'
            messages.success(request, "Post has been saved successfully.")
        else:
            resp['msg'] = "\n".join([f"{field.label}: {', '.join(error_messages)}" for field, error_messages in form.errors.items()])
    else:
        resp['msg'] = "Request method should be POST."
    
    return HttpResponse(json.dumps(resp), content_type="application/json")


def view_post(request, pk=None):
    context = context_data()
    post = models.Post.objects.get(id = pk)
    context['page'] = 'post'
    context['page_title'] = post.title
    context['post'] = post
    context['latest'] = models.Post.objects.exclude(id=pk).filter(status = 1).order_by('-date_created').all()[:10]
    context['actions'] = False
    if request.user.is_superuser or request.user.id == post.user.id:
        context['actions'] = True
    return render(request, 'single_post.html', context)

def save_comment(request):
    resp={'status':'failed', 'msg':'','id':None}
    if request.method == 'POST':
        if request.POST['id'] == '':
            form = forms.saveComment(request.POST)
        else:
            comment = models.Comment.objects.get(id=request.POST['id'])
            form = forms.saveComment(request.POST, instance= comment)
    
        if form.is_valid():
            form.save()
            if request.POST['id'] == '':
                commentID = models.Post.objects.all().last().id
            else:
                commentID = request.POST['id']
            resp['id'] = commentID
            resp['status'] = 'success'
            messages.success(request, "Comment has been saved successfully.")
        else:
            for field in form:
                for error in field.errors:
                    if not resp['msg'] == '':
                        resp['msg'] += str('<br />')
                    resp['msg'] += str(f"[{field.label}] {error}")

    else:
        resp['msg'] = "Request has no data sent."
    return HttpResponse(json.dumps(resp), content_type="application/json")


from django.http import JsonResponse

def list_posts(request):
    posts = models.Post.objects.filter(status=1).order_by('-date_created').all()
    data = list(posts.values())  # Convert queryset to list of dictionaries
    return JsonResponse(data, safe=False)



def category_posts(request, pk=None):
    context = context_data()
    if pk is None:
        messages.error(request, "Category not found.")
        return redirect('home-page')

    category = get_object_or_404(Category, id=pk)
    posts = Post.objects.filter(categories=category, status='1').order_by('-date_created')

    context['category'] = category
    context['page'] = 'category_post'
    context['page_title'] = f'{category.name} Posts'
    context['posts'] = posts
    context['latest'] = Post.objects.filter(status='1').order_by('-date_created')[:10]

    return render(request, 'category.html', context)

@login_required
def delete_post(request, pk = None):
    resp = {'status':'failed', 'msg':''}
    if pk is None:
        resp['msg'] = 'Post ID is Invalid'
        return HttpResponse(json.dumps(resp), content_type="application/json")
    try:
        post = models.Post.objects.get(id=pk)
        post.delete()
        messages.success(request, "Post has been deleted successfully.")
        resp['status'] = 'success'
    except:
        resp['msg'] = 'Post ID is Invalid'
    
    return HttpResponse(json.dumps(resp), content_type="application/json")


@login_required
def delete_comment(request, pk = None):
    resp = {'status':'failed', 'msg':''}
    if pk is None:
        resp['msg'] = 'Comment ID is Invalid'
        return HttpResponse(json.dumps(resp), content_type="application/json")
    try:
        comment = models.Comment.objects.get(id=pk)
        comment.delete()
        messages.success(request, "Comment has been deleted successfully.")
        resp['status'] = 'success'
    except:
        resp['msg'] = 'Comment ID is Invalid'
    
    return HttpResponse(json.dumps(resp), content_type="application/json")


def latest_posts(request):
    posts = Post.objects.filter(status=1).order_by('-date_created')[:8]
    posts_data = [
        {
            "id": post.id,
            "title": post.title,
            "short_description": post.short_description,
            "banner_path": get_absolute_image_url(post.banner_path.url) if post.banner_path else "",
        }
        for post in posts
    ]
    return JsonResponse(posts_data, safe=False)

def get_absolute_image_url(image_url):
    return f"{settings.BASE_URL}{image_url}"