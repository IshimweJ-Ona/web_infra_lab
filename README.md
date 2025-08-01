## PayRwa — Fast & Secure Online Payments

A practical and secure web application that enables users to register, login, and make mobile money payments using external APIs. Built with Node.js, MySQL, Docker, and HAProxy for scalable deployment.


## Docker Image
Docker Hub Repo: https://hub.docker.com/r/jonathan22liv/payrwa2

Image Name: payrwa2
Tags: latest, v1.0

## Instructions
To build the Docker image locally:
   `docker build -t payrwa:latest .`

## Run the web containers
start containers with environment variables and port mapping:
` 
docker run -d \
  --name web01 \
  --env DB_HOST=mysql-db \
  --env DB_USER=root \
  --env DB_PASSWORD=yourpassword \
  --env DB_NAME=payrwa \
  --env APP_SECRET=your_secret_key \
  -p 8081:8080 \
  yourusername/payrwa:latest
`
Do the same for web02, changing the name and port (8082:8080).

## HAProxy Load Balancer (on Lb01)
HAProxy Configuration (/etc/haproxy/haproxy.cfg):
`
frontend http_front
    bind *:80
    default_backend web_back

backend web_back
    balance roundrobin
    server web01 192.168.56.101:8080 check
    server web02 192.168.56.102:8080 check
`
Reload HAPROXY:
`
sudo service haproxy restart
sudo systemctl reload haproxy
`

## Testing Steps & Load Balancer Evidence
Round-Robin Testing
Open Postman or browser.

Make 4 requests to http://<Lb01-IP>/status

Check logs or responses:

Response alternates between two containers (web01, web02)

Alternatively log hostname in app.js using os.hostname() for container identification.

## Hardening (Secrets Management)
Avoid baking secrets like DB passwords or API keys into images.

Use environment variables in docker run or docker-compose.yml.

Alternatively:

Use .env files and docker-compose.

Use Docker secrets if using Docker Swarm.

Never commit .env to GitHub. Use .gitignore.

## Technologies Used
Node.js + Express

MySQL + MySQL2 (Promise-based)

Docker + Docker Compose

HAProxy for load balancing

bcrypt for password hashing

dotenv for config

External MoMo (Mobile Money) API integration

Session-based auth with express-session

## External API Integration
We integrate a Mobile Money API (MoMo) for simulating real payments.

Credit: MTN MoMo Sandbox (https://momodeveloper.mtn.com)

Used for payment processing simulation with real-time transaction tracking.
Remittances API
COLLECTION WIDGET API
MOMO CONFIGURATION
STIPE_SECRET_KEY
EXCHANGE_API_KEY
DATABASE CONFIGURATION

##  Features
 User Registration with email, phone, and currency

 Secure Login and Session Tracking

 Make Payments using MoMo

 View Payment History (secured route)

 Proper Error Handling on forms and APIs

 Load-balanced across multiple containers

##  Setup Locally (Without Docker)
git clone https://github.com/yourusername/payrwa.git
cd payrwa
cp .env.example .env  # Fill with DB credentials and secrets
npm install
npm start
----------------------------------------------------------------------------------------------------------
# Web Infrastructure Lab

This repository provides a lightweight environment to demonstrate web server setup and basic load balancing using Docker containers. The stack consists of two web servers (`web-01` and `web-02`) and a load balancer (`lb-01`) connected to a custom Docker network. Each service runs Ubuntu 24.04 with SSH enabled to allow you to install and configure additional software.

## Requirements

- Docker and Docker Compose installed on your machine
- At least 2 GB of free RAM and a few hundred megabytes of disk space

## Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd web_infra_lab
   ```
2. Bring up the lab environment (builds the images on first run):
   ```bash
   docker compose up -d --build
   ```
3. Verify that the containers are running:
   ```bash
   docker compose ps
   ```
   You should see `web-01`, `web-02`, and `lb-01` online. The services are attached to the `lablan` network with the following addresses:

   | Container | IP           | Exposed Ports |
   |---------- |------------- |---------------|
   | web-01    | 172.20.0.11  | 2211 (SSH), 8080 (HTTP) |
   | web-02    | 172.20.0.12  | 2212 (SSH), 8081 (HTTP) |
   | lb-01     | 172.20.0.10  | 2210 (SSH), 8082 (HTTP) |

4. Connect to each container using SSH if you prefer an interactive terminal. All containers include an `ubuntu` user with the password `pass123`.
   ```bash
   ssh ubuntu@localhost -p 2211  # web-01
   ssh ubuntu@localhost -p 2212  # web-02
   ssh ubuntu@localhost -p 2210  # lb-01
   ```

## Nginx Setup on `web-01` and `web-02`

Within each `web-*` container install Nginx and host a small static site. For example:

```bash
sudo apt update && sudo apt install -y nginx
sudo bash -c 'echo "<h1>web-01</h1>" > /var/www/html/index.html'
```

Repeat for `web-02`, modifying the page content so you can tell the two servers apart. After starting Nginx (`sudo systemctl restart nginx`), visit the host ports http://localhost:8080 and http://localhost:8081 to verify the pages load.

## Activity – Configure HAProxy on `lb-01`

Your task is to configure HAProxy on `lb-01` to load balance requests between `web-01` and `web-02` using the **roundrobin** algorithm. Additionally, each response must include a custom header `X-Served-By` indicating which backend served the request.

Steps to complete the activity:

1. Install HAProxy inside `lb-01`:
   ```bash
   sudo apt update && sudo apt install -y haproxy
   ```
2. Edit `/etc/haproxy/haproxy.cfg` so that the frontend listens on port `80` and forwards to the two backends. Example snippet:
   ```
   global
       daemon
       maxconn 256

   defaults
       mode http
       timeout connect 5s
       timeout client  50s
       timeout server  50s

   frontend http-in
       bind *:80
       default_backend servers

   backend servers
       balance roundrobin
       server web01 172.20.0.11:80 check
       server web02 172.20.0.12:80 check
       http-response set-header X-Served-By %[srv_name]
   ```
3. Restart HAProxy to apply your configuration:
   ```bash
   sudo systemctl restart haproxy
   ```

### Verifying the Load Balancer

From your host machine run:
```bash
curl -I http://localhost:8082
```
Repeated requests should alternate between `web-01` and `web-02` and the `X-Served-By` header in the output will reveal which server handled each request.

Feel free to experiment with the configuration and explore additional features of HAProxy. When you are finished with the lab environment, shut it down with:
```bash
docker compose down
```

Enjoy your lightweight web infrastructure lab!
