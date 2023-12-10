from django.shortcuts import render
from .models import calendar,day
from .serializers import calendarSerializer,daySerializer, calendarSerializerGet
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import permission_classes
from django.contrib.auth.models import AnonymousUser
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import reportlab
from reportlab.lib import colors  
from reportlab.lib.pagesizes import letter, inch  
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle 
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.lib.pagesizes import LETTER  
from reportlab.platypus import Image
import os
from django.http import HttpResponse,FileResponse
from django.core.files.base import ContentFile
from io import BytesIO


@swagger_auto_schema(method='get', responses={200: calendarSerializer(many=True)})
@swagger_auto_schema(method='post', request_body=calendarSerializer)
@permission_classes([IsAuthenticated, ])
@api_view(['GET', 'POST'])
def calendarInfo(request):
    # api/calendar/
    # authorization check
    user = request.user
    if(type(user) == AnonymousUser):
        return Response( {"message":"You need to be logged in to access this resource"}, status=status.HTTP_401_UNAUTHORIZED)
    elif( user.role != 'ADMIN' ):
        print(user.role)
        return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)
    
    # http methods
    if request.method == 'GET':
        calendars = calendar.objects.all()
        serializer = calendarSerializer(calendars, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        serializer = calendarSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            Calendar_obj = calendar.objects.get(calendarId=serializer.data['calendarId'])
        else:
            return Response(serializer.errors)
        WorkDays = Calendar_obj.numWorkDays
        i=0
        while WorkDays > 0:
            dayObj = day.objects.create(
                calendarId=Calendar_obj,
                Date=Calendar_obj.startDate+timedelta(7*(i)),
                description="",
                holiday=False,
            )
            dayObj.save()
            
            Theday=dayObj.Date.strftime("%Y-%m-%d")
            if Theday in request.data["holiday"]:
                dayObj.holiday=True
                dayObj.save()
                Calendar_obj.days.add(dayObj)
                i=i+1
                continue
            else:
                Calendar_obj.days.add(dayObj)
                WorkDays=WorkDays-1
                i=i+1
        
        return Response({"message":"calendar created"}, status=status.HTTP_201_CREATED)
@swagger_auto_schema(method='get', responses={200: calendarSerializer(many=True)})
@permission_classes([IsAuthenticated, ])
@api_view(['GET'])
def exactCalendar(request,academicYear):
    # api/calendar/<int:academicYear>
    # authorization check

    user = request.user
    if(type(user) == AnonymousUser):
        return Response( {"message":"You need to be logged in to access this resource"}, status=status.HTTP_401_UNAUTHORIZED)
    elif( user.role != 'ADMIN' ):
        print(user.role)
        return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)
    
    # http methods
    if request.method == 'GET':
        try:
            TheCalendar = calendar.objects.get(academicYear=academicYear)
        except:
            return Response({"message":"calendar not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = calendarSerializerGet(TheCalendar)
        return Response(serializer.data)
@swagger_auto_schema(method='patch', request_body=calendarSerializer)
@permission_classes([IsAuthenticated, ])
@api_view(['PATCH'])
def calendarGenerator(request):

    # api/calendar/generator
    # authorization check

    user = request.user
    if(type(user) == AnonymousUser):
        return Response( {"message":"You need to be logged in to access this resource"}, status=status.HTTP_401_UNAUTHORIZED)
    elif( user.role != 'ADMIN' ):
        print(user.role)
        return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)
    if request.method == 'PATCH':
        TheCalendar = calendar.objects.get(academicYear=request.data["academicYear"])
        TheDate=datetime.strptime(request.data["Date"],"%Y-%m-%d")
        day_obj=day.objects.filter(calendarId=TheCalendar,Date=TheDate)
        day_obj.update(description=request.data["comment"], holiday=request.data["holiday"])
        i=0
        for x in TheCalendar.days.all():
            if x.holiday==False:
                i=i+1
        while TheCalendar.numWorkDays!=i:
            lastday=TheCalendar.days.last()
            if TheCalendar.numWorkDays>i:
                dayObj = day.objects.create(
                    calendarId=TheCalendar,
                    Date=lastday.Date+timedelta(7),
                    description="",
                    holiday=False,
                )
                dayObj.save()
                TheCalendar.days.add(dayObj)
                i=i+1
            elif TheCalendar.numWorkDays<i:
                TheCalendar.days.remove(lastday)
                lastday.delete()
                i=i-1
        TheCalendar.days.all().order_by('Date')
        return Response({"message":"calendar updated"}, status=status.HTTP_201_CREATED)

@permission_classes([IsAuthenticated, ])
@api_view(['POST'])
def PDFGenerator(request):
    # api/calendar/pdfGenerator
    # authorization check

    user = request.user
    if(type(user) == AnonymousUser):
        return Response( {"message":"You need to be logged in to access this resource"}, status=status.HTTP_401_UNAUTHORIZED)
    elif( user.role != 'ADMIN' ):
        print(user.role)
        return Response( {"message":"You are not authorized to access this resource"}, status=status.HTTP_403_FORBIDDEN)
    if request.method == 'POST':
        TheCalendar = calendar.objects.get(academicYear=request.data["academicYear"])
        Year=str(TheCalendar.academicYear)
        N_year=str(TheCalendar.academicYear+1)
        logo = Image("Logo.png")
        if not os.path.exists('calendars/pdfs/'):
            os.makedirs('calendars/pdfs/')
        my_doc = SimpleDocTemplate("calendars/pdfs/" + Year+"calendar.pdf", pagesize = letter,rightMargin=inch/2, leftMargin=inch/2,topMargin=inch/2, bottomMargin=inch/2) 
        my_obj="———————————" +Year+"-" +N_year+"  Norwood Chinese Association Academic Year Calendar———————————"
        paragraph = Paragraph(my_obj)
        spacer = Spacer(1, 0.5*inch) # Add some space between title and table
        my_obj = []  
        # defining Data to be stored on table
        DaysList=TheCalendar.days.all()
        DaysList=sorted(DaysList, key=lambda x:x.Date)
        my_data=[]
        i=1
        for x in DaysList:
            if x.holiday==False:
                my_data.append([i,x.Date.strftime("%Y-%m-%d"),x.description])
                i=i+1
            else:
                my_data.append(["Holiday",x.Date.strftime("%Y-%m-%d"),x.description])
        print(my_data)
        # my_data= sorted(my_data, key=lambda x:x[1])
        my_data.insert(0,["Day","Date","Description"])

        print(my_data)
        col_widths = [None, None, None]
        my_table = Table(my_data,colWidths=col_widths)  
        # setting up style and alignments of borders and grids  
        table_style = TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), "lightblue"), # Header row background color
            ("TEXTCOLOR", (0, 0), (-1, 0), "white"), # Header row text color
            ("ALIGN", (0, 0), (-1, -1), "CENTER"), # Center align all cells
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"), # Header row font style
            ("FONTSIZE", (0, 0), (-1, 0), 12), # Header row font size
            ("BOTTOMPADDING", (0, 0), (-1, 0), 12), # Header row padding
            ("BACKGROUND", (0, 1), (-1, -1), "white"), # Other rows background color
            ("FONTNAME", (0, 1), (-1, -1), "Helvetica"), # Other rows font style
            ("FONTSIZE", (0, 1), (-1, -1),10), # Other rows font size
            ("GRID", (0, 0), (-1, -1), 1, "gray"), # Add borders
            ("TOPPADDING", (0, 0), (-1, 0), 36), # Add padding to the top of the table
            ("ROWHEIGHT", (0, 0), (-1, -1), 8), # Set row height
        ])
        my_table._argH[1:]=[1.5*8*1.7] * (len(my_table._argH)-1)
        for row_idx, row in enumerate(my_data):
            if row[0] == "Holiday":
                table_style.add("BACKGROUND", (0, row_idx), (-1, row_idx), "yellow")
        my_table.setStyle(table_style)
        flowables = [logo,spacer,paragraph,spacer,my_table]
        my_doc.build(flowables)
        return Response({"message":"pdf generated"}, status=status.HTTP_201_CREATED) 


def GetCalendarPDF(request,academicYear):
    file_path = 'calendars/pdfs/' +str(academicYear)+"calendar.pdf" # replace with the actual path to your PDF file
    if os.path.exists(file_path):
        with open(file_path, 'rb') as pdf:
            pdf_bytes = BytesIO(pdf.read())
            response = HttpResponse(pdf_bytes, content_type='application/pdf')
            response['Content-Disposition'] = 'inline; filename="2024calendar.pdf"'
            return response
    else:
        return HttpResponse("The file does not exist.")
    

# def download_pdf(request):
#     file_path = 'path/to/my/file.pdf'  # replace with the actual path to your PDF file
#     if os.path.exists(file_path):
#         with open(file_path, 'rb') as pdf:
#             pdf_contents = pdf.read()
#             pdf_bytes = BytesIO(pdf_contents)
#             response = HttpResponse(pdf_bytes, content_type='application/pdf')
#             response['Content-Disposition'] = 'attachment; filename="my_file.pdf"'
#             return response
#     else:
#         return HttpResponse("The file does not exist.")