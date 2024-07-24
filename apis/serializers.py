# apis/serializers.py
from rest_framework import serializers
from newsApp.models import Category, Post, Comment
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

from rest_framework import serializers
from newsApp.models import Category, Post, Comment
from django.contrib.auth.models import User


for user in User.objects.all():
    Token.objects.get_or_create(user=user)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']  # Add other fields as needed

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class CategoryNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'
from django.conf import settings

class PostSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        fields = '__all__'
