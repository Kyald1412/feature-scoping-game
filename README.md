# Feature Scoping Game - Server Deployment Guide

A collaborative workshop simulation for cross-functional product teams to practice feature scoping and decision-making.

## 🚀 Quick Start

This guide will help you deploy the Feature Scoping Game on a CentOS server with:
- **Next.js** frontend application
- **Socket.IO** real-time communication server
- **Nginx** reverse proxy
- **PM2** process manager

## 📋 Prerequisites

- CentOS 7/8/9 server with root access
- Node.js 18+ and npm
- Git installed
- Basic knowledge of Linux commands

## 🛠️ Installation Steps

### 1. System Preparation

```bash
# Update system packages
sudo yum update -y

# Install essential tools
sudo yum install -y git curl wget unzip

# Install Node.js 18+ (using NodeSource repository)
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. Install PM2

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify PM2 installation
pm2 --version
```

### 3. Install Nginx

```bash
# Install nginx
sudo yum install -y nginx

# Start and enable nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Configure firewall (if using firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 4. Clone and Setup Application

```bash
# Create application directory
sudo mkdir -p /var/www/feature-scoping-game
sudo chown $USER:$USER /var/www/feature-scoping-game

# Clone the repository
cd /var/www/feature-scoping-game
git clone <your-repository-url> .

# Install dependencies
npm install

# Build the application
npm run build
```

### 5. Configure Environment Variables

```bash
# Create environment file
cat > .env << EOF
NODE_ENV=production
PORT=3001
SOCKET_PORT=3002
NEXT_PUBLIC_SOCKET_URL=http://your-domain.com
EOF
```

### 6. Configure PM2

Create a PM2 ecosystem file:

```bash
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'feature-scoping-game',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/feature-scoping-game',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'socket-server',
      script: 'scripts/socket-server.js',
      cwd: '/var/www/feature-scoping-game',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
EOF
```

### 7. Configure Nginx

Create nginx configuration:

```bash
sudo tee /etc/nginx/conf.d/feature-scoping-game.conf > /dev/null << EOF
upstream nextjs_upstream {
    server 127.0.0.1:3001;
}

upstream socket_upstream {
    server 127.0.0.1:3002;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    # Socket.IO endpoint
    location /socket.io/ {
        proxy_pass http://socket_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Next.js application
    location / {
        proxy_pass http://nextjs_upstream;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://nextjs_upstream;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF
```

### 8. Start Services

```bash
# Start PM2 applications
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 9. SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
sudo yum install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo crontab -e
# Add this line: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 Configuration Details

### Socket.IO Server

The socket server (`scripts/socket-server.js`) handles:
- Real-time communication between workshop participants
- Room management and game state synchronization
- Timer functionality for workshop phases
- Player role assignment and validation

**Key Features:**
- Automatic room creation and management
- Real-time game state updates
- CORS enabled for cross-origin requests
- Automatic cleanup of disconnected users

### Next.js Application

The frontend application provides:
- Interactive workshop interface
- Real-time collaboration features
- Responsive design for different devices
- Role-based access control

### PM2 Process Management

PM2 manages both the Next.js app and Socket.IO server:
- Automatic restart on crashes
- Memory limit monitoring
- Process logging
- Startup script generation

## 📊 Monitoring and Maintenance

### Check Application Status

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs

# Monitor resources
pm2 monit
```

### Update Application

```bash
# Pull latest changes
cd /var/www/feature-scoping-game
git pull origin main

# Install dependencies
npm install

# Rebuild application
npm run build

# Restart PM2 processes
pm2 restart all
```

### Backup and Recovery

```bash
# Backup PM2 configuration
pm2 save

# Backup application files
tar -czf feature-scoping-game-backup-$(date +%Y%m%d).tar.gz /var/www/feature-scoping-game

# Restore from backup
tar -xzf feature-scoping-game-backup-YYYYMMDD.tar.gz -C /
pm2 resurrect
```

## 🔍 Troubleshooting

### Common Issues

1. **Socket connection fails**
   - Check if socket server is running: `pm2 status`
   - Verify nginx configuration for `/socket.io/` location
   - Check firewall settings

2. **Application not loading**
   - Check Next.js app status: `pm2 logs feature-scoping-game`
   - Verify nginx configuration: `sudo nginx -t`
   - Check port availability: `netstat -tlnp | grep :3001`

3. **PM2 processes not starting**
   - Check PM2 startup script: `pm2 startup`
   - Verify ecosystem.config.js syntax
   - Check file permissions

4. **Socket connection issues**
   - Check socket server status: `pm2 logs socket-server`
   - Verify socket server is listening: `netstat -tlnp | grep :3002`
   - Check nginx socket.io configuration

### Log Locations

```bash
# PM2 logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx
sudo journalctl -u pm2-root
```

## 🔒 Security Considerations

1. **Firewall Configuration**
   ```bash
   # Only allow necessary ports
   sudo firewall-cmd --permanent --add-port=80/tcp
   sudo firewall-cmd --permanent --add-port=443/tcp
   sudo firewall-cmd --permanent --remove-port=22/tcp
   sudo firewall-cmd --reload
   ```

2. **Regular Updates**
   ```bash
   # Update system packages
   sudo yum update -y

   # Update Node.js dependencies
   npm audit fix
   ```

3. **SSL/TLS Configuration**
   - Always use HTTPS in production
   - Configure proper SSL certificates
   - Enable HSTS headers

## 📈 Performance Optimization

1. **Nginx Caching**
   - Static files are cached for 1 year
   - Enable gzip compression
   - Configure proxy caching

2. **PM2 Optimization**
   - Monitor memory usage
   - Set appropriate instance count
   - Configure auto-restart policies

3. **Application Optimization**
   - Next.js production build
   - Optimized images and assets
   - Efficient Socket.IO connections

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review application logs
3. Verify configuration files
4. Test individual components

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.