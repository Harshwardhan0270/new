#!/bin/bash

# Online LMS Update Script
set -e

echo "🔄 Starting Online LMS Update..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Pull latest changes
print_status "Pulling latest changes from repository..."
git pull origin main

# Backup current data
print_status "Creating backup..."
docker-compose exec mongodb mongodump --out /data/backup/$(date +%Y%m%d_%H%M%S)

# Rebuild and restart services
print_status "Rebuilding application..."
docker-compose build --no-cache lms-app

print_status "Restarting services..."
docker-compose up -d

# Wait for services to be ready
print_status "Waiting for services to restart..."
sleep 30

# Health check
if curl -f http://localhost/api/health > /dev/null 2>&1; then
    print_status "Update completed successfully! 🎉"
else
    print_warning "Health check failed. Please check logs."
fi