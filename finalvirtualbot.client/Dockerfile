# Use Node.js as base image for serving Angular app
FROM node:20 AS build
 
# Set working directory
WORKDIR /app
 
# Copy package.json and install dependencies
COPY finalvirtualbot.client/package*.json ./
COPY package*.json ./
RUN npm install
RUN npm install -g @angular/cli
 
# Copy the rest of the application
COPY finalvirtualbot.client/ .
 
# Expose the port Angular app runs on
EXPOSE 4200
 
# Set default command to serve the Angular app
CMD [ "ng", "serve", "--host", "0.0.0.0" ]
