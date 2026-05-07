"""
data_cleaning.py
================
Cleans the raw hospital resource dataset:
  - Fixes temperature column (removes 'C' suffix, converts 'nan' strings to NaN)
  - Standardises hospital_type and location (lowercase, strip whitespace)
  - Fills missing daily_admissions with column median
  - Fills missing covid_cases with 0
  - Drops exact duplicate rows
  - Converts date to datetime
  - Exports cleaned CSV: cleaned_data.csv

Run:
    python data_cleaning.py
"""

import pandas as pd
import numpy as np
import os

RAW_PATH  = os.path.join(os.path.dirname(__file__), "unclean_from_clean_dataset.csv")
OUT_PATH  = os.path.join(os.path.dirname(__file__), "cleaned_data.csv")


def fix_temperature(series: pd.Series) -> pd.Series:
    """
    Handles values like '24.0C', 'nanC', 'nan', and proper floats.
    Returns a float64 Series with NaNs where the value was missing.
    """
    s = series.astype(str).str.strip()
    s = s.str.replace(r"[Cc]$", "", regex=True)   # strip trailing C/c
    s = s.replace({"nan": np.nan, "": np.nan})
    return pd.to_numeric(s, errors="coerce")


def clean_dataset(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    initial_rows = len(df)
    print(f"[INFO] Loaded {initial_rows} rows from '{path}'")

    # ── 1. Drop exact duplicates ──────────────────────────────────────────
    df.drop_duplicates(inplace=True)
    print(f"[INFO] Dropped {initial_rows - len(df)} duplicate rows → {len(df)} rows remain")

    # ── 2. Parse date ─────────────────────────────────────────────────────
    df["date"] = pd.to_datetime(df["date"], errors="coerce")

    # ── 3. Standardise categorical columns ───────────────────────────────
    df["hospital_type"] = df["hospital_type"].astype(str).str.strip().str.lower()
    df["location"]      = df["location"].astype(str).str.strip().str.lower()

    # ── 4. Fix temperature ────────────────────────────────────────────────
    temp_missing_before = df["temperature"].isna().sum()
    df["temperature"]   = fix_temperature(df["temperature"])
    temp_missing_after  = df["temperature"].isna().sum()
    print(f"[INFO] Temperature: {temp_missing_after} NaNs detected "
          f"(was {temp_missing_before} before fix)")
    # Impute with median
    temp_median = df["temperature"].median()
    df["temperature"].fillna(temp_median, inplace=True)
    print(f"[INFO] Temperature NaNs filled with median = {temp_median:.1f}")

    # ── 5. Fill missing daily_admissions (median imputation) ──────────────
    adm_missing = df["daily_admissions"].isna().sum()
    adm_median  = df["daily_admissions"].median()
    df["daily_admissions"].fillna(adm_median, inplace=True)
    print(f"[INFO] daily_admissions: {adm_missing} NaNs filled with median = {adm_median:.1f}")

    # ── 6. Fill missing covid_cases (fill with column median) ─────────────
    covid_missing = df["covid_cases"].isna().sum()
    covid_median  = df["covid_cases"].median()
    df["covid_cases"].fillna(covid_median, inplace=True)
    print(f"[INFO] covid_cases: {covid_missing} NaNs filled with median = {covid_median:.1f}")

    # ── 7. Cast numeric columns ───────────────────────────────────────────
    numeric_cols = [
        "hospital_id", "daily_admissions", "daily_discharges", "emergency_cases",
        "outpatient_visits", "flu_cases", "covid_cases", "respiratory_cases",
        "beds_occupied", "icu_beds_occupied", "oxygen_units_used", "ventilators_used",
        "temperature", "rainfall", "air_quality_index", "festival_or_event",
        "next_day_beds_needed", "next_day_icu_needed", "next_day_oxygen_needed",
    ]
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    # ── 8. Final null check ───────────────────────────────────────────────
    remaining_nulls = df.isnull().sum()
    nulls_with_data = remaining_nulls[remaining_nulls > 0]
    if nulls_with_data.empty:
        print("[INFO] No remaining null values ✓")
    else:
        print("[WARN] Remaining nulls:\n", nulls_with_data)

    print(f"\n[DONE] Cleaned dataset shape: {df.shape}")
    return df


def main():
    df = clean_dataset(RAW_PATH)
    df.to_csv(OUT_PATH, index=False)
    print(f"[SAVED] Cleaned data written to '{OUT_PATH}'")

    # Quick summary
    print("\n=== Dataset Summary ===")
    print(f"  Date range   : {df['date'].min().date()} → {df['date'].max().date()}")
    print(f"  Hospitals    : {sorted(df['hospital_id'].unique().tolist())}")
    print(f"  Hospital types: {sorted(df['hospital_type'].unique().tolist())}")
    print(f"  Locations    : {sorted(df['location'].unique().tolist())}")
    print(f"  Total rows   : {len(df)}")


if __name__ == "__main__":
    main()
