#!/bin/bash

# Deployment script for Social Media APIs
# Usage: ./deploy.sh <ec2-ip-address> [path-to-key-file]

if [ -z "$1" ]; then
    echo "Usage: $0 <ec2-ip-address> [path-to-key-file]"
    echo "Example: $0 3.15.123.456 ~/.ssh/my-key.pem"
    exit 1
fi

EC2_IP=$1
KEY_FILE=$2
APP_NAME="social-media-api"

echo "Deploying to EC2 instance: $EC2_IP"

# Prepare SSH command
if [ -n "$KEY_FILE" ]; then
    SSH_CMD="ssh -i $KEY_FILE -o StrictHostKeyChecking=no ec2-user@$EC2_IP"
else
    SSH_CMD="ssh -o StrictHostKeyChecking=no ec2-user@$EC2_IP"
fi

# Deploy to EC2
$SSH_CMD << EOF
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
sudo docker stop $APP_NAME 2>/dev/null || true
sudo docker rm $APP_NAME 2>/dev/null || true

# Remove old image
sudo docker rmi $APP_NAME 2>/dev/null || true

# Build new image
echo "Building Docker image..."
sudo docker build -t $APP_NAME .

# Run new container
echo "Starting container..."
sudo docker run -d --name $APP_NAME -p 3000:3000 --restart unless-stopped $APP_NAME

# Show container status
sudo docker ps | grep $APP_NAME

echo "Deployment completed!"
echo "Your app should be available at: http://$EC2_IP:3000"
EOF

echo "Deployment script finished."
