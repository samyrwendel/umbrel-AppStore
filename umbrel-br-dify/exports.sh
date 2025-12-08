#!/bin/bash
# Generate a random secret key for Dify
export APP_SECRET_KEY=$(openssl rand -base64 42 | tr -d '\n' | head -c 48)
