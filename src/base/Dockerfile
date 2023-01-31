FROM ubuntu:focal
# Base modules
RUN apt-get update -y
RUN apt-get install -y curl ufw gcc g++ make gnupg
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get update -y
RUN apt-get install -y nodejs
RUN apt-get upgrade -y
RUN npm init -y
RUN npm install kafkajs


# Worker modules
RUN npm install --save isomorphic-git
RUN npm install --save npm-hook-receiver

# Broker and Client modules
RUN npm install --save express-session 
RUN npm install --save express
RUN npm install --save axios@1.2.6
RUN npm install --save keycloak-connect

