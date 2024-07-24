from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=250)
    status = models.CharField(max_length=2, choices=(("1",'Active'), ("2",'Inactive')), default=1)
    date_created = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name

class Tag(models.Model):
    name = models.CharField(max_length=250)
    date_created = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    categories = models.ManyToManyField(Category, related_name='posts')
    tags = models.ManyToManyField(Tag, related_name='posts')
    title = models.TextField()
    short_description = models.TextField()
    content = models.TextField()
    banner_path = models.ImageField(upload_to='news_banner')
    status = models.CharField(max_length=2, choices=(("1",'Published'), ("2",'Unpublished')), default=2)
    meta_keywords = models.TextField()
    date_created = models.DateTimeField(default=timezone.now)
    date_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.user.username}"



class Comment(models.Model):
    pass