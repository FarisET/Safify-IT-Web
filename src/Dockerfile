# Stage 1: Build React App
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker caching
COPY package*.json ./

# Install only production dependencies
RUN npm install

# Copy all source files and build the React app
COPY . . 
RUN npm run build

# Stage 2: Serve the build using Nginx
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default Nginx static files
RUN rm -rf ./*

# Copy React build from the builder stage
COPY --from=builder /app/build .

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
