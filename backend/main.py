from fastapi import FastAPI # Import the FastAPI framework to build the web API
from fastapi.middleware.cors import CORSMiddleware # Import CORS middleware to allow cross-origin requests from the frontend
import pandas as pd # Import pandas for data manipulation and reading the CSV
import numpy as np # Import numpy for numerical operations and generating random numbers
from datetime import datetime, timedelta # Import datetime tools to manipulate dates for forecasting

app = FastAPI() # Initialize a new FastAPI application instance

app.add_middleware( # Add middleware to the FastAPI application
    CORSMiddleware, # Specify that we are adding CORS middleware
    allow_origins=["*"], # Allow requests from any origin (useful for development, restrict in production)
    allow_methods=["*"], # Allow any HTTP method (GET, POST, etc.)
    allow_headers=["*"], # Allow any HTTP headers in the request
) # End of middleware configuration

@app.get("/api/forecast") # Define a GET route at the /api/forecast endpoint
def get_forecast(): # Define the function that runs when this endpoint is hit
    try: # Start a try block to handle potential errors like missing files
        # Load the realistic CSV data we created
        df = pd.read_csv('../data/hospital_data.csv', parse_dates=['date']) # Read the dataset and parse the 'date' column as datetime objects
        
        # Take the last 30 days for the dashboard
        recent_df = df.tail(30).copy() # Extract the last 30 rows of the dataframe to show recent history
        
        # Create records
        history = [] # Initialize an empty list to store the historical data records
        for _, row in recent_df.iterrows(): # Iterate over each row in the recent 30-day dataframe
            history.append({ # Append a dictionary for each day to the history list
                "date": row['date'].strftime("%Y-%m-%d"), # Convert the datetime object back to a formatted string
                "admissions": int(row['admissions']), # Convert admissions to an integer and add to the record
                "icu_occupancy": int(row['icu_occupancy']), # Convert ICU occupancy to an integer and add to the record
                "general_occupancy": int(row['general_occupancy']), # Convert general occupancy to an integer and add to the record
                "oxygen_usage": int(row['oxygen_usage_liters']), # Convert oxygen usage to an integer and add to the record
                "is_prediction": False # Flag this record as historical data, not a prediction
            }) # Close the dictionary
            
        # Very simple prediction (Rolling average continuation)
        predictions = [] # Initialize an empty list to store the future forecasted records
        last_record = history[-1] # Get the very last historical record to use as a starting point for forecasting
        last_date = datetime.strptime(last_record["date"], "%Y-%m-%d") # Parse the last date string back into a datetime object
        
        # Calculate trend deltas over a 7 day moving window
        admiss_trend = (history[-1]["admissions"] - history[-7]["admissions"]) / 7 # Calculate the average daily change in admissions over the last 7 days
        icu_trend = (history[-1]["icu_occupancy"] - history[-7]["icu_occupancy"]) / 7 # Calculate the average daily change in ICU occupancy over the last 7 days
        gen_trend = (history[-1]["general_occupancy"] - history[-7]["general_occupancy"]) / 7 # Calculate the average daily change in general occupancy over the last 7 days
        oxy_trend = (history[-1]["oxygen_usage"] - history[-7]["oxygen_usage"]) / 7 # Calculate the average daily change in oxygen usage over the last 7 days
        
        cur_admiss = last_record["admissions"] # Set the starting admissions value for the forecast loop
        cur_icu = last_record["icu_occupancy"] # Set the starting ICU value for the forecast loop
        cur_gen = last_record["general_occupancy"] # Set the starting general ward value for the forecast loop
        cur_oxy = last_record["oxygen_usage"] # Set the starting oxygen value for the forecast loop
        
        for i in range(1, 8): # Loop 7 times to create a 7-day forecast
            cur_admiss += admiss_trend + np.random.randint(-2, 3) # Add the trend and some random noise to the current admissions
            cur_icu += icu_trend + np.random.randint(-1, 2) # Add the trend and some random noise to the current ICU occupancy
            cur_gen += gen_trend + np.random.randint(-2, 3) # Add the trend and some random noise to the current general occupancy
            cur_oxy += oxy_trend + np.random.randint(-10, 15) # Add the trend and some random noise to the current oxygen usage
            
            predictions.append({ # Append the new predicted day's data to the predictions list
                "date": (last_date + timedelta(days=i)).strftime("%Y-%m-%d"), # Calculate the future date and format it as a string
                "admissions": max(0, int(cur_admiss)), # Convert to int, ensuring the value doesn't drop below 0
                "icu_occupancy": max(0, int(cur_icu)), # Convert to int, ensuring the value doesn't drop below 0
                "general_occupancy": max(0, int(cur_gen)), # Convert to int, ensuring the value doesn't drop below 0
                "oxygen_usage": max(0, int(cur_oxy)), # Convert to int, ensuring the value doesn't drop below 0
                "is_prediction": True # Flag this record explicitly as a predicted value
            }) # Close the dictionary
            
        return history + predictions # Combine historical data and future predictions and return as JSON
    except Exception as e: # Catch any exceptions that happen during execution (e.g. file not found)
        print(f"Error loading data: {e}") # Print the error to the backend console
        return {"error": str(e)} # Return an error message to the frontend as JSON

if __name__ == "__main__": # Check if this script is being run directly (not imported as a module)
    import uvicorn # Import uvicorn, the ASGI server used to run FastAPI
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) # Start the server on port 8000, accessible on all network interfaces, with auto-reload enabled
