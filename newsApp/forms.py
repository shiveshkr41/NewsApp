from django import forms
from .models import Category, Post, Tag
from django.contrib.auth.forms import UserChangeForm, PasswordChangeForm
from django.contrib.auth.models import User

# In forms.py
from django import forms
from .models import Tag

class TagForm(forms.ModelForm):
    class Meta:
        model = Tag
        fields = ['name']

class UpdateProfile(UserChangeForm):
    username = forms.CharField(max_length=250, help_text="The Username field is required.")
    email = forms.EmailField(max_length=250, help_text="The Email field is required.")
    first_name = forms.CharField(max_length=250, help_text="The First Name field is required.")
    last_name = forms.CharField(max_length=250, help_text="The Last Name field is required.")
    current_password = forms.CharField(max_length=250)

    class Meta:
        model = User
        fields = ('email', 'username', 'first_name', 'last_name')

    def clean_current_password(self):
        if not self.instance.check_password(self.cleaned_data['current_password']):
            raise forms.ValidationError(f"Password is Incorrect")

    def clean_email(self):
        email = self.cleaned_data['email']
        try:
            user = User.objects.exclude(id=self.instance.id).get(email=email)
        except User.DoesNotExist:
            return email
        raise forms.ValidationError(f"The email '{email}' is already taken.")

    def clean_username(self):
        username = self.cleaned_data['username']
        try:
            user = User.objects.exclude(id=self.instance.id).get(username=username)
        except User.DoesNotExist:
            return username
        raise forms.ValidationError(f"The username '{username}' is already taken.")


class UpdatePasswords(PasswordChangeForm):
    old_password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control form-control-sm rounded-0'}),
                                   label="Old Password")
    new_password1 = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control form-control-sm rounded-0'}),
                                    label="New Password")
    new_password2 = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control form-control-sm rounded-0'}),
                                    label="Confirm New Password")

    class Meta:
        model = User
        fields = ('old_password', 'new_password1', 'new_password2')

from django_select2.forms import Select2MultipleWidget  # Import Select2 widget

class PostForm(forms.ModelForm):
    tags = forms.ModelMultipleChoiceField(queryset=Tag.objects.all(), widget=forms.CheckboxSelectMultiple, required=False)
    categories = forms.ModelMultipleChoiceField(queryset=Category.objects.all(), widget=Select2MultipleWidget(attrs={'data-placeholder': 'Select categories', 'style': 'width: 100%;'}))
    
    class Meta:
        model = Post
        fields = ['title', 'categories', 'short_description', 'content', 'banner_path', 'meta_keywords', 'status']
        widgets = {
            'banner_path': forms.FileInput(attrs={'class': 'form-control'}),
            'meta_keywords': forms.Textarea(attrs={'class': 'form-control', 'rows': 3}),
        }

    def clean(self):
        cleaned_data = super().clean()
        tags = cleaned_data.get('tags')
        if tags and len(tags) > 3:
            raise forms.ValidationError("Cannot select more than 3 tags.")
        return cleaned_data


class SavePostForm(forms.ModelForm):
    user = forms.ModelChoiceField(queryset=User.objects.all(), label="Author")
    categories = forms.ModelMultipleChoiceField(queryset=Category.objects.all(), widget=Select2MultipleWidget(attrs={'data-placeholder': 'Select categories', 'style': 'width: 100%;'}))
    tags = forms.ModelMultipleChoiceField(queryset=Tag.objects.all(), widget=forms.CheckboxSelectMultiple, required=False)

    class Meta:
        model = Post
        fields = ('user', 'categories', 'tags', 'title', 'short_description', 'content', 'banner_path', 'meta_keywords', 'status')

    def clean_categories(self):
        categories = self.cleaned_data['categories']
        if not categories:
            raise forms.ValidationError('Please select at least one category.')
        return categories

    def clean_user(self):
        user = self.cleaned_data['user']
        if not user:
            raise forms.ValidationError('Please select a valid user.')
        return user

    def clean(self):
        cleaned_data = super().clean()
        tags = cleaned_data.get('tags')
        if tags and len(tags) > 3:
            raise forms.ValidationError("Cannot select more than 3 tags.")
        return cleaned_data



class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name', 'status']
