# Step 1: Build the app
FROM node:18 AS build

WORKDIR /app

# Copy the source files
COPY ./tracking/package*.json ./
RUN npm install

COPY ./tracking .

# Build the app
RUN npm run build:dev

# Step 2: Serve the app using a lightweight web server
FROM nginx:alpine

# Copy the build files from the build stage to the nginx folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port on which the app will run
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
