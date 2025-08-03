#!/bin/bash

# Docker Compose Deployment script for Social Media APIs
# Usage: ./deploy-compose.sh <ec2-ip-address> [path-to-key-file]

if [ -z "$1" ]; then
    echo "Usage: $0 <ec2-ip-address> [path-to-key-file]"
    echo "Example: $0 3.15.123.456 ~/.ssh/my-key.pem"
    exit 1
fi

EC2_IP=$1
KEY_FILE=$2
APP_NAME="social-media-api"

echo "Deploying with Docker Compose to EC2 instance: $EC2_IP"

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
sudo yum install -y git docker docker-compose

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

# Stop existing containers
echo "Stopping existing containers..."
sudo docker-compose down 2>/dev/null || true

# Remove old images (optional - comment out if you want to keep them)
echo "Cleaning up old images..."
sudo docker system prune -f

# Build and start services with Docker Compose
echo "Building and starting services with Docker Compose..."
sudo docker-compose up -d --build

# Show running containers
echo "Checking container status..."
sudo docker-compose ps

# Show logs
echo "Recent logs:"
sudo docker-compose logs --tail=20

echo "Deployment completed!"
echo "Your app should be available at: http://$EC2_IP:3000"
echo "Database is running on port 5432"
echo ""
echo "To view logs: sudo docker-compose logs -f"
echo "To stop services: sudo docker-compose down"
echo "To restart services: sudo docker-compose restart"
EOF

echo "Docker Compose deployment script finished."
