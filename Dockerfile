# Use official Node.js base image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files to the container
COPY . .

# Expose the port your app uses
EXPOSE 3000

# Run the app (assuming your entry point is index.js at root)
CMD ["node", "index.js"]
