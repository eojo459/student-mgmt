## Student Management System (Norwood Chinese Association) User Manual

---

> # Table of Contents

---

## Getting Started
1. **Sign up**
    - 1.1. Sign up for Parents
	- 1.2. Sign up for Admin
2. **Login**
	- 2.1. Login for Parents
	- 2.2. Login for Admin
	
## The Admin Interface
3. **Settings**
	- 3.1. Create and modify academic year 
4. **Add Student**
	- 4.1. Create a new student account
5. **Add Teacher**
	- 5.1. Create a new teacher account
6. **Add Parent**
	- 6.1. Create a new parent account
7. **Create Course**
	- 7.1. Create a new course
8. **View Students**
	- 8.1. Search the database for students
	- 8.2. Viewing a student's profile
	- 8.3. Edit and modify student information
9. **View Teachers**
	- 9.1. Search the database for teachers
	- 9.2. Viewing a teacher's profile
	- 9.3. Edit and modify teacher information
10. **View Parents**
	- 10.1. Search the database for parents
	- 10.2. Parent profile
	- 10.3. Edit and modify parent information
11. **View Course**
	- 11.1. Search the database for courses
	- 11.2. Course profile
	- 11.3. Edit and modify course information
12. **Send Email** 
	- 12.1. Compose and send email to students
13. **Calendar**
	- 13.1. Create a calendar
	- 13.2. View a calendar
	- 13.3. Download calendar as a PDF document
14. **Create Newsletter**
	- 14.1. Create a new newsletter post
15. **View Newsletter**
	- 15.1 View the latest and previous newsletters
 
## The Parent Interface
16. **Register Child**
	- 16.1. Create a new child/student account
17. **View Profile**
	- 17.1. View parent profile
	- 17.2. View child profile
	- 17.3. Edit and modify parent information
	- 17.4. Edit and modify child information

## The Django Built-In Admin Panel
18. **Django admin panel**
	- 18.1 Using the Django admin panel

---

> # Getting Started
Welcome to the Getting Started section of the user manual! In this section, we will guide you through the process of signing up and logging in to our simple web application.

---

## 1. Sign up

### 1.1. Sign up for parents
- There is a sign up button under the login form that will take you to the parent registration page. 
- Create a new parent account by filling out the parent registration form.

These are the fields for the parent registration form:

| Field         | Description                             | Required |
| ------------- | --------------------------------------- | -------- |
| Username      | The username of the parent              | Yes      |
| Password      | The password of the parent              | Yes      |
| Email         | The email of the parent                 | Yes      |
| Chinese name  | The parent's Chinese name               | Yes      |
| First name    | The parent's first name                 | Yes      |
| Last name     | The parent's last name                  | Yes      |
| Address       | The home address of the parent          | Yes      |
| City          | The city of the parent                  | Yes      |
| Province      | The province of the parent              | Yes      |
| Postal code   | The postal code of the parent           | Yes      |
| Cell          | The parent's cell phone number          | Yes      |
| Home          | The parent's home phone number          | No       |
| Business      | The parent's work/business phone number | No       |

The submission of this parent registration form will create a new parent account. After registration the parent can go back to the login page and login with the username and password they just created.

### 1.2. Sign up for admin
- Admin credentials must be created using `python3 manage.py createsuperuser` in the terminal.
- Specify the Username and Password for the admin account.

---

## 2. Login

### 2.1. Login for parents
- Enter the Username and Password that was created in the parent registration form.

### 2.2. Login for admin
- Enter any admin superuser credentials into the Username and Password field.

---

> # The Admin Interface

---

## 3. Settings
The settings is where you can create and update the calendar year.

### 3.1. Create and modify academic year
- To create a new academic year type in the new academic year and click on the `Create new year` button.
- To update the academic year select one of the years from the academic years drop down and click on the `Update current year` button.
- To finish the academic year click on the `Finish current year` button.
	- When finishing an academic year, you must make sure that previous academic years are finished.
	- Finishing academic years will create a new academic year, if the next year does not exist.

---

## 4. Add Student

### 4.1. Create a new student account
- Create a new student account by filling out the student registration form.
- The postal code field must be in the correct format
- The submission of this student registration form will create a new student account. 
- New students must be approved first by an admin before they are active.

These are the fields for the student registration form:

| Field                         | Description | Required |
| ----------------------------- | ----------- | -------- |
| Chinese name                  | The student's Chinese name        | Yes      |
| First name                    | The student's first name       | Yes      |
| Last name                     | The student's last name       | Yes      |
| Date of birth                 | The birthday of the student       | Yes      |
| Gender                        | The gender of the student       | Yes      |
| Address                       | The home address of the student       | Yes      |
| City                          | The city of the student       | Yes      |
| Province                      | The province of the student       | Yes      |
| Postal code                   | The postal code of the student       | Yes      |
| Medical History/Allergies     | Any medical information about the student       | No      |
| Remarks                       | Any other information about the student     | No      |
| Registered course             | The course that the student is registered in    | No      |
| ID of parent                  | The ID of the parent         | No       |

---

## 5. Add Teacher

### 5.1. Create a new teacher account
- Create a new teacher account by filling out the teacher registration form.
- The email and postal code field must be in the correct format.
- The submission of this teacher registration form will create a new teacher account.

These are the fields for the teacher registration form:

| Field         | Description                               | Required |
| ------------- | ----------------------------------------- | -------- |
| Username      | The username of the teacher               | Yes      |
| Password      | The password of the teacher               | Yes      |
| Email         | The email of the teacher                  | Yes      |
| Chinese name  | The teacher's Chinese name                | Yes      |
| First name    | The teacher's first name                  | Yes      |
| Last name     | The teacher's last name                   | Yes      |
| Gender        | The gender of the teacher                 | Yes      |
| Address       | The home address of the teacher           | Yes      |
| City          | The city of the teacher                   | Yes      |
| Province      | The province of the teacher               | Yes      |
| Postal code   | The postal code of the teacher            | Yes      |
| Cell          | The teacher's cell phone number           | Yes      |
| Home          | The teacher's home phone number           | No       |
| Business      | The teacher's work/business phone number  | No       |

---

## 6. Add Parent

### 6.1. Create a new parent account
- Create a new parent account by filling out the parent registration form.
- The submission of this parent registration form will create a new parent account. 
- The email and postal code field must be in the correct format
- You can login to this parent account on the login page using the Username and Password credentials. 

These are the fields for the parent registration form:

| Field         | Description                              | Required |
| ------------- | ---------------------------------------- | -------- |
| Username      | The username of the parent               | Yes      |
| Password      | The password of the parent               | Yes      |
| Email         | The email of the parent                  | Yes      |
| Chinese name  | The parent's Chinese name                | Yes      |
| First name    | The parent's first name                  | Yes      |
| Last name     | The parent's last name                   | Yes      |
| Address       | The home address of the parent           | Yes      |
| City          | The city of the parent                   | Yes      |
| Province      | The province of the parent               | Yes      |
| Postal code   | The postal code of the parent            | Yes      |
| Cell          | The parent's cell phone number           | Yes      |
| Home          | The parent's home phone number           | No       |
| Business      | The parent's work/business phone number  | No       |

---

## 7. Create Course

### 7.1. Create a new course
- Create a new course by filling out the course creation form.
- The course language must be either Cantonese or Mandarin
- The submission of this course creation form will create a new course.

These are the fields for the course creation form:

| Field              | Description                             | Required |
| ------------------ | --------------------------------------- | -------- |
| Course language    | The language of the course              | Yes      |
| Academic year      | The academic year of the course         | Yes      |
| Course name        | The name of the course                  | Yes      |
| Course grade       | The grade level for the course          | Yes      |
| Teacher            | The teacher that will teach the course  | Yes      |

**Troubleshooting:** 
- If the academic year does not show up you will have to create the academic year first.
- If no teachers show up you will have to create a teacher first.

---

## 8. View Students

### 8.1. Search the database for students  
- Admin can search the database for students on the view students page
- Students can be filtered by their:
	- First name
	- Last name
	- Phone number
	- Student ID
	- Course language
	-  School year
	-  Student status (active/disabled)
	-  Course
- The student list on the view students page displays some student information:
	- Student number
	- First name
	- Last name
	- Date of birth
	- Chinese name
	- Gender
	- Parent emails
	- Parent number
	- Medical history
	- Remarks

### 8.2. Viewing a student’s profile  
- Each student has their own profile
- Each student's profile can be accessed by clicking on the `Profile` button next to the student's row in the student list.

### 8.3. Edit and modify student information
- To edit and modify student information you must be on the student's profile
- In a students profile:
	- The student's information can be updated and modified 
	- The profile picture of a student can be uploaded and modified
	- Courses can be added by id to a student

---

## 9. View Teachers

### 9.1. Search the database for teachers  
- Admin can search the database for teachers on the view teachers page
- Teachers can be filtered by:
	- First name
	- Last name
	- Phone number
	- Teacher ID
	- Courses they teach
- The teacher list on the view teacher page displays some teacher information:
	- Teacher number
	- First name
	- Last name
	- Chinese name
	- Gender

### 9.2. Viewing a teacher’s profile  
- Each teacher has their own profile
- Each teacher's profile can be accessed by clicking on the `Profile` button next to the teacher's row in the teacher list.

### 9.3. Edit and modify teacher information
- To edit and modify teacher information you must be on the teacher's profile
- In a teacher profile:
	- The teacher's information can be updated and modified 
	- The courses that teacher has taught/is teaching will be displayed
	
---

## 10. View Parents

### 10.1. Search the database for parents  
- Admin can search the database for parents on the view parents page
- Parents can be filtered by their:
	- First name
	- Last name
	- Phone number
	- Parent ID
- The parent list on the view parent page displays some parent information:
	- Parent number
	- First name
	- Last name
	- Chinese name
	- Email
	- Home phone
	- Mobile phone
	- Work phone
	- Children list (id list of children)

### 10.2. Viewing a parent’s profile  
- Each parent has their own profile
- Each parent's profile can be accessed by clicking on the `Profile` button next to the parent's row in the parent list.

### 10.3. Edit and modify parent information
- To edit and modify parent information you must be on the parent's profile
- In a parent profile:
	-  The parent's information can be updated and modified 
	-  Children information is displayed:
		-  Child name
		-  Date of birth
		-  Gender
		-  Medical history 
		-  Remark 
		-  Courses
	-  Parents have access to the profiles of all their children. They can edit their child's information in their student profiles.
    -  Parents can add a new child to their profile. Users will be redirected to the student registration form and the parent ID will already filled in.
    -  An existing student can be added to a parent by their student ID

---

## 11. View Course

### 11.1. Search the database for courses  
- Admin can search the database for courses on the view course page
- Courses can be filtered by their:
	- Course language
	- Course ID
	- Course name
	- Teacher name
	- Teacher ID
	- Academic year
- The course list on the view course page displays some course information:
	- Course name
	- Course language
	- Academic year
	- Grade
	- Teacher ID
	- Number of registered students
	
### 11.2. Course profile  
- Each course has its own profile
- Each course's profile can be accessed by clicking on the `Profile` button next to the course's row in the course list.

### 11.3. Edit and modify course information
- To edit and modify course information you must be on the course's profile
- In a parent profile:
	-  The course information can be updated and modified.
    -  The teacher's information is displayed: 
	    - Teacher's name
	    - Teacher's address
    -  The registered students information is displayed:
	    - Name
	    - Chinese name
	    - Gender
	    - Medical history
	    - Remark
	    - Date of birth

---

## 12. Send Email

### 12.1. Compose and send email to parents
- Select the students to be the recipients.
- Type in the subject for the email.
- Type in the email body and send.
- The email will be sent to the parent emails of the selected students.

These are the fields for the email form:

| Field     | Description               | Required |
| --------- | ------------------------- | -------- |
| Subject   | The subject of the email  | Yes      |
| Content   | The content of the email  | Yes      |

---

## 13. Calendar

### 13.1. Create a calendar  
- To create a calendar you must click on the `Get calendar` button to create the calendar.
- Enter the start date, the number of days in the calendar and the end date.

### 13.2. View a calendar  
- To view a calendar, select which calendar year and then click on the `Get calendar` button. 
- The calendar can be modified and edited after viewing it.
- Days in the calendar can be turned into a holiday by editing the day and checking the holiday option.
- Each day has a comment box field.

### 13.3. Download calendar as a PDF document
- To download the calendar as a PDF, select which academic year you want and then click on the `Generate pdf` button to generate the pdf document.
- Next click on the `View pdf` button to view the pdf document and download it.

---

## 14. Create Newsletter

### 14.1. Create a new newsletter post
- Newsletters will be displayed on the newsletter page, starting with the most recent newsletter first.
- Users can browse the newsletter page and view all previous newsletters.

 These are the fields for the newsletter form:

| Field   | Description                    | Required |
| ------- | ------------------------------ | -------- |
| Title   | The title of the newsletter    | Yes      |
| Content | The content of the newsletter  | Yes      |

---

## 15. View Newsletter

### 15.1 View the latest and previous newsletters
- Newsletters can be viewed on the newsletter page.
- The most recent newsletter will be displayed first.
- Users can view other newsletters by clicking on the `Next` and `Previous` newsletter buttons.

---


> # The Parent Interface

---

## 16. Register Child

### 16.1. Create a new child/student account
- Create a new student account by filling out the student registration form.
- The postal code field must be in the correct format
- The submission of this student registration form will create a new student account. 
- New students must be approved first by an admin before they are active.

These are the fields for the student registration form:

| Field                         | Description | Required |
| ----------------------------- | ----------- | -------- |
| Chinese name                  | The student's Chinese name        | Yes      |
| First name                    | The student's first name       | Yes      |
| Last name                     | The student's last name       | Yes      |
| Date of birth                 | The birthday of the student       | Yes      |
| Gender                        | The gender of the student       | Yes      |
| Address                       | The home address of the student       | Yes      |
| City                          | The city of the student       | Yes      |
| Province                      | The province of the student       | Yes      |
| Postal code                   | The postal code of the student       | Yes      |
| Medical History/Allergies     | Any medical information about the student       | No      |
| Remarks                       | Any other information about the student     | No      |
| Registered course             | The course that the student is registered in    | No      |
| ID of parent                  | The ID of the parent         | Already filled in       |
| FOIP media consent            | Media consent disclaimer        | Yes       |

---

## 17. View Profile
### 17.1. View parent profile
- Each parent has their own profile and it displays the parent's information.
- All of their children's information is displayed:
	- Child name
	- Date of birth
	- Gender
	- Medical history
	- Remark
	- Courses
-   Parents have access to each child's profile and from there they can edit child information.
-   Parents can add a new child to their profile, this will redirect the user to the student registration form and the parent ID will be filled in to link the new child.

### 17.2. View child profile
- Each child has their own profile and it displays the child's information.

### 17.3. Edit and modify parent information
- To edit and modify parent information you must be on the parent's profile
- In the parent profile:
	-  The parent's information can be updated and modified 
	-  Children information is displayed:
		-  Child name
		-  Date of birth
		-  Gender
		-  Medical history 
		-  Remark 
		-  Courses
	-  Parents have access to the profiles of all their children. They can edit their child's information in their student profiles.
    -  Parents can add a new child to their profile. Users will be redirected to the student registration form and the parent ID will already filled in.
    -  An existing student can be added to a parent by their student ID
    
### 17.4. Edit and modify child information
- To edit and modify child/student information you must be on the student's profile
- In the students profile:
	- The student's information can be updated and modified 
	- The consent status of a student can be updated

---

> # The Django Built-In Admin Panel

---

## 18. Django Admin Panel

### 18.1 Using the Django admin panel

- Instead of having to manually edit the database, Django provides an admin panel for easier access to the database.
- If fields are accidentally edited and there is no functionality to undo/edit data, use the django admin panel.
- Be wary that certain changes may not be consistent if you use this. For example, if you are adding a course to a student, you must also make sure that you go and add that student object to the course object.
