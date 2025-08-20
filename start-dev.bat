@echo off
REM Script to start both the main app and adyen-payment microfrontend on Windows

echo 🚀 Starting MedSup Pro with Adyen Payment Microfrontend (Module Federation)...

REM Start adyen-payment microfrontend first (it needs to be available for federation)
echo 📱 Starting Adyen Payment Microfrontend on port 3000...
cd apps\adyen-payment
start "Adyen Payment MFE" cmd /k "yarn dev"

REM Wait for the adyen service to start and build
echo ⏳ Waiting for adyen-payment to initialize...
timeout /t 8 /nobreak >nul

REM Start main application
cd ..\..
echo 🏥 Starting Main MedSup Pro Shell Application on port 5173...
start "MedSup Shell" cmd /k "yarn dev"

echo.
echo ✅ Module Federation setup is starting...
echo 🏥 Shell App: http://localhost:5173
echo � Adyen MFE: http://localhost:3000
echo 📖 Federated Integration: http://localhost:5173/adyen-payment
echo.
echo 📋 Debug URLs:
echo    - Remote Entry: http://localhost:3000/assets/remoteEntry.js
echo    - Standalone MFE: http://localhost:3000
echo.
echo ⚠️  IMPORTANT: The adyen-payment microfrontend must be running BEFORE the shell app
echo    for Module Federation to work properly.
echo.
echo Press any key to continue...
pause >nul
