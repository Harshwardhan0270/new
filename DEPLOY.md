# 🚀 Quick Deployment Guide

This guide provides multiple deployment options for the Online Learning Management System.

## 🐳 Docker Deployment (Recommended)

### Prerequisites
- Docker and Docker Compose installed
- Git

### Quick Start
```bash
# Clone the repository
git clone https://github.com/yourusername/online-lms.git
cd online-lms

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Deploy with one command
npm run deploy
```

### Manual Docker Deployment
```bash
# Build and start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

## ☁️ Heroku Deployment

### One-Click Deploy
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/yourusername/online-lms)

### Manual Heroku Deployment
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-lms-app

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 32)

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Deploy
git push heroku main

# Open app
heroku open
```

## 🌐 Vercel Deployment

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/online-lms)

### Manual Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

## 🔧 VPS/Server Deployment

### Ubuntu/Debian Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone and setup
git clone https://github.com/yourusername/online-lms.git
cd online-lms
npm run install:all
npm run build

# Start with PM2
pm2 start server/enhanced-server.js --name "lms"
pm2 startup
pm2 save

# Setup Nginx (optional)
sudo apt install nginx
sudo cp nginx/nginx.conf /etc/nginx/sites-available/lms
sudo ln -s /etc/nginx/sites-available/lms /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 🔐 Environment Variables

### Required Variables
```env
NODE_ENV=production
JWT_SECRET=your_super_secret_key
MONGODB_URI=your_mongodb_connection_string
```

### Optional Variables
```env
PORT=5000
CLIENT_URL=https://yourdomain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

## 📊 Monitoring

### Health Check
```bash
curl http://localhost/api/health
```

### Docker Monitoring
```bash
# View logs
docker-compose logs -f

# Check resource usage
docker stats

# Restart services
docker-compose restart
```

### PM2 Monitoring
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart app
pm2 restart lms
```

## 🔄 Updates

### Docker Update
```bash
npm run update
```

### Manual Update
```bash
git pull origin main
npm run build
pm2 restart lms
```

## 🛡️ Security Checklist

- [ ] Use HTTPS in production
- [ ] Set strong JWT secret
- [ ] Configure firewall
- [ ] Enable rate limiting
- [ ] Regular security updates
- [ ] Database access restrictions
- [ ] File upload validation

## 🆘 Troubleshooting

### Common Issues

**Port already in use:**
```bash
sudo lsof -i :5000
sudo kill -9 PID
```

**MongoDB connection issues:**
- Check connection string
- Verify network access
- Check authentication credentials

**Build failures:**
```bash
rm -rf node_modules client/node_modules server/node_modules
npm run install:all
npm run build
```

### Getting Help

1. Check the logs: `docker-compose logs -f`
2. Verify environment variables
3. Check network connectivity
4. Review the full documentation in `docs/DEPLOYMENT.md`

## 📞 Support

- 📧 Email: support@yourdomain.com
- 💬 Discord: [Join our server](https://discord.gg/your-server)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/online-lms/issues)

---

**Happy Learning! 🎓**