from django.urls import path
from ast import Delete, While
from operator import truediv
from platform import mac_ver
from select import select
import sqlite3
import time
import random
from tkinter import ALL
from tracemalloc import start
from unicodedata import name
from django.db import models

connection = None
cursor = None
def connect(path):
    global connection, cursor

    connection = sqlite3.connect(path)
    cursor = connection.cursor()
    cursor.execute(' PRAGMA foreign_keys=ON; ')
    connection.commit()
    return
path = "backend/students/NCAstudentData.db"
connect(path)
cursor.execute('SELECT firstname, lastname, chineseName, address,city,province,postalCode,DoB,gender,medicalHistory,remark,registerDate  FROM Student')
opx=cursor.fetchall()
for i in range(len(opx)):
    print(opx[i][0])

