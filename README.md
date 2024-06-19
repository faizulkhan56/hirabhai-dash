# DASH VOD Project Setup

This guide will help you set up the DASH VOD Project using PM2, NGINX, Node.js on an AWS EC2 instance.

## Prerequisites

1. AWS Account
2. SSH client (e.g., Terminal, PuTTY)
3. Basic knowledge of AWS, EC2, and Linux commands

## Step 1: Launch an EC2 Instance

1. Go to the [AWS Management Console](https://aws.amazon.com/console/).
2. Navigate to the EC2 Dashboard and click on "Launch Instance".
3. Choose an Amazon Machine Image (AMI), preferably Ubuntu Server 20.04 LTS.
4. Choose an instance type (e.g., t3.medium).
5. Configure instance details, including:
   - Number of instances: 1
   - Network settings: Default VPC
   - Subnet: Choose a subnet from the list
   - Auto-assign Public IP: Enable
6. Add storage (default 8 GB is sufficient for basic setup).
7. Add tags (optional).
8. Configure security group:
   - Add rules for HTTP (port 80), HTTPS (port 443), and SSH (port 22).
9. Review and launch the instance.
10. Create a new key pair, download it, and launch the instance.

## Step 2: Connect to Your EC2 Instance

1. Open your SSH client.
2. Connect to your instance using the command:

    ```sh
    ssh -i /path/to/your-key-pair.pem ubuntu@your-ec2-public-ip
    ```

## Step 3: Update and Install Dependencies

1. Update the package list and install updates:

    ```sh
    sudo apt update && sudo apt upgrade -y
    ```

2. Install Node.js, NGINX, and other dependencies:

    ```sh
    sudo apt install nodejs npm nginx -y
    ```

3. Install PM2 globally:

    ```sh
    sudo npm install -g pm2
    ```

4. Verify the installations:

    ```sh
    node -v
    npm -v
    nginx -v
    pm2 -v
    ```

## Step 4: Clone Your Project Repository

1. Install Git:

    ```sh
    sudo apt install git -y
    ```

2. Clone your project repository:

    ```sh
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
    ```

## Step 5: Configure NGINX

1. Open the NGINX configuration file:

    ```sh
    sudo nano /etc/nginx/sites-available/default
    ```

2. Replace the content with your NGINX configuration:

    ```nginx
    server {
        listen 80;
        server_name your-ec2-public-ip;

        location / {
            root /home/ubuntu/your-repo/public;
            try_files $uri $uri/ /index.html;
        }

        location /upload {
            proxy_pass http://localhost:3007;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /video {
            proxy_pass http://localhost:3007;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /video.mpd {
            proxy_pass http://localhost:3007;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```

3. Test the NGINX configuration:

    ```sh
    sudo nginx -t
    ```

4. Reload NGINX:

    ```sh
    sudo systemctl reload nginx
    ```

## Step 6: Install Project Dependencies

1. Navigate to your project directory:

    ```sh
    cd /home/ubuntu/your-repo
    ```

2. Install project dependencies:

    ```sh
    npm install
    ```

## Step 7: Start Your Application with PM2

1. Start your application:

    ```sh
    pm2 start app.js --name dash-vod
    ```

2. Save the PM2 process list and startup script:

    ```sh
    pm2 save
    pm2 startup
    ```

3. Follow the instructions to configure PM2 to start on boot.

## Step 8: Configure Security Group and DNS (Optional)

1. Update your EC2 security group to allow HTTP (port 80), HTTPS (port 443), and SSH (port 22) traffic.
2. (Optional) Configure a domain name to point to your EC2 instance using Route 53 or any other DNS provider.

## Step 9: Test Your Application

1. Open a web browser and navigate to your EC2 public IP or domain name.
2. You should see your DASH VOD project running.

## Additional Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/index.html)
- [NGINX Documentation](https://docs.nginx.com/nginx/admin-guide/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Node.js Documentation](https://nodejs.org/en/docs/)

## Troubleshooting

1. **Check NGINX Logs**:

    ```sh
    sudo tail -f /var/log/nginx/error.log
    ```

2. **Check PM2 Logs**:

    ```sh
    pm2 logs dash-vod
    ```

3. **Check Node.js Application Logs**:

    ```sh
    pm2 logs
    ```

## Conclusion

You have successfully set up your DASH VOD project on an AWS EC2 instance using PM2, NGINX, and Node.js. For any further questions or support, please refer to the additional resources section or reach out to the community.
