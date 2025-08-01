FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Install netcat and OpenSSH server
RUN apt-get update && \
    apt-get install -y netcat-openbsd openssh-server sudo && \
    mkdir /var/run/sshd

# Create user 'ubuntu' with password 'pqss123' and allow sudo
RUN useradd -ms /bin/bash ubuntu && \
    echo 'ubuntu:pass123' | chpasswd && \
    echo 'ubuntu ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Configure SSH to allow password login, disable root login
RUN sed -i 's/#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config && \
    sed -i 's/#\?PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
    sed -i 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' /etc/pam.d/sshd

# Copy and prepare wait-for-it script
COPY wait-for-it.sh wait-for-it.sh
RUN chmod +x wait-for-it.sh

# Expose app and SSH ports
EXPOSE 8080 22

# Start SSH and wait for MySQL before running app
CMD service ssh start && ./wait-for-it.sh mysql-db:3306 -- node app.js
