#!/bin/bash

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install dependencies
npm install

# Build frontend
cd frontend
npm install
npm run build
cd ..

# Install backend dependencies
cd backend
npm install
cd ..

# Create necessary directories if they don't exist
mkdir -p vendor
mkdir -p public_html

# Copy frontend build to public_html
cp -r frontend/build/* public_html/

# Copy backend files
cp -r backend/* public_html/api/

# Set permissions
chmod -R 755 public_html
chmod -R 755 vendor 