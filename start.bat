@echo off
echo ========================================================
echo        HOSPITAL RESOURCE FORECASTING DASHBOARD
echo ========================================================
echo.
echo Starting the AI Data Engine (Background Math)...
start cmd /k "cd backend && venv\Scripts\activate && python main.py"

echo Starting the Visual Dashboard (The Website)...
start cmd /k "cd frontend && npm run dev"

echo.
echo Both systems are starting up! 
echo A new browser window should open automatically in a moment.
echo If it doesn't, manually open your web browser and go to:
echo http://localhost:5173
echo.
pause
