#!/bin/bash
# Update system and install required packages
sudo yum update -y
sudo yum install -y git docker

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Create app directory
mkdir -p app
cd app

# Clone or update repository
if [ -d ".git" ]; then
    echo "Updating existing repository..."
    git pull origin main
else
    echo "Cloning repository..."
    git clone https://github.com/punitDT/social_media_apis.git .
fi

# Stop and remove existing container
sudo docker stop social-media-api 2>/dev/null || true
sudo docker rm social-media-api 2>/dev/null || true

# Remove old image
sudo docker rmi social-media-api 2>/dev/null || true

# Build new image
echo "Building Docker image..."
sudo docker build -t social-media-api .

# Run new container
echo "Starting container..."
sudo docker run -d --name social-media-api -p 3000:3000 --restart unless-stopped social-media-api

# Show container status
sudo docker ps | grep social-media-api

echo "Deployment completed!"
echo "Your app should be available at: http://13.232.227.74:3000"
