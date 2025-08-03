@echo off
echo Uploading debug files...

scp -i "C:/Users/PUNIT/Downloads/test.pem" -o StrictHostKeyChecking=no controllers/user.ts app.ts ec2-user@13.232.227.74:~/app/

echo Restarting container...

ssh -i "C:/Users/PUNIT/Downloads/test.pem" -o StrictHostKeyChecking=no ec2-user@13.232.227.74 "cd app && sudo docker-compose restart app"

echo Waiting for restart...
timeout /t 5

echo Checking logs...
ssh -i "C:/Users/PUNIT/Downloads/test.pem" -o StrictHostKeyChecking=no ec2-user@13.232.227.74 "cd app && sudo docker-compose logs --tail=10 app"

echo Done! Test the debug endpoint: http://13.232.227.74:3000/debug/env
