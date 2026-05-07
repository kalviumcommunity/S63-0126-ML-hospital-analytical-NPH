# Hospital Resource Management System

A comprehensive data analysis and visualization system for hospital resource datasets. This project combines Python-based data cleaning and exploratory data analysis with a modern Next.js dashboard for data visualization.

## Project Overview

This project processes and visualizes hospital resource data through two main components:
- **Data Pipeline**: Python scripts for data cleaning and exploratory data analysis
- **Dashboard**: Interactive Next.js web application for data visualization

## Project Structure

```
.
├── README.md                              # This file
├── requirements.txt                       # Python dependencies
├── render.yaml                            # Render deployment configuration
│
├── Data Files:
├── hospital_resource_dataset_500.csv      # Source dataset (500 records)
├── unclean_from_clean_dataset.csv         # Test data with intentional issues
├── cleaned_data.csv                       # Processed and cleaned dataset
│
├── Python Scripts:
├── data_cleaning.py                       # Data cleaning and preprocessing
├── eda_charts.py                          # Exploratory data analysis and charts
│
├── Output:
├── charts/
│   └── stats.json                         # Generated statistics in JSON format
│
└── hospital-dashboard/                    # Next.js web application
    ├── package.json
    ├── next.config.ts
    ├── tsconfig.json
    ├── app/
    │   ├── page.tsx                       # Main dashboard page
    │   ├── layout.tsx                     # App layout
    │   ├── page.module.css                # Page styles
    │   └── globals.css                    # Global styles
    ├── public/
    │   └── charts/
    │       └── stats.json                 # Chart data served statically
    └── README.md                          # Dashboard-specific documentation
```

## Getting Started

### Prerequisites

- Python 3.7+
- Node.js 16+ (for dashboard)
- npm or yarn

### Installation

#### 1. Set up Python Environment

Install Python dependencies:
```bash
pip install -r requirements.txt
```

#### 2. Execute Data Pipeline

Run the data cleaning script:
```bash
python data_cleaning.py
```

Generate exploratory data analysis:
```bash
python eda_charts.py
```

This will create `cleaned_data.csv` and `charts/stats.json`.

#### 3. Set up and Run the Dashboard

Navigate to the hospital-dashboard directory:
```bash
cd hospital-dashboard
```

Install dependencies:
```bash
npm install
# or
yarn install
```

Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the dashboard.

## Data Files

- **hospital_resource_dataset_500.csv**: Original dataset containing 500 hospital resource records
- **unclean_from_clean_dataset.csv**: Test dataset with intentional data quality issues for validation
- **cleaned_data.csv**: Output from data_cleaning.py; cleaned and standardized data ready for analysis

## Python Scripts

### data_cleaning.py
Handles data preprocessing tasks:
- Loading and validating raw data
- Cleaning and standardizing values
- Handling missing values
- Data type conversions
- Output: `cleaned_data.csv`

### eda_charts.py
Performs exploratory data analysis:
- Statistical analysis
- Data visualization
- Chart generation
- Output: `charts/stats.json`

## Dashboard

The Next.js dashboard provides:
- Interactive data visualizations
- Real-time chart updates
- Responsive design
- Static chart data serving from `/public/charts/stats.json`

For more details, see [hospital-dashboard/README.md](hospital-dashboard/README.md)

### Running Dashboard in Production

Build the dashboard:
```bash
cd hospital-dashboard
npm run build
```

Start the production server:
```bash
npm start
```

## Deployment

The project includes `render.yaml` for automated deployment on Render.

### Deploy to Render

1. Push your code to a Git repository
2. Connect your repository to Render
3. Render will automatically read `render.yaml` and deploy your application

See the [Render deployment documentation](https://render.com/docs) for more details.

## Dependencies

### Python (see requirements.txt)
- pandas - Data manipulation and analysis
- numpy - Numerical computing
- matplotlib - Data visualization
- seaborn - Statistical data visualization
- scikit-learn - Machine learning and data processing

### Node.js
- Next.js - React framework for production
- React - UI library
- TypeScript - Type-safe JavaScript

## Development Workflow

1. **Data Processing**: Update hospital data files → Run `data_cleaning.py` → Run `eda_charts.py`
2. **Dashboard Update**: Stats automatically serve to the dashboard from `public/charts/stats.json`
3. **Dashboard Development**: Edit files in `hospital-dashboard/app/` and see changes reflected automatically

## Troubleshooting

### Python Script Issues
- Ensure `requirements.txt` dependencies are installed
- Check CSV file paths are correct
- Verify data format matches expected schema

### Dashboard Issues
- Clear `.next` build cache: `rm -rf hospital-dashboard/.next`
- Rebuild: `cd hospital-dashboard && npm run build`
- Ensure port 3000 is available

## Contributing

When working with this project:
1. Update Python scripts in the root directory
2. Run data processing scripts to generate `charts/stats.json`
3. Update dashboard components as needed
4. Test both data pipeline and web interface

## License

[Add your license information here]

## Support

For questions or issues, please check individual README files:
- Dashboard: [hospital-dashboard/README.md](hospital-dashboard/README.md)
