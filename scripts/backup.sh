#!/bin/bash

# Online LMS Backup Script
set -e

BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📦 Creating backup in $BACKUP_DIR..."

# Backup database
echo "Backing up database..."
docker-compose exec -T mongodb mongodump --archive > "$BACKUP_DIR/mongodb_backup.archive"

# Backup uploads
echo "Backing up uploaded files..."
docker cp $(docker-compose ps -q lms-app):/app/server/uploads "$BACKUP_DIR/uploads"

# Backup configuration
echo "Backing up configuration..."
cp .env "$BACKUP_DIR/.env.backup"
cp docker-compose.yml "$BACKUP_DIR/docker-compose.yml.backup"

echo "✅ Backup completed: $BACKUP_DIR"