#!/bin/bash

# Script to start both the main app and crypto-payment microfrontend

echo "🚀 Starting MedSup Pro with Crypto Payment Microfrontend..."

# Function to kill background processes on exit
cleanup() {
    echo "🛑 Stopping all services..."
    kill $MAIN_PID $CRYPTO_PID 2>/dev/null
    exit
}

# Set up trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Start crypto-payment microfrontend
echo "📱 Starting Crypto Payment Microfrontend on port 3001..."
cd apps/crypto-payment
yarn dev &
CRYPTO_PID=$!

# Wait a bit for the crypto service to start
sleep 3

# Start main application
echo "🏥 Starting Main MedSup Pro Application on port 5173..."
cd ../..
yarn dev &
MAIN_PID=$!

echo "✅ Both services are starting..."
echo "🏥 Main App: http://localhost:5173"
echo "💰 Crypto Payment: http://localhost:3001"
echo "📖 Integration Example: http://localhost:5173/crypto-payment-integration"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for background processes
wait
