# Step 1: Build the app
FROM node:18 AS build

# Set working directory inside the container
WORKDIR /app

# Copy the package.json files into the container
# Since the Dockerfile is inside the ./shell folder, we need to adjust the paths to reflect that
COPY shell/package*.json ./
RUN npm install

# Copy the entire source code into the container
COPY shell .

# Build the app
RUN npm run build

# Step 2: Serve the app using a lightweight web server (nginx)
FROM nginx:alpine

# Copy the build files from the build stage to the nginx folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port on which the app will run
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]