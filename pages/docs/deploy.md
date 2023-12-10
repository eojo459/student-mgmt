# Deployment Notes Document:

## Deployment Instructions  (For Ubuntu 20.04):

These instructions are made with Python 3.8.10, PostgreSQL 12.14 and Nginx 1.18.0. 
The name of the user in the instructions is 'ubuntu', but this can be changed to any user name. Just make sure to change all occurences of 'ubuntu' to the user name you are using (use 'who' to find out your user name if you are really not sure what your user name is).
---
On your local machine, clone from the branch "deployment" and then transfer files to deployment server into the directory /home/ubuntu/ (can use WinSCP or some other similar software to transfer files).
```
git clone -b deployment https://github.com/UAlberta-CMPUT401/student-mgmt.git
```
If you do not want to use external software to transfer files, you can use the following commands to transfer files to the server. Make sure to change the IP address to the IP address of the server you are using.

If you have a public key file that you need to use to SSH, you can use the following command (assuming that you are in the same directory as your key):
```
scp -r -v -i YOUR_KEY.pem "C:/PATH/TO/student-mgmt" REMOTE_USERNAME@[IPV6_ADDRESS]:/home/REMOTE_USERNAME/
```
If you do not have a ssh key, you can use the following command which has the -i flag removed:
```
scp -r -v "C:/PATH/TO/student-mgmt" REMOTE_USERNAME@[IPV6_ADDRESS]:/home/REMOTE_USERNAME/
```
An example of the command would be:
```
scp -r -v -i assign1.pem "C:/Users/willz/student-mgmt" ubuntu@[2605:fd00:4:1001:f816:3eff:fe8a:c3e]:/home/ubuntu/
```

---

First, update packages, and then install packages for python/deployment.
```
sudo apt update
sudo apt install python3-pip python3-dev libpq-dev postgresql postgresql-contrib nginx gunicorn
sudo apt install -y python3-venv
sudo apt-get install python3-tk
```

Install python package requirements, and update settings.py file for the server.
```
cd student-mgmt
python3 -m venv venv
source venv/bin/activate
cd backend
pip3 install -r requirements.txt
```
Set secret key for django.
```
python3 -c 'import secrets; print(secrets.token_hex(24))'
```
After running this command, set it as an environment variable by running
```
export DJANGO_SECRET_KEY='YOUR_SECRET_KEY_FROM_THE_LAST_COMMAND'
```
This Django secret key will be used to encrypt the session cookies, and other sensitive information. Make sure to keep this secret key safe, as it is used to encrypt sensitive information. You can check the value of it by running the following command:
```
printenv DJANGO_SECRET_KEY
```

Update CSRF_TRUSTED_ORIGINS (we will need to do this again later):
```
nano backend/settings.py
```
Update the following lines:
```
ALLOWED_HOSTS = ['YOUR_PRIVATE_IPV4_ADDRESS']
CSRF_TRUSTED_ORIGINS = ['http://YOUR_IPV4_ADDRESS']
```
Also, if your current user is not named 'ubuntu', you will need to update any occurences of 'ubuntu' to your user name in the settings.py file. This includes variables such as _DATABASES_, _STATIC_ROOT_, and _MEDIA_ROOT_. 


Now, change directories back to the student-mgmt directory (/home/user/student-mgmt), to create the gunicorn config file:
```
cd ..
mkdir conf
nano conf/gunicorn_config.py
```
Set the contents of the file to (MAKE SURE TO USE YOUR PRIVATE IPV4 ADDRESS):
```
command =  '/home/ubuntu/student-mgmt/venv/bin/gunicorn'
pythonpath = '/home/ubuntu/student-mgmt/backend'
bind = 'YOUR_PRIVATE_IPV4_ADDRESS:8000'
workers = 3
```
Before we build the react files, we need to set up the environment variable that will link to the endpoints.
```
cd backend/frontend
nano .env
```
Inside of this .env file, make the contents look like this:
```
REACT_APP_API = http://YOUR_DOMAIN_NAME/api/
```

Now, build the frontend files from react after updating node and nvm.
```
sudo apt install npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" 
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
nvm install 16.13.0
npm install -g npm@latest
nvm use 16.13.0
npm install --force
npm run build

```
To set up the PostgreSQL database, we need to first log into a postgres session.
```
sudo -u postgres psql
```
Then, we need to create the database and set up the user. 

**NOTE: If you change any of these details, you will need to update the variable _DATABASES_ in the settings.py file located in student-mgmt/backend/backend.**
```
CREATE DATABASE mgmt;
CREATE USER ubuntu WITH PASSWORD 'password';
ALTER ROLE ubuntu SET client_encoding TO 'utf8';
ALTER ROLE ubuntu SET default_transaction_isolation TO 'read committed';
ALTER ROLE ubuntu SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE mgmt TO ubuntu;
\q
```
We can now migrate the database, create a superuser, and create the django static files. The superuser can be used to log into the admin page and admin dashboard.
```
cd ..
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic
```

Now, start the gunicorn server after setting up the database. Fix any errors that you receive on this step before moving past this.
```
cd ..
gunicorn -c conf/gunicorn_config.py backend.wsgi
```
If there were no errors that arose, press control+z, and then type 'bg' to run the gunicorn server in the background.
Now, we need to start the Nginx server, and set up the files for it.
```
sudo service nginx start
sudo nano /etc/nginx/sites-available/backend
```
Set the contents of the nginx file to (again, make sure to use your PRIVATE ipv4 address)
```
server {
    listen [::]:80;
    listen 80;
    server_name YOUR_DOMAIN_NAME;

location /static/ {
    root /home/ubuntu/student-mgmt/backend/frontend/build/;
}

location /django-static/ {
    alias /home/ubuntu/student-mgmt/backend/static/;
}

location /media/ {
    alias /home/ubuntu/student-mgmt/backend/media/;
}

location ~* favicon|apple-touch-icon|android-chrome-|mstile-|safari-pinned-tab.svg|browserconfig.xml {
  root /home/ubuntu/student-mgmt/backend/frontend/build/;
}
location = /browserconfig.xml {
  root /home/ubuntu/student-mgmt/backend/frontend/build/;
}
location = /manifest.json {
  root /home/ubuntu/student-mgmt/backend/frontend/build/;
}

location / {
    proxy_pass http://YOUR_PRIVATE_IPV4_ADDRESS:8000;
    }
}

```
Now, create a link for the nginx file, and remove the default config file.
```
cd /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/backend
sudo rm default
```
Verify that you have created the link, and that there is no other link in this directory.
```
ls -l
```
This should output the following:
```
total 0
lrwxrwxrwx 1 root root 34 Mar 24 02:35 backend -> /etc/nginx/sites-available/backend
```
Now, we can restart nginx, and the server should be running. You should now be able to visit your domain name and see the website using HTTP.
```
sudo systemctl restart nginx
```

If there are no issues with the server, we can set up the server to use HTTPS. Certbot provides free SSL certificates, automatic certificate management, and is easy to set up. The instructions can be found here with more details: 

[Certbot Instructions](https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal)

```
sudo apt update
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot --nginx
```
Follow the prompts and the server should be running on HTTPS.
If the last command failed, then you will need to manually update your nginx config file 
(sudo nano /etc/nginx/sites-available/backend), or you need to double check if your nginx config file contains a server_name and rerun the command that it gives you, with sudo. It should look like the following:

```
server {
    server_name YOUR_DOMAIN_NAME;

location /static/ {
    root /home/ubuntu/student-mgmt/backend/frontend/build/;
}

location /django-static/ {
    alias /home/ubuntu/student-mgmt/backend/static/;
}

location /media/ {
    alias /home/ubuntu/student-mgmt/backend/media/;
}

location / {
    proxy_pass http://[YOUR_IPV4_ADDRESS]:8000;
    }

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/YOUR_DOMAIN_NAME/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/YOUR_DOMAIN_NAME/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = YOUR_DOMAIN_NAME) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen [::]:80;
    server_name YOUR_DOMAIN_NAME;
    return 404; # managed by Certbot
}
```
Once we do this, we will need to update our environment variables to use HTTPS. Changing directories to /student-mgmt/backend/frontend/, 
```
cd frontend
nano .env
```
Edit the file to look like the following:
```
REACT_APP_API=https://YOUR_DOMAIN_NAME/api/
```
For example, if your domain name is 31856.yeg.rac.sh, then the file should look like the following:
```
REACT_APP_API=https://31856.yeg.rac.sh/api/
```
After updating the .env file, we need to rebuild the frontend.
```
npm run build
```
Now, we should update our CSRF trusted headers to use HTTPS. Change directories to /student-mgmt/backend/backend/, and edit the settings.py file.
```
cd ../backend
nano settings.py
```
Edit the file to look like the following:
```
CSRF_TRUSTED_ORIGINS = ['https://YOUR_DOMAIN_NAME']
```


You will need to restart the server if you are currently running it, but if nothing went horribly wrong then you can just move onto the next step.


If everything is working properly, then we can set up some automatic tasks such as automatically starting the server on boot, and deleting expired tokens from the database. Before we automatically run the server, make sure to kill the gunicorn server that is currently running. You can do this by running the following command:
```
pkill gunicorn
```
Now, create a systemd service file for gunicorn:
```
sudo nano /etc/systemd/system/gunicorn.socket
```
Set this file to have the following contents:
```
[Unit]
Description=gunicorn socket

[Socket]
ListenStream=/run/gunicorn.sock

[Install]
WantedBy=sockets.target
```
Next, we need to create the service file:
```
sudo nano /etc/systemd/system/gunicorn.service
```
Set this file to have the following contents (replace Ubuntu with your user if it is different, and make sure to replace YOUR_DJANGO_SECRET_KEY with your django secret key. you can check your django secret key by running 'printenv DJANGO_SECRET_KEY' in the terminal) :
```
[Unit]
Description=gunicorn daemon
Requires=gunicorn.socket
After=network.target

[Service]
User=ubuntu
Group=www-data
Environment="DJANGO_SECRET_KEY=YOUR_DJANGO_SECRET_KEY"
WorkingDirectory=/home/ubuntu/student-mgmt/backend
ExecStart=/home/ubuntu/student-mgmt/venv/bin/gunicorn \
          --access-logfile - \
          --workers 3 \
          --bind unix:/run/gunicorn.sock \
          backend.wsgi:application

[Install]
WantedBy=multi-user.target
```
Before we start the server, we need to update the _ALLOWED_HOSTS_ variable in the settings.py file.
```
nano settings.py
```
Update the variable to contain localhost only.
```
ALLOWED_HOSTS = ['localhost']
```

Now, we can enable the socket and service files, and start the server.
```
sudo systemctl start gunicorn.socket
sudo systemctl enable gunicorn.socket
```
If you ever need to restart the gunicorn server, you can run the following command:
```
sudo systemctl daemon-reload
sudo systemctl restart gunicorn
```
Now that we have the gunicorn server running, we need to set up nginx to use the gunicorn server. 
```
sudo nano /etc/nginx/sites-available/backend
```
Now, we need to edit the line
```
proxy_pass http://[YOUR_IPV4_ADDRESS]:8000;
```
to
```
proxy_pass http://unix:/run/gunicorn.sock;
```
Now, we can restart nginx, and the server should be running.
```
sudo systemctl restart nginx
```
With that, the server should be running. If you ever need to restart the server, you can run the following commands:
```
sudo systemctl daemon-reload
sudo systemctl restart gunicorn
sudo systemctl restart nginx
```
If you ever need to stop the server, you can run the following commands:
```
sudo systemctl stop gunicorn
sudo systemctl stop nginx
```
To check the status of the server, you can run the following commands:
```
sudo systemctl status gunicorn
sudo systemctl status nginx
```
To check the logs of the server, you can run the following commands:
```
sudo journalctl -u gunicorn
sudo journalctl -u nginx
```

Now, we can set up a cron job to automatically delete expired tokens from the database.
```
sudo crontab -e
```
Add the following line to the end of the file. This will run the command every day at midnight:
```
0 0 * * * /home/ubuntu/student-mgmt/venv/bin/python /home/ubuntu/student-mgmt/backend/manage.py flushexpiredtokens
```

---

## Acknowledgements, References, and Other Resources:


[How To Set Up Django with Postgres, Nginx, and Gunicorn on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-20-04)

[Basic Nginx+Gunicorn Django Server Setup Video](https://www.youtube.com/watch?v=YnrgBeIRtvo)

[Integrating React into Django](https://youtu.be/FhkqMHxchZ8)

[Certbot Instructions](https://certbot.eff.org/instructions?ws=nginx&os=ubuntubionic)

[ChatGPT](https://chat.openai.com/chat) (Extremely useful for debugging, copy paste errors that you get into the chatbot, and it will summarize them and give you a possible solution)

---

## Notable Changes Between Deployment and Local Development

### For Django:

/backend/backend/settings.py has the following settings changed:

- ALLOWED_HOSTS = ['YOUR_DOMAIN_NAME']
- DEBUG = FALSE
- TEMPLATES['DIRS'] = [os.path.join(BASE_DIR, 'frontend/build')]
- Database user is set as 'ubuntu' instead of 'postgres', and password='password'
- STATIC_URL = '/static/'
- STATICFILES_DIRS = [os.path.join(BASE_DIR, 'frontend/build/static'),]
- STATIC_ROOT = os.path.join(BASE_DIR, 'static/')
- CSRF_TRUSTED_ORIGINS = ['YOUR_DOMAIN_NAME']
- MEDIA_URL = '/media/'
- MEDIA_ROOT = '/home/ubuntu/student-mgmt/backend/media'

/backend/backend/urls.py has the following settings changed:

- New path added to serve react files is "re_path(r'^.*$', TemplateView.as_view(template_name='index.html'))". This must be the last path in the urlpatterns list.
- To handle media files, "*static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)," is added to the urlpatterns list instead of using += to add to the list, as we need to make sure that the above re_path is last. Also, the logo must be in the media folder (or where ever you want, as long as it matches the NGINX config).

/backend/backend/views.py has been created to serve the react files, with the following contents:
```
from django.shortcuts import render

def index(request):
    return render(request, 'index.html')
```

### For React:
The folder has been moved into the backend folder. Also, the .env file must be modified.

---

## Example Config Files

### Nginx Config File

```
server {
    server_name 31856.yeg.rac.sh;

location /static/ {
    root /home/ubuntu/student-mgmt/backend/frontend/build/;
}

location /django-static/ {
    alias /home/ubuntu/student-mgmt/backend/static/;
}

location ~* favicon|apple-touch-icon|android-chrome-|mstile-|safari-pinned-tab.svg|browserconfig.xml {
  root /home/ubuntu/student-mgmt/backend/frontend/build/;
}
location = /browserconfig.xml {
  root /home/ubuntu/student-mgmt/backend/frontend/build/;
}
location = /manifest.json {
  root /home/ubuntu/student-mgmt/backend/frontend/build/;
}

location /media/ {
    alias /home/ubuntu/student-mgmt/backend/media/;
}

location / {
    proxy_pass http://unix:/run/gunicorn.sock;
    }

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/31856.yeg.rac.sh/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/31856.yeg.rac.sh/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = 31856.yeg.rac.sh) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen [::]:80;
    server_name 31856.yeg.rac.sh;
    return 404; # managed by Certbot


}
```

### Gunicorn Service File
```
[Unit]
Description=gunicorn daemon
Requires=gunicorn.socket
After=network.target

[Service]
User=ubuntu
Group=www-data
Environment="DJANGO_SECRET_KEY=7f71bc942feb3483588c638c1c8e23b59360d2412aed868c"
WorkingDirectory=/home/ubuntu/student-mgmt/backend
ExecStart=/home/ubuntu/student-mgmt/venv/bin/gunicorn \
          --access-logfile - \
          --workers 3 \
          --bind unix:/run/gunicorn.sock \
          backend.wsgi:application

[Install]
WantedBy=multi-user.target
```

### Gunicorn Socket File
```
[Unit]
Description=gunicorn socket

[Socket]
ListenStream=/run/gunicorn.sock

[Install]
WantedBy=sockets.target
```

### Gunicorn Config File
```
command =  '/home/ubuntu/student-mgmt/venv/bin/gunicorn'
pythonpath = '/home/ubuntu/student-mgmt/backend'
bind = '10.2.6.25:8000'
workers = 3
```

## Other Settings

### Authentication Settings
For authentication, we are using JSON Web Tokens. The refresh tokens have a set expiration time, which determines how long a user can remain inactive before having to log in again. This expiration time can be customized by adjusting the value of the 'REFRESH_TOKEN_LIFETIME' variable in the '/backend/backend/settings.py' file. The access token is also generated with a set expiration time, which determines how long a user remains authenticated before needing to re-authenticate, but the app will automatically refresh the access token one minute before it expires. If you want to change the expiration time of the access token, you can adjust the value of the 'ACCESS_TOKEN_LIFETIME' variable in the '/backend/backend/settings.py' file, and you will also need to change the timer for the UpdateToken function in '/frontend/src/authentication/AuthContext.js'. The app will be slightly more secure if the access token has a shorter expiration time, but it will also slightly increase the load on the server.
