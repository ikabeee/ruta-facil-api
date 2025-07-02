#!/bin/bash

# Test script for Authentication API
# Run this after starting the server with: npm start

echo "🚀 Testing Ruta Fácil Authentication API"
echo "========================================="

BASE_URL="http://localhost:3000"

echo ""
echo "1. Testing Health Check..."
curl -s -X GET "$BASE_URL/health" | jq .

echo ""
echo "2. Testing User Registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "phone": "1234567890"
  }')
echo $REGISTER_RESPONSE | jq .

echo ""
echo "3. Testing Registration Validation (invalid email)..."
curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "invalid-email",
    "password": "123"
  }' | jq .

echo ""
echo "4. Testing Login Validation (invalid email)..."
curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "password123"
  }' | jq .

echo ""
echo "5. Testing Login with Valid Format..."
curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | jq .

echo ""
echo "6. Testing OTP Verification Validation..."
curl -s -X POST "$BASE_URL/api/auth/verify-otp" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "invalid-session",
    "otp": "123"
  }' | jq .

echo ""
echo "7. Testing Password Reset Request..."
curl -s -X POST "$BASE_URL/api/auth/request-password-reset" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }' | jq .

echo ""
echo "8. Testing Password Reset Validation..."
curl -s -X POST "$BASE_URL/api/auth/reset-password" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "invalid-token",
    "newPassword": "123"
  }' | jq .

echo ""
echo "9. Testing Logout..."
curl -s -X POST "$BASE_URL/api/auth/logout" | jq .

echo ""
echo "10. Testing 404 Endpoint..."
curl -s -X GET "$BASE_URL/api/invalid-endpoint" | jq .

echo ""
echo "✅ Test completed! Check the responses above."
echo ""
echo "📝 Notes:"
echo "- Email sending will fail without proper email configuration"
echo "- OTP verification will fail without valid session"
echo "- This demonstrates the API structure and validation"