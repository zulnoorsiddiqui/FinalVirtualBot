# Use Node.js as base image for serving Angular app
FROM node:20 AS build
 
# Set working directory
WORKDIR /app
 
# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install
 
# Copy the rest of the application
COPY . .
 
# Expose the port Angular app runs on
EXPOSE 4200
 
# Set default command to serve the Angular app
CMD ["npm", "run", "start"]
 