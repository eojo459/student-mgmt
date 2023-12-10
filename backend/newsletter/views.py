from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponseRedirect

from .models import NewsLetter
from .serializers import NewsLetterSerializer
from django.contrib.auth.models import AnonymousUser

@api_view(['GET', 'POST'])
def newsletter_list(request):
    if request.method == 'GET':
        newsletters = NewsLetter.objects.all()
        serializer = NewsLetterSerializer(newsletters, many=True)
        return Response(serializer.data)

    
    elif request.method == 'POST':
        user = request.user
        if(type(user) == AnonymousUser):
            return Response( {"message":"You need to be logged in to access this resource"}, status=status.HTTP_401_UNAUTHORIZED)
        elif( user.role != 'ADMIN' ):
            print(user.role)
            return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)
        serializer = NewsLetterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'DELETE'])
def newsletter_detail(request, pk):
    try:
        newsletter = NewsLetter.objects.get(id=pk)
    except NewsLetter.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = NewsLetterSerializer(newsletter)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        user = request.user
        if(type(user) == AnonymousUser):
            return Response( {"message":"You need to be logged in to access this resource"}, status=status.HTTP_401_UNAUTHORIZED)
        elif( user.role != 'ADMIN' ):
            print(user.role)
            return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)
        newsletter.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def LatestNewsLetter(request):
    # get news letter with oldest id
    latest = NewsLetter.objects.order_by('id').last()
    # get the latest news letter
    latest_newsletter = NewsLetter.objects.get(id=latest.id)
    
    serializer = NewsLetterSerializer(latest_newsletter)

    print(serializer.data)

    return Response(serializer.data)
