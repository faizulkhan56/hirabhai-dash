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

Enable the Configuration
If you're using sites-available, link the configuration to sites-enabled:

 ```sh

sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

```

3. Test the NGINX configuration:

    ```sh
    sudo nginx -t
    ```

4. Reload NGINX:

    ```sh
    sudo systemctl reload nginx
    ```
5. Ensure the application files are located in the directory specified in the root directive (e.g., /var/www/html):

 Set the Correct Permissions

```sh
sudo chown -R www-data:www-data /home/ubuntu/dash-hirabhai-git-folder/public
sudo chmod -R 755 /home/ubuntu/dash-hirabhai-git-folder/public

```
Ensure Index File Exists
Make sure an index.html file exists in the directory:
```sh
cd /home/ubuntu/dash-hirabhai-git-folder/public
ll
-rwxr-xr-x 1 www-data www-data 9686 Dec  9 04:02 index.html*


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

## Step 9: Test and reconfigure Your Application

1. Open a web browser and navigate to your EC2 public IP or domain name like below
   http://3.94.196.187:3007/
   give Username: admin
   password:password
   
2. You should see your DASH VOD project running.
3. for reconfiguring if you stop the ec2 machine the public ip may change in this case have to do below
```sh
cd /home/ubuntu/dash-hirabhai-git-folder/video
vi video.mpd
 <BaseURL>http://3.94.196.187:3007/video/</BaseURL>
                        <Representation id="0" mimeType="video/mp4" codecs="avc1.640028" bandwidth="2400000" width="1920" height="1080" sar="1:1">
                                <SegmentTemplate timescale="15360" initialization="init-stream$RepresentationID$.m4s" media="chunk-stream$RepresentationID$-$Number%05d$.m4s" startNumber="1">
                                        <SegmentTimeline>
                                                <S t="0" d="128000" r="2" />
                                                <S d="77312" />
                                        </SegmentTimeline>
                                </SegmentTemplate>
                        </Representation>
                </AdaptationSet>
                <AdaptationSet id="1" contentType="audio" startWithSAP="1" segmentAlignment="true" bitstreamSwitching="true" lang="und">
                    <BaseURL>http://3.94.196.187:3007/video/</BaseURL>
                        <Representation id="1" mimeType="audio/mp4" codecs="mp4a.40.2" bandwidth="128000" audioSamplingRate="48000">
                                <AudioChannelConfiguration schemeIdUri="urn:mpeg:dash:23003:3:audio_channel_configuration:2011" value="2" />
                                <SegmentTemplate timescale="48000" initialization="init-stream$RepresentationID$.m4s" media="chunk-stream$RepresentationID$-$Number%05d$.m4s" startNumber="1"

```
Place your ec2 public ip in the above 2 places.

Then need to change in public html FE page index.html page
```sh
cd /home/ubuntu/dash-hirabhai-git-folder/public
vi index.html
<body>
    <!-- Login Container -->
    <div class="login-container" id="loginContainer">
        <div class="login-box">
            <h2>Login</h2>
            <input type="text" id="username" placeholder="Username" required>
            <input type="password" id="password" placeholder="Password" required>
            <button type="button" onclick="login()">Login</button>
        </div>
    </div>

    <!-- Main Container -->
    <div class="main-content" id="mainContent" style="display: none;">
        <div class="header">
            <div class="logo"><i class="fas fa-play-circle"></i> MyVideoSite</div>
            <div class="menu">
                <a href="#"><i class="fas fa-home"></i> Home</a>
                <a href="#"><i class="fas fa-video"></i> Videos</a>
                <a href="#"><i class="fas fa-user"></i> Profile</a>
            </div>
        </div>
        <div class="container">
            <div class="video-container">
                <video id="videoPlayer" controls></video>
            </div>
            <div class="title">Sample Video Title</div>
            <div class="description">This is a description of the video. It provides some context and additional information about the video content.</div>
            <div class="comments-section">
                <div class="comment">
                    <span class="comment-author">User1:</span>
                    <span class="comment-text">This is a great video!</span>
                </div>
                <div class="comment">
                    <span class="comment-author">User2:</span>
                    <span class="comment-text">Very informative, thanks for sharing!</span>
                </div>
                <div class="add-comment">
                    <textarea placeholder="Add a public comment..."></textarea>
                    <button type="button">Comment</button>
                </div>
            </div>
            <div class="upload-section">
                <h3>Upload a Video</h3>
                <form id="uploadForm" enctype="multipart/form-data">
                    <input type="file" name="videoFile" id="videoFile" accept="video/*"><br>
                    <button type="submit">Upload</button>
                </form>
            </div>
        </div>
    </div>

    <script>
        let auth = '';

        const url = 'http://3.94.196.187:3007/video.mpd';
        const player = dashjs.MediaPlayer().create();
        player.initialize(document.querySelector("#videoPlayer"), url, true);

        document.getElementById('uploadForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData();
            const fileField = document.getElementById('videoFile');

            if (fileField.files.length > 0) {
                formData.append('videoFile', fileField.files[0]);

                try {
                    const response = await fetch('http://3.94.196.187:3007/upload', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Basic ${auth}`
                        },
                        body: formData
                    });

                    if (response.ok) {
                        alert('File uploaded successfully.');
                    } else {
                        alert('Failed to upload file.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred while uploading the file.');
                }
            } else {
                alert('Please select a file to upload.');
            }
        });

        function login() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            auth = btoa(`${username}:${password}`);

            fetch('http://3.94.196.187:3007/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => {
                if (response.ok) {
                    document.getElementById('loginContainer').style.display = 'none';
                    document.getElementById('mainContent').style.display = 'block';
                } else {
                    alert('Login failed. Please check your credentials.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred during login.');
            });
        }
    </script>
</body>
</html>

```
need to add ec2 IP

```sh

1.const response = await fetch('http://3.94.196.187:3007/upload'
2.fetch('http://3.94.196.187:3007/login'
3.const url = 'http://3.94.196.187:3007/video.mpd'

```

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
