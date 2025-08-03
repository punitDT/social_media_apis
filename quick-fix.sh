#!/bin/bash

# Quick fix deployment script
# Usage: ./quick-fix.sh

echo "Uploading fixed files to EC2..."

# Upload the fixed files
scp -i "C:/Users/PUNIT/Downloads/test.pem" -o StrictHostKeyChecking=no \
    controllers/user.ts \
    models/index.ts \
    models/users.ts \
    docker-compose.yaml \
    app.ts \
    ec2-user@13.232.227.74:~/app/

echo "Rebuilding and restarting containers..."

# Rebuild and restart
ssh -i "C:/Users/PUNIT/Downloads/test.pem" -o StrictHostKeyChecking=no ec2-user@13.232.227.74 << 'EOF'
cd app
sudo docker-compose down
sudo docker-compose up -d --build
echo "Waiting for services to start..."
sleep 10
sudo docker-compose logs --tail=20
EOF

echo "Deployment completed!"
echo "Test your API at: http://13.232.227.74:3000"
