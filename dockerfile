# Stage 1: Build the React application
FROM node:22-alpine as build-stage

WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine as production-stage

# Copy the Nginx configuration
COPY nginx.default.conf /etc/nginx/conf.d/default.conf

# Remove the default Nginx HTML files
RUN rm -rf /usr/share/nginx/html/*

# Copy the built React app from the build-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]