from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from Chat.models import CustomUser
from .serializer import ProfileSerializer



@api_view(['GET', 'POST', 'PUT'])
def product_alt_view(request, username=None, *args, **kwargs):
    method = request.method

    if method == "GET":
        if username is not None: # detail view
            obj = get_object_or_404(CustomUser, username=username)
            data = ProfileSerializer(obj, many=False).data
            return Response(data)
        # list view
        queryset = CustomUser.objects.all()
        data = ProfileSerializer(queryset, many=True).data
        return Response(data)

    if method == "PUT":
        if username is not None:
            try:
                user = CustomUser.objects.get(username=username)
            except CustomUser.DoesNotExist:
                return Response({'error': 'User not found'}, status=404)

            serializer = ProfileSerializer(user, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        else:
            return Response({'error': 'Username is required for PUT requests'}, status=400)

    if method == "POST": # create view
        serializer = ProfileSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            title = serializer.validated_data.get("title")
            content = serializer.validated_data.get("content") or None
            if content is None:
                content = title
            serializer.save(content=content)
            return Response(serializer.data)
        return Response({"invalid": "not good data"}, status=400)
    