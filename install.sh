#!/bin/bash


read -p "Enter your domain name (e.g., example.com): " domain


if [ -z "$domain" ]; then
  echo "Domain name cannot be empty!"
  exit 1
fi

echo "Starting setup..."


sudo apt update && sudo apt upgrade -y


sudo apt install -y nginx curl software-properties-common


curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash


export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"


nvm install --lts


npm install


sudo apt install -y certbot python3-certbot-nginx


sudo certbot certonly --nginx -d $domain


sudo bash -c "cat > /etc/nginx/sites-available/$domain" <<EOL
server {
    listen 80;
    server_name $domain www.$domain;

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name $domain www.$domain;

    ssl_certificate /etc/letsencrypt/live/$domain/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$domain/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers HIGH:!aNULL:!MD5;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;

    location / {
        proxy_pass http://localhost:7999;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    error_page 404 /404.html;
    location = /404.html {
        internal;
    }
}
EOL


sudo ln -s /etc/nginx/sites-available/$domain /etc/nginx/sites-enabled/


sudo nginx -t && sudo systemctl reload nginx


npm start &

echo "Setup complete! Your application should now be accessible at https://$domain"
