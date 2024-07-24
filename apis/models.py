# apis/models.py

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from newsApp.models import Category, Post  # Import models from newsApp

# If you need to add specific models or additional logic for APIs, you can add them here.
# Example of a new model specific to APIs (if required):

class ApiSpecificModel(models.Model):
    name = models.CharField(max_length=250)
    description = models.TextField()
    date_created = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.name
