# How to run tests

### ** The front end and back end must be running before the tests can run **
- start frontend: `npm start`
- start backend: `python3 manage.py runserver`

### 1. `cd backend` 
### 2. `python3 manage.py createsuperuser`
- Create a super with these credentials (if there is none):
    - Username: admin
    - Password: admin
### 3. `cd ../frontend`
### 4. `npm install --force` 
### 5. `npm test`