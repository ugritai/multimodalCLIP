from functools import wraps
from rest_framework.response import Response
from rest_framework import status

def owner_or_admin_required(model_class, lookup_url_kwarg='pk', user_field='user'):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            try:
                obj_id = kwargs.get(lookup_url_kwarg)
                obj = model_class.objects.get(pk=obj_id)
            except model_class.DoesNotExist:
                return Response({'error': 'Object not found'}, status=status.HTTP_404_NOT_FOUND)

            if getattr(obj, user_field) != request.user and not request.user.is_superuser:
                return Response({'error': 'You do not have rights to access this resource'}, status=status.HTTP_403_FORBIDDEN)

            return view_func(request, *args, **kwargs)
        return _wrapped_view
    return decorator