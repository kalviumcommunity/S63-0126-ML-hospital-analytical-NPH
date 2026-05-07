"""
eda_charts.py
=============
Generates 9 publication-quality chart images from cleaned_data.csv.
All images are saved to a 'charts/' folder alongside this script.

Run:
    python3 eda_charts.py
"""

import os
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import seaborn as sns
from matplotlib.gridspec import GridSpec

# ── Paths ────────────────────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
DATA_PATH  = os.path.join(BASE_DIR, "cleaned_data.csv")
CHARTS_DIR = os.path.join(BASE_DIR, "charts")
os.makedirs(CHARTS_DIR, exist_ok=True)

# ── Global Style ─────────────────────────────────────────────────────────────
BG       = "#0a0f1e"
PANEL    = "#111827"
CYAN     = "#00d4ff"
GREEN    = "#00ff88"
ORANGE   = "#ff8c00"
PINK     = "#ff4d8b"
PURPLE   = "#a855f7"
GOLD     = "#fbbf24"
TEXT     = "#e2e8f0"
SUBTEXT  = "#94a3b8"
GRID     = "#1e293b"

plt.rcParams.update({
    "figure.facecolor":  BG,
    "axes.facecolor":    PANEL,
    "axes.edgecolor":    GRID,
    "axes.labelcolor":   TEXT,
    "axes.titlecolor":   TEXT,
    "xtick.color":       SUBTEXT,
    "ytick.color":       SUBTEXT,
    "grid.color":        GRID,
    "grid.linewidth":    0.7,
    "text.color":        TEXT,
    "font.family":       "DejaVu Sans",
    "axes.titlesize":    14,
    "axes.labelsize":    11,
    "xtick.labelsize":   9,
    "ytick.labelsize":   9,
    "legend.fontsize":   9,
    "legend.framealpha": 0.3,
    "legend.facecolor":  PANEL,
    "legend.edgecolor":  GRID,
})

# ── Load Data ─────────────────────────────────────────────────────────────────
df = pd.read_csv(DATA_PATH, parse_dates=["date"])
df["month"]      = df["date"].dt.to_period("M")
df["month_str"]  = df["date"].dt.strftime("%b %Y")
df["month_dt"]   = df["date"].dt.to_period("M").dt.to_timestamp()

monthly = df.groupby("month_dt").agg(
    total_admissions  = ("daily_admissions",  "sum"),
    avg_admissions    = ("daily_admissions",  "mean"),
    flu_cases         = ("flu_cases",          "sum"),
    covid_cases       = ("covid_cases",        "sum"),
    respiratory_cases = ("respiratory_cases",  "sum"),
    avg_icu           = ("icu_beds_occupied",  "mean"),
    avg_aqi           = ("air_quality_index",  "mean"),
).reset_index()

print(f"[INFO] Loaded {len(df)} rows. Generating charts in '{CHARTS_DIR}'…\n")

# ─────────────────────────────────────────────────────────────────────────────
# Chart 1 — Monthly Admissions Trend (line + area)
# ─────────────────────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(12, 5))
fig.patch.set_facecolor(BG)
ax.set_facecolor(PANEL)

ax.fill_between(monthly["month_dt"], monthly["total_admissions"],
                alpha=0.15, color=CYAN)
ax.plot(monthly["month_dt"], monthly["total_admissions"],
        color=CYAN, linewidth=2.5, marker="o", markersize=5, label="Total Admissions")

ax.set_title("Monthly Total Hospital Admissions — Jan 2025 to May 2026", pad=14)
ax.set_xlabel("Month")
ax.set_ylabel("Total Admissions")
ax.grid(True, alpha=0.4)
ax.legend()
ax.spines[["top","right"]].set_visible(False)
plt.xticks(rotation=30, ha="right")
plt.tight_layout()
plt.savefig(os.path.join(CHARTS_DIR, "01_monthly_admissions_trend.png"), dpi=150, bbox_inches="tight")
plt.close()
print("[✓] 01_monthly_admissions_trend.png")

# ─────────────────────────────────────────────────────────────────────────────
# Chart 2 — Hospital Type Comparison (grouped bars: avg beds occupied)
# ─────────────────────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(9, 5))
fig.patch.set_facecolor(BG)
ax.set_facecolor(PANEL)

type_loc = df.groupby(["hospital_type", "location"])[
    ["beds_occupied", "icu_beds_occupied", "daily_admissions"]
].mean().reset_index()

x        = np.arange(2)   # rural, urban
width    = 0.25
types    = ["small", "medium"]
colors   = [CYAN, GREEN]
locations = ["rural", "urban"]

for i, htype in enumerate(types):
    vals = []
    for loc in locations:
        subset = type_loc[(type_loc["hospital_type"] == htype) & (type_loc["location"] == loc)]
        vals.append(subset["beds_occupied"].values[0] if len(subset) else 0)
    ax.bar(x + i * width, vals, width, label=f"{htype.title()} hospital",
           color=colors[i], alpha=0.85)

ax.set_xticks(x + width / 2)
ax.set_xticklabels(["Rural", "Urban"])
ax.set_title("Avg Beds Occupied: Hospital Type × Location")
ax.set_ylabel("Avg Beds Occupied")
ax.legend()
ax.grid(True, axis="y", alpha=0.4)
ax.spines[["top","right"]].set_visible(False)
plt.tight_layout()
plt.savefig(os.path.join(CHARTS_DIR, "02_hospital_type_comparison.png"), dpi=150, bbox_inches="tight")
plt.close()
print("[✓] 02_hospital_type_comparison.png")

# ─────────────────────────────────────────────────────────────────────────────
# Chart 3 — Case Type Distribution Over Time (stacked area)
# ─────────────────────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(12, 5))
fig.patch.set_facecolor(BG)
ax.set_facecolor(PANEL)

ax.stackplot(
    monthly["month_dt"],
    monthly["flu_cases"],
    monthly["covid_cases"],
    monthly["respiratory_cases"],
    labels=["Flu Cases", "COVID Cases", "Respiratory Cases"],
    colors=[ORANGE, PINK, PURPLE],
    alpha=0.75,
)
ax.set_title("Monthly Case Distribution: Flu · COVID · Respiratory")
ax.set_xlabel("Month")
ax.set_ylabel("Total Cases")
ax.legend(loc="upper left")
ax.grid(True, alpha=0.3)
ax.spines[["top","right"]].set_visible(False)
plt.xticks(rotation=30, ha="right")
plt.tight_layout()
plt.savefig(os.path.join(CHARTS_DIR, "03_case_type_distribution.png"), dpi=150, bbox_inches="tight")
plt.close()
print("[✓] 03_case_type_distribution.png")

# ─────────────────────────────────────────────────────────────────────────────
# Chart 4 — Correlation Heatmap
# ─────────────────────────────────────────────────────────────────────────────
num_cols = [
    "daily_admissions", "daily_discharges", "emergency_cases",
    "flu_cases", "covid_cases", "respiratory_cases",
    "beds_occupied", "icu_beds_occupied", "oxygen_units_used",
    "ventilators_used", "temperature", "rainfall", "air_quality_index",
]
corr = df[num_cols].corr()
labels = [c.replace("_", "\n") for c in num_cols]

fig, ax = plt.subplots(figsize=(12, 10))
fig.patch.set_facecolor(BG)
ax.set_facecolor(PANEL)

cmap = sns.diverging_palette(220, 20, as_cmap=True)
mask = np.zeros_like(corr, dtype=bool)
mask[np.triu_indices_from(mask)] = True

sns.heatmap(
    corr, mask=mask, cmap=cmap, vmin=-1, vmax=1, center=0,
    annot=True, fmt=".2f", annot_kws={"size": 7},
    linewidths=0.5, linecolor=BG,
    xticklabels=labels, yticklabels=labels,
    ax=ax,
    cbar_kws={"shrink": 0.8},
)
ax.set_title("Feature Correlation Heatmap", pad=14)
plt.xticks(rotation=45, ha="right", fontsize=8)
plt.yticks(rotation=0, fontsize=8)
plt.tight_layout()
plt.savefig(os.path.join(CHARTS_DIR, "04_correlation_heatmap.png"), dpi=150, bbox_inches="tight")
plt.close()
print("[✓] 04_correlation_heatmap.png")

# ─────────────────────────────────────────────────────────────────────────────
# Chart 5 — Daily Admissions Distribution (histogram + KDE)
# ─────────────────────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(9, 5))
fig.patch.set_facecolor(BG)
ax.set_facecolor(PANEL)

ax.hist(df["daily_admissions"], bins=25, color=CYAN, alpha=0.5, edgecolor=BG, label="Frequency")
ax2 = ax.twinx()
df["daily_admissions"].plot.kde(ax=ax2, color=GREEN, linewidth=2.5, label="KDE")
ax2.set_ylabel("Density", color=GREEN)
ax2.tick_params(axis="y", labelcolor=GREEN)
ax2.set_facecolor(PANEL)
ax2.spines[["top","right"]].set_visible(False)

ax.set_title("Distribution of Daily Admissions")
ax.set_xlabel("Daily Admissions")
ax.set_ylabel("Count")
ax.spines[["top","right"]].set_visible(False)
ax.grid(True, alpha=0.3)

lines1, labels1 = ax.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
ax.legend(lines1 + lines2, labels1 + labels2, loc="upper left")
plt.tight_layout()
plt.savefig(os.path.join(CHARTS_DIR, "05_admissions_distribution.png"), dpi=150, bbox_inches="tight")
plt.close()
print("[✓] 05_admissions_distribution.png")

# ─────────────────────────────────────────────────────────────────────────────
# Chart 6 — COVID Cases Boxplot by Hospital Type
# ─────────────────────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(9, 5))
fig.patch.set_facecolor(BG)
ax.set_facecolor(PANEL)

palette = {"small": CYAN, "medium": ORANGE}
sns.boxplot(
    data=df, x="hospital_type", y="covid_cases", hue="location",
    palette=[GREEN, PINK], ax=ax,
    flierprops=dict(marker="o", markerfacecolor=SUBTEXT, markersize=4, alpha=0.5),
    medianprops=dict(color=GOLD, linewidth=2),
    boxprops=dict(edgecolor=TEXT, linewidth=1.2),
    whiskerprops=dict(color=TEXT, linewidth=1.2),
    capprops=dict(color=TEXT, linewidth=1.2),
)
ax.set_title("COVID Cases Distribution by Hospital Type & Location")
ax.set_xlabel("Hospital Type")
ax.set_ylabel("COVID Cases per Day")
ax.grid(True, axis="y", alpha=0.3)
ax.spines[["top","right"]].set_visible(False)
plt.tight_layout()
plt.savefig(os.path.join(CHARTS_DIR, "06_covid_boxplot.png"), dpi=150, bbox_inches="tight")
plt.close()
print("[✓] 06_covid_boxplot.png")

# ─────────────────────────────────────────────────────────────────────────────
# Chart 7 — Air Quality vs Admissions (scatter coloured by location)
# ─────────────────────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(9, 5))
fig.patch.set_facecolor(BG)
ax.set_facecolor(PANEL)

for loc, col in [("rural", GREEN), ("urban", PINK)]:
    sub = df[df["location"] == loc]
    ax.scatter(sub["air_quality_index"], sub["daily_admissions"],
               c=col, alpha=0.45, s=30, label=loc.title(), edgecolors="none")

# Trend line (all data)
z = np.polyfit(df["air_quality_index"], df["daily_admissions"], 1)
p = np.poly1d(z)
xline = np.linspace(df["air_quality_index"].min(), df["air_quality_index"].max(), 200)
ax.plot(xline, p(xline), color=GOLD, linewidth=2, linestyle="--", label="Trend")

ax.set_title("Air Quality Index vs Daily Admissions")
ax.set_xlabel("Air Quality Index (AQI)")
ax.set_ylabel("Daily Admissions")
ax.legend()
ax.grid(True, alpha=0.3)
ax.spines[["top","right"]].set_visible(False)
plt.tight_layout()
plt.savefig(os.path.join(CHARTS_DIR, "07_aqi_vs_admissions_scatter.png"), dpi=150, bbox_inches="tight")
plt.close()
print("[✓] 07_aqi_vs_admissions_scatter.png")

# ─────────────────────────────────────────────────────────────────────────────
# Chart 8 — Seasonal Disease Trends (multi-line monthly)
# ─────────────────────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(12, 5))
fig.patch.set_facecolor(BG)
ax.set_facecolor(PANEL)

for col, color, label in [
    ("flu_cases",         ORANGE, "Flu"),
    ("covid_cases",       PINK,   "COVID-19"),
    ("respiratory_cases", PURPLE, "Respiratory"),
]:
    ax.plot(monthly["month_dt"], monthly[col],
            color=color, linewidth=2.2, marker="o", markersize=5, label=label)
    ax.fill_between(monthly["month_dt"], monthly[col], alpha=0.06, color=color)

ax.set_title("Seasonal Disease Trends — Monthly Totals")
ax.set_xlabel("Month")
ax.set_ylabel("Total Cases")
ax.legend()
ax.grid(True, alpha=0.35)
ax.spines[["top","right"]].set_visible(False)
plt.xticks(rotation=30, ha="right")
plt.tight_layout()
plt.savefig(os.path.join(CHARTS_DIR, "08_seasonal_disease_trends.png"), dpi=150, bbox_inches="tight")
plt.close()
print("[✓] 08_seasonal_disease_trends.png")

# ─────────────────────────────────────────────────────────────────────────────
# Chart 9 — ICU Utilisation Over Time (line with threshold band)
# ─────────────────────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(12, 5))
fig.patch.set_facecolor(BG)
ax.set_facecolor(PANEL)

ax.plot(monthly["month_dt"], monthly["avg_icu"],
        color=ORANGE, linewidth=2.5, marker="s", markersize=5, label="Avg ICU Beds Occupied")
ax.fill_between(monthly["month_dt"], monthly["avg_icu"], alpha=0.12, color=ORANGE)
ax.axhline(y=monthly["avg_icu"].mean(), color=GOLD, linewidth=1.5,
           linestyle="--", label=f"Overall Avg = {monthly['avg_icu'].mean():.1f}")

ax.set_title("Average ICU Bed Utilisation — Monthly Trend")
ax.set_xlabel("Month")
ax.set_ylabel("Avg ICU Beds Occupied")
ax.legend()
ax.grid(True, alpha=0.35)
ax.spines[["top","right"]].set_visible(False)
plt.xticks(rotation=30, ha="right")
plt.tight_layout()
plt.savefig(os.path.join(CHARTS_DIR, "09_icu_utilisation_trend.png"), dpi=150, bbox_inches="tight")
plt.close()
print("[✓] 09_icu_utilisation_trend.png")

# ─────────────────────────────────────────────────────────────────────────────
# Summary Stats JSON (for KPI cards in the dashboard)
# ─────────────────────────────────────────────────────────────────────────────
import json

stats = {
    "total_admissions":   int(df["daily_admissions"].sum()),
    "total_records":      len(df),
    "avg_daily_admissions": round(float(df["daily_admissions"].mean()), 1),
    "avg_icu_occupied":   round(float(df["icu_beds_occupied"].mean()), 1),
    "total_covid_cases":  int(df["covid_cases"].sum()),
    "total_flu_cases":    int(df["flu_cases"].sum()),
    "total_respiratory":  int(df["respiratory_cases"].sum()),
    "avg_aqi":            round(float(df["air_quality_index"].mean()), 1),
    "peak_admissions_day": str(df.loc[df["daily_admissions"].idxmax(), "date"].date()),
    "peak_admissions_val": int(df["daily_admissions"].max()),
    "date_start":         str(df["date"].min().date()),
    "date_end":           str(df["date"].max().date()),
    "hospitals":          5,
}

stats_path = os.path.join(BASE_DIR, "charts", "stats.json")
with open(stats_path, "w") as f:
    json.dump(stats, f, indent=2)

print(f"[✓] stats.json — key metrics saved")
print("\n=== KPI Summary ===")
for k, v in stats.items():
    print(f"  {k:35s}: {v}")
print(f"\n[ALL DONE] {len(os.listdir(CHARTS_DIR))} files in '{CHARTS_DIR}'")
