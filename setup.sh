#!/bin/bash

# This script assumes you are using Ubuntu or a similar Debian-based system.
# For other operating systems, the commands may vary.

echo "### Starting environment setup ###"

# 1. **Check if Node.js is installed**
echo "Checking if Node.js is installed..."
if ! command -v node &>/dev/null; then
  echo "Node.js not found. Installing Node.js..."
  # Install Node.js and npm
  curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
  sudo apt-get install -y nodejs
else
  echo "Node.js is already installed."
fi

# 2. **Configure .env file if it doesn't exist**
if [ ! -f ".env" ]; then
  echo "Creating an empty .env file..."
  touch .env # Creates an empty .env file

  # Ask the user for MongoDB Atlas and Cloudinary details
  echo "Please enter the following details to configure the .env file."

  read -p "MongoDB Atlas Username: " DB_USER
  read -sp "MongoDB Atlas Password: " DB_PASS
  echo
  read -p "MongoDB Atlas Host (example: cluster0.mongodb.net): " DB_HOST
  read -p "MongoDB Atlas Database Name: " DB_NAME

  read -p "Cloudinary Cloud Name: " CLOUD_NAME
  read -p "Cloudinary API Key: " API_KEY
  read -sp "Cloudinary API Secret: " API_SECRET
  echo

  # Add the configurations to the .env file
  echo "DB_USER=\"$DB_USER\"" >> .env
  echo "DB_PASS=\"$DB_PASS\"" >> .env
  echo "DB_HOST=\"$DB_HOST\"" >> .env
  echo "DB_NAME=\"eventSync\"" >> .env
  echo "" >> .env
  echo "EXPRESS_PORT=\"3000\"" >> .env
  echo "JWT_SECRET=\"secret\"" >> .env
  echo "" >> .env
  echo "#Cloudinary" >> .env
  echo "CLOUD_NAME=\"$CLOUD_NAME\"" >> .env
  echo "API_KEY=\"$API_KEY\"" >> .env
  echo "API_SECRET=\"$API_SECRET\"" >> .env

  echo ".env configured successfully."
else
  echo ".env already exists."
fi

# 3. **Install nodemon globally**
echo "Installing nodemon..."
npm install -g nodemon
echo "nodemon installed."

# 4. **Install project dependencies**
echo "Installing dependencies with npm..."
npm install
echo "Dependencies installed."

echo "### Setup completed successfully ###"
