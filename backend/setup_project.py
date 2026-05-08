import pandas as pd # Import pandas library and alias it as pd for data manipulation
import numpy as np # Import numpy library and alias it as np for numerical operations
import os # Import os module to interact with the operating system (e.g., file paths)
from datetime import datetime # Import datetime class from datetime module to handle dates
import nbformat as nbf # Import nbformat library and alias as nbf to create Jupyter notebooks programmatically

# 1. Generate realistic CSV
print("Generating hospital_data.csv...") # Print a message to the console indicating the start of CSV generation
dates = pd.date_range(start="2025-01-01", end="2025-12-31") # Create a range of dates for the entire year 2025
np.random.seed(42) # Set the seed for numpy's random number generator to ensure reproducibility

# Simulate seasonal trends (higher admissions in winter)
seasonality = np.sin(np.linspace(0, 2 * np.pi, len(dates))) * 20 # Generate a sine wave to simulate seasonal variation in admissions
base_admissions = 50 # Set a base number of daily admissions
admissions = np.clip(base_admissions + seasonality + np.random.normal(0, 5, len(dates)), 10, 150).astype(int) # Calculate daily admissions adding base, seasonality, and random noise, then clip to range [10, 150] and convert to integers

# Create DataFrame
df = pd.DataFrame({ # Create a pandas DataFrame to hold the simulated data
    'date': dates, # Add the dates array as the 'date' column
    'admissions': admissions, # Add the simulated admissions array as the 'admissions' column
    'icu_occupancy': np.clip(admissions * 0.3 + np.random.normal(0, 3, len(dates)), 0, 40).astype(int), # Simulate ICU occupancy based on admissions with noise, clipped to [0, 40], as integers
    'general_occupancy': np.clip(admissions * 0.7 + np.random.normal(0, 5, len(dates)), 0, 100).astype(int), # Simulate general ward occupancy based on admissions with noise, clipped to [0, 100], as integers
    'oxygen_usage_liters': np.clip(admissions * 8.5 + np.random.normal(0, 50, len(dates)), 50, 1500).astype(int), # Simulate oxygen usage based on admissions with noise, clipped to [50, 1500], as integers
    'avg_patient_age': np.clip(np.random.normal(55, 10, len(dates)), 18, 90).astype(int) # Simulate average patient age using a normal distribution, clipped to [18, 90], as integers
}) # End of DataFrame creation

os.makedirs('../data', exist_ok=True) # Create the '../data' directory if it doesn't already exist
df.to_csv('../data/hospital_data.csv', index=False) # Save the DataFrame to a CSV file named 'hospital_data.csv' without the index column
print("hospital_data.csv created successfully.") # Print a success message to the console

# 2. Generate Jupyter Notebook
print("Generating Exploratory_Data_Analysis.ipynb...") # Print a message indicating the start of notebook generation
nb = nbf.v4.new_notebook() # Create a new empty Jupyter notebook object (version 4 format)

text_1 = """# Exploratory Data Analysis: Hospital Resource Forecasting

Welcome to the Data Science core of our project! Before we build predictive models or interactive dashboards, we must first deeply understand our data.
This notebook uses **Pandas**, **NumPy**, **Matplotlib**, and **Seaborn** to transform raw, messy data into meaningful insights.""" # Define the first markdown cell's content

code_1 = """import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Set style for premium visualizations
plt.style.use('seaborn-v0_8-darkgrid')
sns.set_theme(style="whitegrid")

# Load the realistic dataset
df = pd.read_csv('../data/hospital_data.csv', parse_dates=['date'])
df.head()""" # Define the first code cell's content for importing libraries and loading data

text_2 = """## 1. Understanding the Data Structure

First, we will use pandas to check for any missing values and get summary statistics to understand the scale of our data.""" # Define the second markdown cell's content

code_2 = """print("Missing values:")
print(df.isnull().sum())
print("\\n\\nSummary Statistics:")
display(df.describe())""" # Define the second code cell's content for checking missing values and describing data

text_3 = """## 2. Visualizing Distributions (Histograms and Boxplots)

Let's look at the distribution of oxygen usage and patient ages to find any anomalies.""" # Define the third markdown cell's content

code_3 = """fig, axes = plt.subplots(1, 2, figsize=(15, 5))

# Histogram
sns.histplot(df['oxygen_usage_liters'], bins=30, kde=True, color='teal', ax=axes[0])
axes[0].set_title('Distribution of Daily Oxygen Usage')
axes[0].set_xlabel('Oxygen Used (Liters)')

# Boxplot
sns.boxplot(x=df['avg_patient_age'], color='coral', ax=axes[1])
axes[1].set_title('Spread of Average Patient Age')
axes[1].set_xlabel('Age')

plt.tight_layout()
plt.show()""" # Define the third code cell's content for creating a histogram and boxplot

text_4 = """## 3. Investigating Relationships (Scatter Plots & Line Charts)

Does a larger number of ICU patients correlate strictly with oxygen usage? Let's use a scatter plot. We will also plot the admissions over time to spot seasonal trends.""" # Define the fourth markdown cell's content

code_4 = """plt.figure(figsize=(10, 6))
sns.scatterplot(x='icu_occupancy', y='oxygen_usage_liters', data=df, hue='avg_patient_age', palette='viridis', size='avg_patient_age', sizes=(20, 200))
plt.title('ICU Occupancy vs Oxygen Usage')
plt.xlabel('ICU Beds Occupied')
plt.ylabel('Oxygen Usage (Liters)')
plt.show()

plt.figure(figsize=(14, 5))
sns.lineplot(x='date', y='admissions', data=df, color='royalblue', linewidth=2)
plt.title('Daily Hospital Admissions Over Time (Seasonal Trend)')
plt.xlabel('Date')
plt.ylabel('Number of Admissions')
plt.show()""" # Define the fourth code cell's content for creating scatter and line plots

text_5 = """## Conclusion

Through this EDA, we can clearly see the seasonal bounds of our admissions and the strong positive correlation between ICU occupancy and Oxygen usage.
We are now ready to feed this cleaned, understood data into our React Web Dashboard API!""" # Define the fifth markdown cell's content

nb['cells'] = [ # Assign the cells to the notebook object
    nbf.v4.new_markdown_cell(text_1), # Create and add the first markdown cell
    nbf.v4.new_code_cell(code_1), # Create and add the first code cell
    nbf.v4.new_markdown_cell(text_2), # Create and add the second markdown cell
    nbf.v4.new_code_cell(code_2), # Create and add the second code cell
    nbf.v4.new_markdown_cell(text_3), # Create and add the third markdown cell
    nbf.v4.new_code_cell(code_3), # Create and add the third code cell
    nbf.v4.new_markdown_cell(text_4), # Create and add the fourth markdown cell
    nbf.v4.new_code_cell(code_4), # Create and add the fourth code cell
    nbf.v4.new_markdown_cell(text_5), # Create and add the fifth markdown cell
] # End of notebook cells assignment

os.makedirs('../notebooks', exist_ok=True) # Create the '../notebooks' directory if it doesn't already exist
with open('../notebooks/Exploratory_Data_Analysis.ipynb', 'w') as f: # Open the notebook file in write mode
    nbf.write(nb, f) # Write the notebook object to the file
print("Notebook created successfully.") # Print a success message indicating the notebook was created
