from django.db import models

class Task(models.):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    done = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.title