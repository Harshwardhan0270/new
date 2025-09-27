# Deployment Guide

This guide covers different deployment options for the Online Learning Management System.

## Table of Contents
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Environment Variables](#environment-variables)

## Local Development

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Git

### Setup
```bash
git clone https://github.com/yourusername/online-lms.git
cd online-lms
npm run install:all
```

### Environment Setup
Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/online_lms
JWT_SECRET=your_development_secret
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Start Development
```bash
npm run dev
```

## Production Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lms
JWT_SECRET=your_super_secure_production_secret
CLIENT_URL=https://yourdomain.com
```

### Start Production Server
```bash
npm start
```

## Docker Deployment

### Dockerfile (Backend)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ .
EXPOSE 5000
CMD ["npm", "start"]
```

### Dockerfile (Frontend)
```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:5.0
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"

  backend:
    build: 
      context: .
      dockerfile: server/Dockerfile
    environment:
      - MONGODB_URI=mongodb://admin:password@mongodb:27017/lms?authSource=admin
      - JWT_SECRET=your_jwt_secret
      - NODE_ENV=production
    ports:
      - "5000:5000"
    depends_on:
      - mongodb

  frontend:
    build:
      context: .
      dockerfile: client/Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

## Cloud Deployment

### Heroku Deployment

1. **Prepare for Heroku**
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-lms-app
```

2. **Configure Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
```

3. **Deploy**
```bash
git push heroku main
```

### AWS Deployment

#### Using AWS Elastic Beanstalk

1. **Install EB CLI**
```bash
pip install awsebcli
```

2. **Initialize EB**
```bash
eb init
eb create production
```

3. **Deploy**
```bash
eb deploy
```

#### Using AWS EC2

1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS
   - Configure security groups (ports 22, 80, 443, 5000)

2. **Setup Server**
```bash
# Connect to instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone and setup project
git clone https://github.com/yourusername/online-lms.git
cd online-lms
npm run install:all
npm run build
```

3. **Start with PM2**
```bash
pm2 start server/server.js --name "lms-backend"
pm2 startup
pm2 save
```

### Digital Ocean Deployment

1. **Create Droplet**
   - Choose Ubuntu 20.04
   - Add SSH key

2. **Setup Application**
```bash
# Install dependencies
sudo apt update
sudo apt install nodejs npm nginx

# Setup project
git clone https://github.com/yourusername/online-lms.git
cd online-lms
npm run install:all
npm run build
```

3. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /path/to/online-lms/client/build;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | Database connection | `mongodb://localhost:27017/lms` |
| `JWT_SECRET` | JWT signing secret | `your_super_secret_key` |
| `CLIENT_URL` | Frontend URL | `https://yourdomain.com` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_EXPIRE` | Token expiration | `7d` |
| `MAX_FILE_SIZE` | Upload limit | `50000000` |
| `SMTP_HOST` | Email server | - |
| `SMTP_PORT` | Email port | `587` |

## SSL/HTTPS Setup

### Using Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring and Logging

### PM2 Monitoring
```bash
pm2 monit
pm2 logs
pm2 restart all
```

### Log Management
```bash
# Setup log rotation
sudo nano /etc/logrotate.d/lms
```

## Backup Strategy

### Database Backup
```bash
# MongoDB backup
mongodump --uri="mongodb://user:pass@host:port/database" --out=/backup/path

# Restore
mongorestore --uri="mongodb://user:pass@host:port/database" /backup/path/database
```

### File Backup
```bash
# Backup uploads
tar -czf uploads-backup.tar.gz server/uploads/
```

## Performance Optimization

### Frontend Optimization
- Enable gzip compression
- Use CDN for static assets
- Implement caching headers
- Optimize images

### Backend Optimization
- Use connection pooling
- Implement Redis caching
- Enable compression middleware
- Database indexing

## Troubleshooting

### Common Issues

1. **Port already in use**
```bash
sudo lsof -i :5000
sudo kill -9 PID
```

2. **MongoDB connection issues**
- Check connection string
- Verify network access
- Check authentication

3. **Build failures**
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify environment variables

### Health Checks

```bash
# Check server status
curl http://localhost:5000/api/test

# Check database connection
mongo --eval "db.adminCommand('ismaster')"
```

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure environment variables
- [ ] Enable rate limiting
- [ ] Use strong JWT secrets
- [ ] Regular security updates
- [ ] Database access restrictions
- [ ] File upload validation
- [ ] Input sanitization