from rest_framework.generics import CreateAPIView
from rest_framework.generics import ListAPIView
from .serializer import MatchSerializer, MatchYedekSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .model import Match
from Chat.models import CustomUser

class MatchwListAPIView(ListAPIView):
    serializer_class = MatchYedekSerializer
    queryset = Match.objects.all()

    def get(self, request, *args, **kwargs):
        serializer = MatchSerializer(self.get_queryset(), many=True)
        return Response(serializer.data, status=200)

    def post(self, request, *args, **kwargs):
        serializer = MatchYedekSerializer(data=request.data)
        if serializer.is_valid():
            print('valid ', serializer.validated_data)
            serializer.save()
        else:
            return Response(serializer.errors, status=400)
        return Response(serializer.data, status=200)

class MatchListAPIView(CreateAPIView):
    serializer_class = MatchSerializer
    # permission_classes = (IsAuthenticated,)

    def get_queryset(self, request, *args, **kwargs):
        return Match.objects.filter(request.user)

    def post(self, request, *args, **kwargs):
        serializer = MatchSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
            print('was?')
            print('valid')
        else:
            print('else')
        return Response({"status": "200"})

    # def get(self, request, *args, **kwargs):
    #     pass

    # def post(self, request, *args, **kwargs):
    #     pass