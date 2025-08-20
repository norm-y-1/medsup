#!/bin/bash

# Script to start both the main app and adyen-payment microfrontend

echo "🚀 Starting MedSup Pro with Adyen Payment Microfrontend..."

# Function to kill background processes on exit
cleanup() {
    echo "🛑 Stopping all services..."
    kill $MAIN_PID $ADYEN_PID 2>/dev/null
    exit
}

# Set up trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Start adyen-payment microfrontend
echo "📱 Starting Adyen Payment Microfrontend on port 3000..."
cd apps/adyen-payment
yarn dev &
ADYEN_PID=$!

# Wait a bit for the adyen service to start
sleep 3

# Start main application
echo "🏥 Starting Main MedSup Pro Application on port 5173..."
cd ../..
yarn dev &
MAIN_PID=$!

echo "✅ Both services are starting..."
echo "🏥 Main App: http://localhost:5173"
echo "� Adyen Payment: http://localhost:3000"
echo "📖 Integration Example: http://localhost:5173/adyen-payment"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for background processes
wait
