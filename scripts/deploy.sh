#!/bin/bash

# Online LMS Deployment Script
set -e

echo "🚀 Starting Online LMS Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from .env.example..."
    cp .env.example .env
    print_warning "Please edit .env file with your configuration before running again."
    exit 1
fi

# Load environment variables
source .env

print_status "Environment loaded successfully"

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p nginx/ssl
mkdir -p scripts
mkdir -p logs

# Build and start services
print_status "Building Docker images..."
docker-compose build --no-cache

print_status "Starting services..."
docker-compose up -d

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 30

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    print_status "Services started successfully!"
else
    print_error "Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi

# Run health checks
print_status "Running health checks..."
if curl -f http://localhost:${APP_PORT:-80}/api/health > /dev/null 2>&1; then
    print_status "Health check passed!"
else
    print_warning "Health check failed. Service might still be starting..."
fi

print_status "Deployment completed successfully! 🎉"
print_status "Application is available at: http://localhost:${APP_PORT:-80}"
print_status ""
print_status "Useful commands:"
print_status "  View logs: docker-compose logs -f"
print_status "  Stop services: docker-compose down"
print_status "  Restart services: docker-compose restart"
print_status "  Update application: ./scripts/update.sh"