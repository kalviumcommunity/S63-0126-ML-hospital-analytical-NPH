from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/forecast")
def get_forecast():
    try:
        # Load the realistic CSV data we created
        df = pd.read_csv('../data/hospital_data.csv', parse_dates=['date'])
        
        # Take the last 30 days for the dashboard
        recent_df = df.tail(30).copy()
        
        # Create records
        history = []
        for _, row in recent_df.iterrows():
            history.append({
                "date": row['date'].strftime("%Y-%m-%d"),
                "admissions": int(row['admissions']),
                "icu_occupancy": int(row['icu_occupancy']),
                "general_occupancy": int(row['general_occupancy']),
                "oxygen_usage": int(row['oxygen_usage_liters']),
                "is_prediction": False
            })
            
        # Very simple prediction (Rolling average continuation)
        predictions = []
        last_record = history[-1]
        last_date = datetime.strptime(last_record["date"], "%Y-%m-%d")
        
        # Calculate trend deltas over a 7 day moving window
        admiss_trend = (history[-1]["admissions"] - history[-7]["admissions"]) / 7
        icu_trend = (history[-1]["icu_occupancy"] - history[-7]["icu_occupancy"]) / 7
        gen_trend = (history[-1]["general_occupancy"] - history[-7]["general_occupancy"]) / 7
        oxy_trend = (history[-1]["oxygen_usage"] - history[-7]["oxygen_usage"]) / 7
        
        cur_admiss = last_record["admissions"]
        cur_icu = last_record["icu_occupancy"]
        cur_gen = last_record["general_occupancy"]
        cur_oxy = last_record["oxygen_usage"]
        
        for i in range(1, 8):
            cur_admiss += admiss_trend + np.random.randint(-2, 3)
            cur_icu += icu_trend + np.random.randint(-1, 2)
            cur_gen += gen_trend + np.random.randint(-2, 3)
            cur_oxy += oxy_trend + np.random.randint(-10, 15)
            
            predictions.append({
                "date": (last_date + timedelta(days=i)).strftime("%Y-%m-%d"),
                "admissions": max(0, int(cur_admiss)),
                "icu_occupancy": max(0, int(cur_icu)),
                "general_occupancy": max(0, int(cur_gen)),
                "oxygen_usage": max(0, int(cur_oxy)),
                "is_prediction": True
            })
            
        return history + predictions
    except Exception as e:
        print(f"Error loading data: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
