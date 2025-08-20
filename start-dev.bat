@echo off
REM Script to start both the main app and crypto-payment microfrontend on Windows

echo 🚀 Starting MedSup Pro with Crypto Payment Microfrontend (Module Federation)...

REM Start crypto-payment microfrontend first (it needs to be available for federation)
echo 📱 Starting Crypto Payment Microfrontend on port 3001...
cd apps\crypto-payment
start "Crypto Payment MFE" cmd /k "yarn dev"

REM Wait for the crypto service to start and build
echo ⏳ Waiting for crypto-payment to initialize...
timeout /t 8 /nobreak >nul

REM Start main application
cd ..\..
echo 🏥 Starting Main MedSup Pro Shell Application on port 5173...
start "MedSup Shell" cmd /k "yarn dev"

echo.
echo ✅ Module Federation setup is starting...
echo 🏥 Shell App: http://localhost:5173
echo 💰 Crypto MFE: http://localhost:3001
echo � Federated Integration: http://localhost:5173/crypto-payment
echo.
echo 📋 Debug URLs:
echo    - Remote Entry: http://localhost:3001/assets/remoteEntry.js
echo    - Standalone MFE: http://localhost:3001
echo.
echo ⚠️  IMPORTANT: The crypto-payment microfrontend must be running BEFORE the shell app
echo    for Module Federation to work properly.
echo.
echo Press any key to continue...
pause >nul
