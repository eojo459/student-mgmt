# student-mgmt

Student Management System (Norwood Chinese Association)

A web application for managing students, parents, courses and their information.

Created using Django, React, MUI, and PostgreSQL.

# Local Installation

1.  Install PostgreSQL and create a database.
2.  Rename the database settings in /backend/backend/settings.py to match your database details

## 3. In Group-Project/backend/:

### i. Create a new Virtual Environment:
```
python -m venv venv
```
### ii. Activate the Virtal Environment:


### For Windows
```
venv\Scripts\activate.bat || venv\Scripts\activate.ps1
```


### Or, For Unix
```
source venv/bin/activate
```

### iii. Install Requirements:
```
pip install -r requirements.txt || pip3 install -r requirements.txt
```
### iv. Migrate Database:
```
python manage.py migrate || python3 manage.py migrate
```
### v. Run the Server:
```
python manage.py runserver || python3 manage.py runserver
```

## 4. In /frontend/:
### i. Install Node Modules
```
npm install --force
```
### ii. Create .env file, with the following contents:
```
REACT_APP_API = http://localhost:8000/api/
```
### iii. Run Frontend Server
```
npm start
```

### 5. To view api documentation, go to http://localhost:8000/api/docs/

# Deployment Instructions

To view the deployment instructions, go to the github pages link below:

https://ualberta-cmput401.github.io/student-mgmt/deploy/

# MkDocs Instructions

To view the MkDocs instructions locally:

### i. Install the MkDocs package and the Material theme:
```
pip install mkdocs
pip install mkdocs-material
```


### ii. Then, to view locally in a browser:
```
mkdocs serve
```

### iii. To then deploy to github pages:
```
mkdocs gh-deploy
```

# Deepsource Security Analysis

To view the Deepsource security analysis, go to the link below:

https://deepsource.io/report/c13a757b-6030-406b-b920-752419329ad4

# Screencast on google drive
https://drive.google.com/file/d/1E5P5St1AcDR4gG9E9CIgTTikeXXcjcrS/view?usp=sharing