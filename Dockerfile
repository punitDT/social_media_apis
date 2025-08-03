# Use official Node.js base image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies and TypeScript
RUN npm install
RUN npm install -g typescript ts-node

# Copy all files to the container
COPY . .

# Expose the port your app uses
EXPOSE 3000

# Run the app with ts-node
CMD ["npx", "ts-node", "index.ts"]
