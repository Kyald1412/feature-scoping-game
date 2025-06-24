#!/bin/bash

# Feature Scoping Game - CentOS Deployment Script
# This script automates the deployment process on a CentOS server

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration variables
DOMAIN_NAME=""
APP_DIR="/var/www/feature-scoping-game"
PM2_LOG_DIR="/var/log/pm2"

echo -e "${BLUE}🚀 Feature Scoping Game - CentOS Deployment Script${NC}"
echo "=================================================="

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Please run as a regular user with sudo privileges."
   exit 1
fi

# Get domain name
read -p "Enter your domain name (e.g., example.com): " DOMAIN_NAME
if [[ -z "$DOMAIN_NAME" ]]; then
    print_error "Domain name is required"
    exit 1
fi

print_status "Starting deployment for domain: $DOMAIN_NAME"

# 1. System Preparation
print_status "Updating system packages..."
sudo yum update -y

print_status "Installing essential tools..."
sudo yum install -y git curl wget unzip

# 2. Install Node.js
print_status "Installing Node.js 18..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo yum install -y nodejs
else
    print_warning "Node.js is already installed"
fi

print_status "Node.js version: $(node --version)"
print_status "npm version: $(npm --version)"

# 3. Install PM2
print_status "Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
else
    print_warning "PM2 is already installed"
fi

print_status "PM2 version: $(pm2 --version)"

# 4. Install Nginx
print_status "Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo yum install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
else
    print_warning "Nginx is already installed"
fi

# Configure firewall
print_status "Configuring firewall..."
if command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --permanent --add-service=https
    sudo firewall-cmd --reload
    print_status "Firewall configured"
else
    print_warning "firewalld not found, please configure firewall manually"
fi

# 5. Create application directory
print_status "Creating application directory..."
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# 6. Clone repository (if not already present)
if [ ! -d "$APP_DIR/.git" ]; then
    print_status "Cloning repository..."
    cd $APP_DIR
    git clone https://github.com/your-username/feature-scoping-game.git .
else
    print_warning "Repository already exists, pulling latest changes..."
    cd $APP_DIR
    git pull origin main
fi

# 7. Install dependencies
print_status "Installing Node.js dependencies..."
npm install

# 8. Build application
print_status "Building application..."
npm run build

# 9. Create environment file
print_status "Creating environment configuration..."
cat > .env << EOF
NODE_ENV=production
PORT=3001
SOCKET_PORT=3002
NEXT_PUBLIC_SOCKET_URL=http://$DOMAIN_NAME
EOF

# 10. Create PM2 log directory
print_status "Creating PM2 log directory..."
sudo mkdir -p $PM2_LOG_DIR
sudo chown $USER:$USER $PM2_LOG_DIR

# 11. Copy PM2 ecosystem file
print_status "Configuring PM2..."
cp ecosystem.config.js $APP_DIR/

# 12. Configure Nginx
print_status "Configuring Nginx..."
sudo cp nginx.conf /etc/nginx/conf.d/feature-scoping-game.conf

# Replace domain placeholder in nginx config
sudo sed -i "s/your-domain.com/$DOMAIN_NAME/g" /etc/nginx/conf.d/feature-scoping-game.conf

# Test nginx configuration
if sudo nginx -t; then
    print_status "Nginx configuration is valid"
else
    print_error "Nginx configuration is invalid"
    exit 1
fi

# 13. Start services
print_status "Starting PM2 applications..."
cd $APP_DIR
pm2 start ecosystem.config.js
pm2 save

print_status "Setting up PM2 startup script..."
pm2 startup

print_status "Reloading Nginx..."
sudo systemctl reload nginx

# 14. SSL Certificate setup (optional)
read -p "Do you want to set up SSL certificate with Let's Encrypt? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Installing Certbot..."
    sudo yum install -y certbot python3-certbot-nginx
    
    print_status "Obtaining SSL certificate..."
    sudo certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME --non-interactive --agree-tos --email admin@$DOMAIN_NAME
    
    print_status "Setting up auto-renewal..."
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
fi

# 15. Final status check
print_status "Performing final status check..."

# Check PM2 status
if pm2 status | grep -q "online"; then
    print_status "PM2 processes are running"
else
    print_error "PM2 processes are not running properly"
fi

# Check nginx status
if sudo systemctl is-active --quiet nginx; then
    print_status "Nginx is running"
else
    print_error "Nginx is not running"
fi

# Check if ports are listening
if netstat -tlnp | grep -q ":3001"; then
    print_status "Next.js app is listening on port 3001"
else
    print_error "Next.js app is not listening on port 3001"
fi

if netstat -tlnp | grep -q ":3002"; then
    print_status "Socket server is listening on port 3002"
else
    print_error "Socket server is not listening on port 3002"
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo "=================================================="
echo -e "Your application should now be accessible at: ${BLUE}http://$DOMAIN_NAME${NC}"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "  Check PM2 status: pm2 status"
echo "  View logs: pm2 logs"
echo "  Restart services: pm2 restart all"
echo "  Check nginx status: sudo systemctl status nginx"
echo "  View nginx logs: sudo tail -f /var/log/nginx/error.log"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Update your DNS records to point to this server"
echo "  2. Test the application functionality"
echo "  3. Set up monitoring and backups"
echo "  4. Configure additional security measures"
echo ""
echo -e "${BLUE}For support, check the README.md file for troubleshooting tips.${NC}" 