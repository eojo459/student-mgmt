# Product Documentation

## Executive Summary

 - Create a new and modern system for the admin team to use as the current system is getting outdated. 
 - It is difficult to do certain tasks such as inputting data, and the new system will ideally make many of these tasks much faster.
 - The users will be the Norwood Chinese Association admin team, with possible further additions to include the teachers, as well as students/parents.
 - The system will be a website that will ideally be able to be used on any platform.

## Project Glossary

 1. **NCA** - Norwood Chinese Association
 2. **Admin Team** - High level employees that should have full access to the system.
 3. **Teachers** - Employees that are teaching classrooms of students, and should be able to assign marks, homework, and more.
 4. **Students/Parents** - Clients of the Norwood Chinese Association
 5. **SIS** - Student Information System
 
## User Stories
### AD 1.01 - Student Registration
>- As an admin, I am able to manually register students.

> ** Acceptance Tests**

> 1. Admins can register new students.
> 2. Admins cannot register a student with invalid data.
> 3. Admins can register returning students.
 
### AD 1.02 - Review Student Registration
> As an admin, I can review the payment status of a student.

> ** Acceptance Tests**

> 1. Admins can see a list of all students who have not paid.
> 2. Admins can see a list of all students who have paid.

### AD 1.03 - Photograph Students
>As an admin, I can take photos of students and associate it with their student ID.

> ** Acceptance Tests**

> 1. Admins can associate an image with the proper file format with a student ID.
> 2. Admins cannot associate a file with the invalid file format with a student ID.

### AD 1.04 - Generate Student ID
> As an admin, I am able to generate QR codes/barcodes and student ID.

> ** Acceptance Tests**

> 1. Admins can generate a QR code/barcode and student ID for a student.
> 2. Admins cannot generate a new ID for a student that already has one.

### AD 1.05 - Manage Student Data
> As an admin, I am able to manage the data of specific students.

> ** Acceptance Tests**

> 1. Admins can modify student data.
> 2. Admins cannot invalidate a students data.

### AD 1.06 - View Amount of Students Per Class
> As an admin, I can see the number of students registered for each class.

> ** Acceptance Tests**

> 1. Admins can view the number of students for each class.

### AD 1.07 - Enroll Students
> As an admin, I can enroll a student into a class.

> ** Acceptance Tests**

> 1. Admins can enroll a student into a class.
> 2. Admins cannot enroll a student into a class if they are already enrolled.
> 3. Admins cannot enroll a student into a class that is full.

### AD 1.08 - View All Students
> As an admin, I can view a list of all students.

> ** Acceptance Tests**

> 1. Admins can see a list of all students and a small overview of their information.

### AD 2.01 - Create Classes
> As an admin, I can create classes for the academic year, and set the class types and limitations on class size.

> ** Acceptance Tests**

> 1. Admins can create a class for the current academic year.
> 2. Admins can change the types and limitations for eeach class.

### AD 2.02 - View Class Data
> As an admin, I am able to see the names and emails of students for each class.

> ** Acceptance Tests**

> 1. Admins can see a name and email for each student in a class.

### AD 2.03 - Set Academic Year
> As an admin, I can start and end an academic year.

> ** Acceptance Tests**

> 1. Admins can start an academic year.
> 2. Admins can end an academic year.

### AD 3.01 - Assign Teachers
> As an admin, I am able to assign teachers to each class.

> ** Acceptance Tests**

> 1. Admins can assign a teacher to a class.
> 2. Admins cannot assign a teacher to a class that they are already assigned to.

### AD 3.02 - Monitor Attendance
> As an admin, I am able to monitor the attendance and absentee alerts created by teacher

> ** Acceptance Tests**

> 1. Admins can view how many students are present for a class.
> 2. Admins can view alerts created by teachers that show absentees.

### AD 3.03 - Manage Report Cards
> As an admin, I am able to review, approve, reject and provide feedback to the report cards submitted by teachers.

> ** Acceptance Tests**

> 1. Admins can review, approve, and reject report cards.
> 2. Admins can provide feedback for a report card.

### AD 3.04 - Receive Teacher Alerts
> As an admin, I am able to receive alerts from teachers during class.

> ** Acceptance Tests**

> 1. Admins can see a variety of alerts from teachers during class.

### AD 4.01 - Create School Calendar
> As an admin, I am able to create a school calendar.

> ** Acceptance Tests**

> 1. Admins can add events to the school calendar
> 2. Admins can remove events from the school calendar.

### AD 4.02 - Create School Newsletter
> As an admin, I am able to publish a newsletter for parents to view.

> ** Acceptance Tests**

> 1. Admins can publish a newsletter.

### AD 5.01 - Send Email
> As an admin, I can send emails to all teachers and all students or another group of people that I specify using a variety of filters.

> ** Acceptance Tests**

> 1. Admins can send emails to all students.
> 2. Admins can send emails to all teachers.
> 3. Admins cannot send emails if recipient is not specified.

### US 1.01 - User Authentication
> As a user, I can log in with a username and password.

> ** Acceptance Tests **

> 1. Users can log in with a valid username and password.
> 2. Users cannot log in with an invalid username and password.

### US 1.02 - User Two-Factor Authentication
> As a user, I can have another code that is required to be inputted when I log in that can be obtained from an authenticator app.

> ** Acceptance Tests **

> 1. Users that have 2FA turned on are required to submit an additional time-sensitive code to sign in.
> 2. Users that do not have 2FA turned on do not have to submit another code to log in.
> 3. Users cannot log in with an invalid code.

### TE 1.01 - Send Class Email
> As a teacher, I can customize and send email from the SIS to the whole class.

> ** Acceptance Tests**

> 1. Teachers can send emails to the entire class.
> 2. Teachers cannot send empty emails.

### TE 1.02 - View Class Students
> As a teacher, I can view the emails and names in a list for each of my classes.

> ** Acceptance Tests**

> 1. Teachers can view a name and email for each student for each class.
> 2. Teachers cannot view classes that they are not teaching.

### TE 2.01 - Record Attendance
> As a teacher, I can record the attendance at the beginning of class and send absenteee alerts to the admin team.

> ** Acceptance Tests**

> 1. Teachers can record attendance.
> 2. Teachers can send alerts to the admin team.

### TE 3.01 - Assign Marks
> As a teacher, I can enter marks for homework, test and exams for each of my students.

> ** Acceptance Tests**

> 1. Teachers can assign marks for homework.
> 2. Teachers can assign marks for homework.
> 3. Teachers can assign marks for homework.
> 4. Teachers can change previously assigned marks.

### TE 3.02 - Post Homework 
> As a teacher, I can post homework to students.

> ** Acceptance Tests**

> 1. Teachers can post homework and send it to students.
> 2. Teachers cannot post empty homework.

### TE 4.01 - Communicate with Admin
> As a teacher, I can communicate with the admin team during class time.

> ** Acceptance Tests**

> 1. Teachers can send messages to the admins.
> 2. Teachers cannot send empty messages.
> 3. Teachers can send alerts to the admins.

# MoSCoW
**Must Have**

- AD 1.01 - Student Registration
- AD 1.05 - Manage Student Data
- AD 1.06 - View Amount of Students Per Class
- AD 1.07 - Enroll Students
- AD 1.08 - View All Students
- AD 2.01 - Create Classes
- AD 2.02 - View Class Data
- AD 2.03 - Set Academic Year
- AD 6.01 - Admin Authentication

**Should Have**

- AD 1.02 - Review Student Registration
- AD 4.01 - Create School Calendar



**Could Have**

- AD 1.03 - Photograph Students
- AD 1.04 - Generate Student ID
- AD 4.02 - Create School Newsletter
- AD 5.01 - Send Email
- AD 6.02 - Admin Two-Factor Authentication

**Won't Have**

- AD 3.01 - Assign Teachers
- AD 3.02 - Monitor Attendance
- AD 3.03 - Manage Report Cards
- AD 3.04 - Receive Teacher Alerts
- TE 1.01 - Send Class Email
- TE 1.02 - View Class Students
- TE 2.01 - Record Attendance
- TE 3.01 - Assign Marks
- TE 3.02 - Post Homework
- TE 4.01 - Communicate with Admin


## Similar Products

 **[Brightspace](https://www.d2l.com/brightspace/)**

 - Learning Management System by D2L
 - Used by Teachers, Students

 **[Beartracks](https://www.beartracks.ualberta.ca/)**
 
 - Secure Self-Service Online System for Employee and Student information
 - Used by Applicants, Students, Instructors, Employees

## Open Source Projects
[Moodle](https://moodle.org/)

 - Open Source Learning Management System
 - Used by Universities, Schools

## Technical Resources
**Backend: Django + PostgreSQL**
 
 - [Django Documentation](https://docs.djangoproject.com/en/4.1/)
 
 - [PostgreSQL - About Page](https://www.postgresql.org/about)

**Deployment: Cybera RAC**

- [Cybera Rapid Access Cloud](https://www.cybera.ca/rapid-access-cloud/)

**Frontend: React + Material UI + Tailwind CSS**

- [React Quickstart](https://beta.reactjs.org/learn)

- [Material UI - Getting Started](https://mui.com/material-ui/getting-started/overview/)

- [Tailwind CSS - Get Started](https://tailwindcss.com/docs/installation)