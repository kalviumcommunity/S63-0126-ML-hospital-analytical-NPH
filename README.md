# Hospital Resource Forecasting Dashboard 🏥📊

Welcome to the **Hospital Resource Forecasting Dashboard**, a full-stack data science and web application designed to track, visualize, and predict vital hospital resources like admissions, ICU bed occupancy, general ward occupancy, and oxygen usage.

## 🚀 Project Overview

This project simulates a realistic healthcare environment where resource management is critical. It consists of three main pillars:
1. **Data Generation & EDA**: Python scripts that generate realistic hospital admission data with seasonal trends and random noise, along with an Exploratory Data Analysis (EDA) Jupyter Notebook to understand the data.
2. **AI Data Engine (Backend)**: A robust FastAPI backend that serves the data and calculates 7-day rolling average forecasts to predict future resource needs.
3. **Interactive Dashboard (Frontend)**: A modern, premium React (Vite) frontend that provides an interactive visual dashboard for administrators to monitor historical trends and forecasted usage.

---

## 🛠️ How It Works

### The Data Layer (`backend/setup_project.py`)
- Simulates 365 days of hospital data considering seasonal trends (e.g., higher admissions in winter).
- Correlates ICU occupancy, general occupancy, and oxygen usage directly to admissions to mimic real-world scenarios.
- Outputs a clean CSV (`data/hospital_data.csv`) and generates an EDA Jupyter Notebook (`notebooks/Exploratory_Data_Analysis.ipynb`).

### The Backend API (`backend/main.py`)
- Built with **FastAPI**.
- Reads the generated `hospital_data.csv`.
- Exposes a `/api/forecast` endpoint.
- Returns the last 30 days of historical data and computes a 7-day future prediction using a rolling average continuation algorithm with added stochastic noise.

### The Frontend Dashboard (`frontend/`)
- Built with **React** and **Vite**.
- Fetches data from the FastAPI backend.
- Renders premium, interactive charts allowing users to visually distinguish between historical data and forecasted predictions.

---

## 💻 How to Run the Project

### Prerequisites
- Python 3.8+
- Node.js (v16+) & npm

### Quick Start (Windows)
The easiest way to start the entire application is to use the provided batch script.

1. Open your terminal or command prompt in the root of the project directory.
2. Run the `start.bat` file:
   ```cmd
   start.bat
   ```
3. This script will automatically:
   - Activate the Python virtual environment and start the FastAPI backend on `http://localhost:8000`.
   - Start the Vite React development server for the frontend.
4. Open your browser and navigate to `http://localhost:5173` to view the dashboard!

### Manual Setup & Execution

If you prefer to start the services manually or are not on Windows:

**1. Generate the Data (One-time setup):**
```bash
cd backend
# Create and activate virtual environment (if not already done)
python -m venv venv
venv\Scripts\activate  # On Mac/Linux use: source venv/bin/activate

# Install dependencies (assuming you have a requirements.txt, or install pandas, numpy, fastapi, uvicorn, nbformat)
pip install -r requirements.txt

# Run the setup script to generate data and notebooks
python setup_project.py
```

**2. Start the Backend:**
```bash
cd backend
venv\Scripts\activate  # Make sure venv is active
python main.py
```
*The backend will run on `http://localhost:8000`*

**3. Start the Frontend:**
Open a **new** terminal window:
```bash
cd frontend
npm install   # Install node modules if you haven't yet
npm run dev
```
*The frontend will run on `http://localhost:5173`*

---

## 📁 Project Structure

```text
├── backend/
│   ├── main.py                # FastAPI server and forecasting logic
│   ├── setup_project.py       # Data and notebook generation script
│   ├── requirements.txt       # Python dependencies
│   └── venv/                  # Python Virtual Environment
├── frontend/
│   ├── src/                   # React source code and components
│   ├── package.json           # Node dependencies
│   └── vite.config.js         # Vite configuration
├── data/
│   └── hospital_data.csv      # Generated dataset
├── notebooks/
│   └── Exploratory_Data_Analysis.ipynb  # Generated EDA notebook
├── start.bat                  # One-click startup script for Windows
└── .gitignore                 # Git ignore rules
```
