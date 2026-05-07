import Image from "next/image";

// ── KPI Card ──────────────────────────────────────────────────────────────
interface KpiProps {
  icon: string;
  label: string;
  value: string;
  sub: string;
  accent: "cyan" | "green" | "orange" | "pink" | "purple";
  delay: string;
}
function KpiCard({ icon, label, value, sub, accent, delay }: KpiProps) {
  return (
    <div className={`card kpi-card ${accent} fade-up ${delay}`}>
      <div className="kpi-icon">{icon}</div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-sub">{sub}</div>
    </div>
  );
}

// ── Chart + Analysis wrapper ───────────────────────────────────────────────
interface ChartBlockProps {
  title: string;
  desc: string;
  badgeLabel: string;
  badgeAccent: "cyan" | "green" | "orange" | "purple" | "pink";
  imgSrc: string;
  imgAlt: string;
  analysis: React.ReactNode;
  delay?: string;
  fullWidth?: boolean;
}
function ChartBlock({
  title, desc, badgeLabel, badgeAccent,
  imgSrc, imgAlt, analysis,
  delay = "", fullWidth = false,
}: ChartBlockProps) {
  return (
    <div className={`card chart-card fade-up ${delay} ${fullWidth ? "chart-grid-full" : ""}`}>
      {/* Header */}
      <div className="chart-card-header">
        <div>
          <div className="chart-title">{title}</div>
          <div className="chart-desc">{desc}</div>
        </div>
        <span className={`chart-badge ${badgeAccent}`}>{badgeLabel}</span>
      </div>

      {/* Chart Image */}
      <Image
        src={imgSrc}
        alt={imgAlt}
        width={1200}
        height={500}
        className="chart-img"
        priority={fullWidth}
      />

      {/* Analysis */}
      <div className="analysis-block">
        {analysis}
      </div>
    </div>
  );
}

// ── Insight Card ──────────────────────────────────────────────────────────
interface InsightProps {
  icon: string;
  title: string;
  value: string;
  desc: string;
  accent: "cyan" | "green" | "orange" | "pink" | "purple";
  delay: string;
}
function InsightCard({ icon, title, value, desc, accent, delay }: InsightProps) {
  const colorMap: Record<string, string> = {
    cyan: "var(--cyan)", green: "var(--green)",
    orange: "var(--orange)", pink: "var(--pink)", purple: "var(--purple)",
  };
  return (
    <div className={`card insight-card fade-up ${delay}`}>
      <div className="insight-icon">{icon}</div>
      <div className="insight-title">{title}</div>
      <div className="insight-value" style={{ color: colorMap[accent] }}>
        {value}
      </div>
      <div className="insight-desc">{desc}</div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main>

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-badge fade-up fade-up-1">
            <span className="dot" />
            Live Analytics · India Healthcare Network
          </div>
          <h1 className="hero-title fade-up fade-up-2">MediPulse Analytics</h1>
          <p className="hero-subtitle fade-up fade-up-3">
            Comprehensive hospital resource intelligence across 5 facilities —
            tracking admissions, ICU capacity, disease outbreaks, and environmental
            factors from <span className="accent">Jan 2025</span> to{" "}
            <span className="accent-green">May 2026</span>.
          </p>
          <div className="hero-pills fade-up fade-up-4">
            {[
              { icon: "🏥", label: "Hospitals", value: "5" },
              { icon: "📋", label: "Daily Records", value: "499" },
              { icon: "📅", label: "Date Range", value: "Jan 2025 – May 2026" },
              { icon: "📍", label: "Coverage", value: "Rural & Urban India" },
            ].map(({ icon, label, value }) => (
              <div className="pill" key={label}>
                <span className="icon">{icon}</span>
                <span>{label}:</span>
                <span className="pill-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ══ KPI METRICS ═══════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <h2 className="section-title fade-up fade-up-1">
            Key Performance <span className="accent">Indicators</span>
          </h2>
          <p className="section-subtitle fade-up fade-up-2">
            Aggregated metrics across all 5 hospitals for the full analysis period
          </p>
          <div className="kpi-grid">
            <KpiCard icon="🏨" label="Total Admissions"      value="20,223" sub="Avg 40.5 patients / day"       accent="cyan"   delay="fade-up-3" />
            <KpiCard icon="🛏️" label="Avg ICU Beds Occupied" value="14.7"   sub="Per hospital per day"           accent="orange" delay="fade-up-4" />
            <KpiCard icon="🦠" label="Total COVID Cases"      value="3,349"  sub="Across all hospitals"           accent="pink"   delay="fade-up-5" />
            <KpiCard icon="💨" label="Avg Air Quality Index"  value="126.5"  sub="AQI units — moderate range"    accent="purple" delay="fade-up-6" />
            <KpiCard icon="🤧" label="Total Flu Cases"        value="7,335"  sub="Highest disease burden"        accent="green"  delay="fade-up-7" />
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ══ GRAPH 1 — Monthly Admissions Trend ════════════════════════════ */}
      <section className="section">
        <div className="container">
          <h2 className="section-title fade-up fade-up-1">
            Graph 1 — Monthly Admissions <span className="accent">Trend</span>
          </h2>
          <p className="section-subtitle fade-up fade-up-2">
            Total hospital admissions aggregated by month across all 5 facilities
          </p>

          <ChartBlock
            title="Monthly Total Hospital Admissions — Jan 2025 to May 2026"
            desc="Line chart with area fill showing cumulative admission volumes per month"
            badgeLabel="Time Series" badgeAccent="cyan"
            imgSrc="/charts/01_monthly_admissions_trend.png"
            imgAlt="Monthly admissions trend line chart"
            delay="fade-up-3" fullWidth
            analysis={
              <>
                <p>
                  This line chart tracks the <strong>total number of hospital admissions per month</strong> across
                  all 5 hospitals from January 2025 to May 2026. The shaded area below the line helps visualise
                  cumulative volume at a glance.
                </p>
                <p>
                  The most striking observation is how <strong>consistently stable admissions remain</strong> — 
                  almost all months fall within a tight band of <strong>1,150 to 1,310 admissions</strong>, 
                  indicating a highly predictable baseline patient inflow with minimal seasonal disruption.
                </p>
                <p>
                  A <strong>peak of ~1,310 occurs in March 2025</strong>, coinciding with the end of India&apos;s 
                  winter season when respiratory and flu cases typically rise. A mild dip is visible in 
                  <strong> August 2025 (~1,150)</strong>, which aligns with the monsoon season — reduced 
                  outdoor exposure may slightly dampen viral transmission. From October 2025 onward, 
                  admissions stabilise again at around <strong>1,250/month</strong>.
                </p>
                <p>
                  The <strong>sharp drop in May 2026 to ~600</strong> is not a real healthcare trend — 
                  it is a <strong>data truncation artefact</strong>, as the dataset only covers up to 
                  14 days of May 2026. Projecting at this rate, the full month would reach ~1,240, 
                  consistent with prior months.
                </p>
                <div className="analysis-highlight">
                  <span className="analysis-tag info">Peak: Mar 2025 (~1,310)</span>
                  <span className="analysis-tag warn">Dip: Aug 2025 (~1,150) — monsoon effect</span>
                  <span className="analysis-tag good">Stable baseline: ~1,200/month</span>
                  <span className="analysis-tag note">May 2026 drop = truncated data, not real decline</span>
                </div>
              </>
            }
          />
        </div>
      </section>

      <div className="divider" />

      {/* ══ GRAPH 2 — Hospital Type Comparison ═══════════════════════════ */}
      <section className="section">
        <div className="container">
          <h2 className="section-title fade-up fade-up-1">
            Graph 2 — Hospital Type <span className="accent">Comparison</span>
          </h2>
          <p className="section-subtitle fade-up fade-up-2">
            Average beds occupied by hospital size and geographic setting
          </p>

          <ChartBlock
            title="Avg Beds Occupied: Hospital Type × Location"
            desc="Grouped bar chart comparing small vs medium hospitals across rural and urban settings"
            badgeLabel="Bar Chart" badgeAccent="green"
            imgSrc="/charts/02_hospital_type_comparison.png"
            imgAlt="Hospital type location comparison bar chart"
            delay="fade-up-3" fullWidth
            analysis={
              <>
                <p>
                  This grouped bar chart compares the <strong>average number of beds occupied per day</strong>,
                  broken into four categories: Small Rural, Medium Rural, Small Urban, and Medium Urban hospitals.
                  It allows us to assess whether hospital size or geographic location significantly affects bed utilisation.
                </p>
                <p>
                  The most striking finding is that <strong>all four bars are nearly equal (~78–82 beds)</strong>.
                  Despite differences in infrastructure, designation, and population served, the average bed occupancy
                  is virtually identical across groups. This challenges the common assumption that larger or urban
                  hospitals always carry heavier patient loads.
                </p>
                <p>
                  <strong>Small rural hospitals (~81 beds)</strong> actually show slightly higher occupancy than small
                  urban ones (~78), suggesting small rural facilities may be <strong>operating closer to their
                  maximum capacity</strong> — a potential resource strain concern.
                  <strong> Medium urban hospitals (~82)</strong> record the highest average, consistent with denser
                  urban populations generating slightly more footfall.
                </p>
                <p>
                  The absence of a significant gap between small and medium hospitals raises a 
                  <strong> network-wide saturation concern</strong>: if demand increases even marginally, 
                  small rural facilities would be the first to face shortages, as they have less buffer capacity.
                </p>
                <div className="analysis-highlight">
                  <span className="analysis-tag warn">Small Rural: ~81 beds — highest occupancy relative to size</span>
                  <span className="analysis-tag info">Medium Urban: ~82 beds — expected given population density</span>
                  <span className="analysis-tag danger">Gap between types is only ~3 beds — very little buffer</span>
                  <span className="analysis-tag good">Consistent occupancy → demand is evenly distributed</span>
                </div>
              </>
            }
          />
        </div>
      </section>

      <div className="divider" />

      {/* ══ GRAPH 3 — Case Type Distribution ═════════════════════════════ */}
      <section className="section">
        <div className="container">
          <h2 className="section-title fade-up fade-up-1">
            Graph 3 — Case Type <span className="accent">Distribution</span>
          </h2>
          <p className="section-subtitle fade-up fade-up-2">
            Monthly stacked view of flu, COVID-19, and respiratory case volumes
          </p>

          <ChartBlock
            title="Monthly Case Distribution: Flu · COVID · Respiratory"
            desc="Stacked area chart showing monthly totals for each disease category"
            badgeLabel="Stacked Area" badgeAccent="orange"
            imgSrc="/charts/03_case_type_distribution.png"
            imgAlt="Case type distribution stacked area chart"
            delay="fade-up-3" fullWidth
            analysis={
              <>
                <p>
                  This stacked area chart shows the <strong>monthly total case load split across three 
                  disease categories</strong>: Flu (orange, bottom), COVID-19 (pink, middle), and 
                  Respiratory conditions (purple, top). The height of the full stack represents total 
                  disease burden in that month.
                </p>
                <p>
                  <strong>Respiratory cases dominate</strong> the stack throughout the entire period, 
                  accounting for approximately <strong>45% of all cases (8,806 total)</strong>. 
                  Flu comes second at 38% (7,335), while COVID-19 contributes only 17% (3,349) — 
                  a clear indicator that COVID has become an <strong>endemic, managed disease</strong> 
                  rather than the dominant concern it once was.
                </p>
                <p>
                  The <strong>peaks in March 2025 and January 2026</strong> are visible across all three 
                  layers simultaneously, confirming that <strong>winter drives the overall disease burden</strong> 
                  across all categories. The August–September 2025 period shows a widening of the respiratory 
                  layer — likely driven by monsoon-related air quality deterioration worsening lung conditions.
                </p>
                <p>
                  The narrow <strong>COVID-19 band remains fairly flat</strong> at ~150–230 cases/month, 
                  showing that COVID no longer produces the dramatic spikes it once did and has stabilised 
                  as a background condition across this hospital network.
                </p>
                <div className="analysis-highlight">
                  <span className="analysis-tag danger">Respiratory: 45% of total burden — #1 concern</span>
                  <span className="analysis-tag warn">Flu: 38% — strong winter seasonality</span>
                  <span className="analysis-tag good">COVID: 17% only — now endemic and stable</span>
                  <span className="analysis-tag info">Jan 2026: highest stacked total — worst month overall</span>
                </div>
              </>
            }
          />
        </div>
      </section>

      <div className="divider" />

      {/* ══ GRAPH 4 — Correlation Heatmap ════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <h2 className="section-title fade-up fade-up-1">
            Graph 4 — Feature <span className="accent">Correlation Heatmap</span>
          </h2>
          <p className="section-subtitle fade-up fade-up-2">
            Pearson correlation coefficients across 13 numeric variables
          </p>

          <ChartBlock
            title="Feature Correlation Heatmap"
            desc="Lower-triangle heatmap showing pairwise Pearson r values between all numeric features"
            badgeLabel="Heatmap" badgeAccent="purple"
            imgSrc="/charts/04_correlation_heatmap.png"
            imgAlt="Feature correlation heatmap"
            delay="fade-up-3" fullWidth
            analysis={
              <>
                <p>
                  This lower-triangle heatmap shows the <strong>Pearson correlation coefficient (r)</strong> 
                  between every pair of 13 numeric variables in the dataset. Warm colours (red/orange) 
                  indicate positive correlation, cool colours (blue) indicate negative, and white/near-white 
                  cells indicate no meaningful linear relationship.
                </p>
                <p>
                  The <strong>most important finding</strong> is that the <strong>vast majority of r values 
                  cluster near zero (±0.05)</strong> — meaning most variables have no strong linear relationship 
                  with each other. This tells us that hospital admissions are driven by a <strong>complex 
                  combination of factors</strong>, none of which individually explains the variation.
                </p>
                <p>
                  The <strong>single strongest correlation is ICU beds occupied ↔ Oxygen units used (r = +0.14)</strong>. 
                  This makes clinical sense — critically ill ICU patients require significantly more oxygen 
                  than general ward patients. This is an actionable finding: <strong>oxygen procurement 
                  should be directly tied to ICU occupancy</strong>, not general admissions.
                </p>
                <p>
                  <strong>Daily admissions are essentially uncorrelated with temperature (r = 0.05), 
                  rainfall (r = 0.03), and AQI (r = −0.01)</strong>. This confirms that same-day 
                  environmental conditions do not predict admission volumes — a <strong>lagged or 
                  non-linear model</strong> would be needed for accurate environmental impact analysis.
                  The independence of disease types from each other (all near 0) also suggests 
                  co-infection effects are minimal at the aggregate hospital level.
                </p>
                <div className="analysis-highlight">
                  <span className="analysis-tag info">Strongest link: ICU ↔ Oxygen (r = +0.14)</span>
                  <span className="analysis-tag good">Most r values ≈ 0 → no dominant linear predictor</span>
                  <span className="analysis-tag note">Weather variables (temp, rain, AQI) → negligible correlation with admissions</span>
                  <span className="analysis-tag warn">Implication: use ML (non-linear) models for forecasting</span>
                </div>
              </>
            }
          />
        </div>
      </section>

      <div className="divider" />

      {/* ══ GRAPH 5 & 6 — Distribution + Boxplot ═════════════════════════ */}
      <section className="section">
        <div className="container">
          <h2 className="section-title fade-up fade-up-1">
            Graphs 5 & 6 — <span className="accent-green">Distributions</span>
          </h2>
          <p className="section-subtitle fade-up fade-up-2">
            Statistical shape of daily admissions and COVID case spread by hospital group
          </p>

          <div className="chart-grid-2">
            {/* Graph 5 */}
            <ChartBlock
              title="Graph 5 — Daily Admissions Distribution"
              desc="Histogram with KDE overlay showing the statistical spread of admission counts"
              badgeLabel="Distribution" badgeAccent="cyan"
              imgSrc="/charts/05_admissions_distribution.png"
              imgAlt="Daily admissions histogram with KDE"
              delay="fade-up-3"
              analysis={
                <>
                  <p>
                    This chart combines a <strong>histogram</strong> (cyan bars, left axis — frequency) and 
                    a <strong>Kernel Density Estimate — KDE</strong> (green curve, right axis — density) 
                    to show the statistical distribution of daily admissions across all records.
                  </p>
                  <p>
                    The distribution is <strong>bimodal</strong> — two distinct humps are visible. The 
                    <strong> primary peak sits at ~40–42 admissions/day</strong>, representing the typical 
                    operational mode. A <strong>secondary shoulder at ~52–55</strong> represents a cluster 
                    of high-demand days, likely triggered by seasonal disease surges.
                  </p>
                  <p>
                    The distribution has a <strong>slight right skew</strong> with a hard floor near 20 
                    (hospitals never fully idle) and a ceiling at 59 (the single peak day). The bimodal 
                    shape implies hospitals operate in <strong>two distinct modes</strong> — normal (~40) 
                    and surge (~52+) — which should each have separate staffing plans.
                  </p>
                  <div className="analysis-highlight">
                    <span className="analysis-tag info">Mode: ~41 admissions/day</span>
                    <span className="analysis-tag warn">Surge cluster: 52–55/day</span>
                    <span className="analysis-tag good">Floor: ~20 (never truly idle)</span>
                    <span className="analysis-tag note">Bimodal → plan two staffing levels</span>
                  </div>
                </>
              }
            />

            {/* Graph 6 */}
            <ChartBlock
              title="Graph 6 — COVID Cases by Hospital Type"
              desc="Box-and-whisker plots comparing COVID case distributions across all hospital groups"
              badgeLabel="Boxplot" badgeAccent="pink"
              imgSrc="/charts/06_covid_boxplot.png"
              imgAlt="COVID cases boxplot by hospital type and location"
              delay="fade-up-4"
              analysis={
                <>
                  <p>
                    This boxplot compares <strong>daily COVID case distributions</strong> across four groups: 
                    Small Rural (green), Small Urban (pink), Medium Rural (green), and Medium Urban (pink). 
                    Each box shows the interquartile range (IQR), the <strong>gold line marks the median</strong>, 
                    and whiskers extend to min/max values.
                  </p>
                  <p>
                    The most important observation is that <strong>all four groups share near-identical 
                    medians of 6–7 COVID cases/day</strong> and the same whisker ceiling of 14. 
                    COVID burden is <strong>uniformly distributed</strong> regardless of hospital size 
                    or location — no single group carries a disproportionate load.
                  </p>
                  <p>
                    <strong>Medium rural</strong> shows a slightly wider IQR (2–9) compared to others, 
                    indicating greater day-to-day variability — possibly reflecting inconsistent referral 
                    patterns or occasional case clustering. All boxes touch 0 at the lower whisker, 
                    confirming COVID-free days occur in all hospital types.
                  </p>
                  <div className="analysis-highlight">
                    <span className="analysis-tag good">Medians identical across all 4 groups (~6–7/day)</span>
                    <span className="analysis-tag info">Max whisker: 14 for all groups</span>
                    <span className="analysis-tag warn">Medium rural: widest spread (IQR 2–9)</span>
                    <span className="analysis-tag note">No group needs special COVID allocation</span>
                  </div>
                </>
              }
            />
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ══ GRAPH 7 — AQI Scatter ═════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <h2 className="section-title fade-up fade-up-1">
            Graph 7 — Air Quality vs <span className="accent">Admissions</span>
          </h2>
          <p className="section-subtitle fade-up fade-up-2">
            Testing whether pollution levels drive hospital admissions on the same day
          </p>

          <ChartBlock
            title="Air Quality Index vs Daily Admissions"
            desc="Scatter plot coloured by location (Rural/Urban) with a linear trend line overlay"
            badgeLabel="Scatter Plot" badgeAccent="purple"
            imgSrc="/charts/07_aqi_vs_admissions_scatter.png"
            imgAlt="AQI vs admissions scatter plot"
            delay="fade-up-3" fullWidth
            analysis={
              <>
                <p>
                  This scatter plot places the <strong>Air Quality Index (AQI) on the X-axis</strong> and 
                  <strong> daily admissions on the Y-axis</strong>. Green dots represent rural hospital 
                  records, pink dots represent urban, and the <strong>gold dashed line shows the linear 
                  trend</strong> across all data points.
                </p>
                <p>
                  The <strong>trend line is nearly perfectly horizontal at ~40.5 admissions</strong>, 
                  confirming an <strong>extremely weak (near-zero) correlation</strong> between same-day 
                  AQI and daily admissions. Despite AQI values ranging from ~50 to 200 (moderate to 
                  very unhealthy), admissions show no systematic increase or decrease.
                </p>
                <p>
                  Both <strong>rural and urban dots are uniformly scattered</strong> across the full 
                  AQI range — neither location responds differently to air quality on the same day. 
                  High admission days (55–59) and low admission days (~20–25) appear at every AQI level.
                </p>
                <p>
                  This does <strong>not</strong> mean air quality is irrelevant — rather, it suggests 
                  that respiratory effects of poor air quality take <strong>7–14 days to manifest 
                  as hospitalisations</strong>. A lagged correlation analysis would be the appropriate 
                  next step for a more accurate conclusion.
                </p>
                <div className="analysis-highlight">
                  <span className="analysis-tag good">Trend line: flat → AQI has zero same-day predictive power</span>
                  <span className="analysis-tag note">Rural and urban behave identically w.r.t. AQI</span>
                  <span className="analysis-tag warn">Average AQI = 126.5 — &quot;Unhealthy for sensitive groups&quot;</span>
                  <span className="analysis-tag info">Recommendation: test 7–14 day lagged AQI correlations</span>
                </div>
              </>
            }
          />
        </div>
      </section>

      <div className="divider" />

      {/* ══ GRAPH 8 — Seasonal Disease Trends ════════════════════════════ */}
      <section className="section">
        <div className="container">
          <h2 className="section-title fade-up fade-up-1">
            Graph 8 — Seasonal Disease <span className="accent">Trends</span>
          </h2>
          <p className="section-subtitle fade-up fade-up-2">
            Monthly trajectory of each disease category across the full dataset period
          </p>

          <ChartBlock
            title="Seasonal Disease Trends — Monthly Totals"
            desc="Multi-line chart tracking flu, COVID-19, and respiratory cases month by month"
            badgeLabel="Multi-Line" badgeAccent="purple"
            imgSrc="/charts/08_seasonal_disease_trends.png"
            imgAlt="Seasonal disease trends multi-line chart"
            delay="fade-up-3" fullWidth
            analysis={
              <>
                <p>
                  This multi-line chart separately tracks <strong>monthly total cases for each disease 
                  category</strong>: Flu (orange), COVID-19 (pink), and Respiratory conditions (purple). 
                  Unlike the stacked chart, this view allows direct comparison of each line&apos;s 
                  trajectory and magnitude.
                </p>
                <p>
                  <strong>Respiratory cases (purple) consistently lead</strong> the highest values 
                  throughout the full period, peaking sharply at <strong>~620 in January 2026</strong> — 
                  the single highest disease event in the dataset. This January respiratory peak is 
                  driven by cold weather, low humidity, and post-holiday social mixing, all of which 
                  accelerate respiratory virus transmission.
                </p>
                <p>
                  <strong>Flu (orange) closely follows a winter cycle</strong>: high in Jan 2025 (~530), 
                  drops through summer (~400), and recovers again in late 2025 into Jan 2026 (~490). 
                  This annual pattern is highly predictable and aligns with India&apos;s known influenza 
                  seasonality. <strong>COVID-19 (pink) moves independently</strong> of seasonal weather — 
                  its movement is flatter (~150–230/month) and shows a small independent peak in 
                  September 2025 (~230), suggesting immunity-driven rather than weather-driven dynamics.
                </p>
                <p>
                  Flu and respiratory lines <strong>converge and co-move in winter</strong>, confirming 
                  shared environmental drivers. Their August divergence (flu drops, respiratory stays 
                  elevated) suggests non-flu respiratory pathogens (RSV, rhinovirus) remain active 
                  during monsoon season.
                </p>
                <div className="analysis-highlight">
                  <span className="analysis-tag danger">Jan 2026 respiratory peak (~620) — highest event in dataset</span>
                  <span className="analysis-tag warn">Flu: clear annual winter cycle — predictable</span>
                  <span className="analysis-tag good">COVID: flat endemic baseline — no longer seasonal</span>
                  <span className="analysis-tag info">Aug: flu↓ but respiratory stays up → RSV/rhinovirus likely</span>
                </div>
              </>
            }
          />
        </div>
      </section>

      <div className="divider" />

      {/* ══ GRAPH 9 — ICU Utilisation ═════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <h2 className="section-title fade-up fade-up-1">
            Graph 9 — ICU Bed <span className="accent">Utilisation</span>
          </h2>
          <p className="section-subtitle fade-up fade-up-2">
            Critical care pressure trend with monthly average against overall mean
          </p>

          <ChartBlock
            title="Average ICU Bed Utilisation — Monthly Trend"
            desc="Monthly average ICU beds occupied with an overall mean reference line at 14.8"
            badgeLabel="ICU Trend" badgeAccent="orange"
            imgSrc="/charts/09_icu_utilisation_trend.png"
            imgAlt="ICU utilisation monthly trend"
            delay="fade-up-3" fullWidth
            analysis={
              <>
                <p>
                  This line chart tracks the <strong>average number of ICU beds occupied per day</strong>, 
                  aggregated monthly. The <strong>gold dashed reference line marks the overall mean of 14.8</strong> 
                  ICU beds/day — values above it indicate months of higher-than-normal critical care pressure, 
                  and values below it indicate relatively quieter periods.
                </p>
                <p>
                  The chart oscillates in a narrow band of <strong>13.2 to 17.5 beds/day</strong>. 
                  The <strong>peak occurs in September 2025 at ~17.5</strong> — nearly 3 beds above 
                  the mean. Across 5 hospitals, this represents roughly <strong>15 additional ICU 
                  patients per hospital-day</strong> compared to the quietest month. This September 
                  spike aligns with the COVID mini-peak and elevated respiratory burden seen in 
                  Graphs 3 and 8, confirming that September is the <strong>critical care danger month</strong>.
                </p>
                <p>
                  The <strong>February–March 2026 window (13.2–13.4)</strong> is the lowest ICU 
                  pressure period — the best window for elective admissions, planned procedures, and 
                  equipment maintenance. The <strong>January 2025 start (~16.0)</strong> immediately 
                  above the mean reflects the winter respiratory burden seen across other charts.
                </p>
                <p>
                  Importantly, even at the minimum (~13.2 beds), if total ICU capacity per hospital 
                  is ~20 beds, this represents a <strong>~66% base occupancy rate</strong> — well 
                  above the 50% threshold considered safe for absorbing emergency surges. The narrow 
                  band means the system has <strong>very little buffer</strong> before critical saturation.
                </p>
                <div className="analysis-highlight">
                  <span className="analysis-tag danger">Sep 2025 peak: 17.5 avg ICU beds — danger month</span>
                  <span className="analysis-tag good">Feb–Mar 2026: 13.2–13.4 — safest window for electives</span>
                  <span className="analysis-tag warn">Base occupancy ~66%+ — nearly no surge buffer</span>
                  <span className="analysis-tag info">Mean: 14.8 ICU beds/day across all 5 hospitals</span>
                </div>
              </>
            }
          />
        </div>
      </section>

      <div className="divider" />

      {/* ══ KEY INSIGHTS ══════════════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <h2 className="section-title fade-up fade-up-1">
            Key <span className="accent">Insights</span>
          </h2>
          <p className="section-subtitle fade-up fade-up-2">
            Cross-graph findings and actionable recommendations
          </p>
          <div className="insights-grid">
            <InsightCard icon="📈" title="Peak Admission Day"       value="Feb 2, 2025"    desc="Highest recorded single-day admissions at 59 patients — consistent with a seasonal flu spike at the end of India's winter."                                         accent="cyan"   delay="fade-up-3" />
            <InsightCard icon="🫁" title="Dominant Disease Burden"  value="Respiratory"    desc="Respiratory cases (8,806) account for 45% of all disease load — consistently the #1 burden, peaking every January."                                               accent="orange" delay="fade-up-4" />
            <InsightCard icon="🏘️" title="Rural vs Urban ICU"       value="Equal Load"     desc="ICU utilisation is nearly identical across rural and urban hospitals — suggesting network-wide saturation rather than location-specific problems."                  accent="green"  delay="fade-up-5" />
            <InsightCard icon="💨" title="AQI Impact"               value="No Same-Day Link" desc="Air Quality Index shows near-zero same-day correlation with admissions. A 7–14 day lagged analysis is recommended for environmental impact studies."             accent="purple" delay="fade-up-6" />
            <InsightCard icon="🛑" title="ICU Danger Month"         value="September 2025" desc="September 2025 recorded the peak ICU utilisation at 17.5 avg beds/day — 18% above the annual mean. Pre-emptive surge protocols are recommended each August."    accent="pink"   delay="fade-up-7" />
            <InsightCard icon="📊" title="Data Quality Resolved"    value="80 Issues Fixed" desc="30 duplicate rows removed, 50 temperature format errors corrected, and 100 missing values imputed — ensuring all insights are based on clean, reliable data."  accent="cyan"   delay="fade-up-8" />
          </div>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════════════ */}
      <footer className="footer">
        <div className="container">
          <div className="footer-logo">MediPulse Analytics</div>
          <p>
            Dataset: Hospital Resource Management · 499 records · Jan 2025 – May 2026 ·
            5 hospitals across Rural &amp; Urban India
          </p>
          <p style={{ marginTop: 8 }}>
            Built with{" "}
            <span style={{ color: "var(--pink)" }}>♥</span>{" "}
            using Next.js · Python · Pandas · Matplotlib · Seaborn
          </p>
        </div>
      </footer>

    </main>
  );
}
