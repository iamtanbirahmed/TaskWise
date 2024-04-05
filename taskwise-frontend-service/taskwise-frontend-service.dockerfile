# Use an official Node runtime as a parent image
FROM node:latest as builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Install project dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Build the Angular app for production
# RUN ng build --prod

# # Use a lighter image for the production build
# FROM nginx:alpine

# # Copy the built Angular app from the builder stage to the NGINX directory
# COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 4200

# Command to run NGINX when the container starts
CMD ["ng", "serve", "--host", "0.0.0.0", "--configuration", "docker"]
