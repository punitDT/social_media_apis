# Use official Node.js base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy dependency definition files
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy remaining project files
COPY . .

# Expose the app port (match your app's port)
EXPOSE 3000

# Run the app
CMD ["node", "src/index.js"]
