import React, { useState, useEffect } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { AlertTriangle, Bed, Activity, Thermometer, ShieldAlert, Calendar } from 'lucide-react';

export default function App() {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(14); // default 14 days + 7 days prediction

  useEffect(() => {
    fetch('http://localhost:8000/api/forecast')
      .then(res => res.json())
      .then(json => {
        setRawData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Backend not running", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <Activity className="w-12 h-12 text-blue-500 animate-pulse" />
          <div className="text-xl font-light tracking-wider">INITIALIZING DATA ENGINE...</div>
        </div>
      </div>
    );
  }

  if (rawData.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950 text-gray-500">
        Run the Python Data Engine first!
      </div>
    );
  }

  // Derive the 'data' array based on rawData and timeRange directly during render
  const history = rawData.filter(d => !d.is_prediction);
  const predictions = rawData.filter(d => d.is_prediction);
  const filteredHistory = history.slice(-timeRange);
  const data = [...filteredHistory, ...predictions];

  const today = rawData.find(d => !d.is_prediction) || rawData[rawData.length - 1];
  const future = data[data.length - 1]; 

  // Safely check warning status to prevent undefined errors
  const bedWarning = future ? future.icu_occupancy > 30 : false;
  const oxygenWarning = future ? future.oxygen_usage > 1200 : false;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const isPred = payload[0].payload.is_prediction;
      return (
        <div className={`p-4 rounded-xl backdrop-blur-md border ${isPred ? 'bg-red-950/90 border-red-500/50' : 'bg-gray-900/90 border-gray-700'} text-white shadow-2xl`}>
          <p className="font-bold mb-2 border-b border-gray-600 pb-1">{label} {isPred && <span className="text-red-400 text-xs ml-2 uppercase tracking-wider">Predicted</span>}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold text-lg">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8 font-sans text-gray-100 selection:bg-blue-500/30">
      
      {/* HEADER */}
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-4 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
            Data Science Matrix Active
          </div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-gray-100 to-gray-500 bg-clip-text text-transparent flex items-center gap-3">
            Resource Forecast Matrix
          </h1>
          <p className="text-gray-400 mt-2 text-lg font-light">Interactive data science analysis derived from historical metrics.</p>
        </div>
        
        {/* TIME FILTERS */}
        <div className="flex bg-gray-900 p-1 rounded-xl border border-gray-800 shadow-inner">
          {[7, 14, 30].map(days => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${timeRange === days ? 'bg-blue-600/20 border border-blue-500/50 text-blue-400 backdrop-blur-md shadow-lg shadow-blue-500/10' : 'text-gray-500 border border-transparent hover:text-gray-300 hover:bg-gray-800/50'}`}
            >
              <Calendar className="w-4 h-4" />
              {days} Days
            </button>
          ))}
        </div>
      </header>

      {/* ALERT BANNER */}
      {(bedWarning || oxygenWarning) && (
        <div className="mb-8 p-5 bg-gradient-to-r from-red-950 to-gray-900 border border-red-900/50 rounded-2xl flex items-start gap-4 shadow-[0_0_30px_rgba(239,68,68,0.1)] backdrop-blur-xl">
          <div className="p-3 bg-red-500/20 rounded-full border border-red-500/30">
            <AlertTriangle className="text-red-400 w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-red-400 text-lg tracking-wide uppercase">Critical Threshold Alert Expected</h3>
            <p className="text-red-200/70 mt-1 font-light">
              Machine learning models anticipate
              {bedWarning && " an incoming shortage of ICU capacity "}
              {bedWarning && oxygenWarning && " and "}
              {oxygenWarning && " severe depletion of oxygen reserves "}
              within the predictive window. Action required.
            </p>
          </div>
        </div>
      )}

      {/* DASHBOARD GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        
        {/* ICU BED CHART CARD */}
        <div className="bg-gray-900/40 backdrop-blur-md p-6 rounded-3xl border border-gray-800/80 relative group transition-all duration-500 hover:bg-gray-900/80 hover:border-gray-700">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800/50">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-100">
                <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl shadow-[0_0_10px_rgba(59,130,246,0.1)]"><Bed className="text-blue-400 w-5 h-5" /></div>
                ICU Occupancy Analysis
              </h2>
              <div className="text-right">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">{today.icu_occupancy}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Current ICU</div>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" opacity={0.5} />
                  <XAxis dataKey="date" tick={{fill: '#6b7280', fontSize: 11}} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{fill: '#6b7280', fontSize: 11}} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#1f2937', opacity: 0.3}} />
                  <ReferenceLine x={data.find(d => d.is_prediction)?.date} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={2} label={{ position: 'top', value: 'AI FORECAST ->', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                  <Bar dataKey="icu_occupancy" name="ICU Beds" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.is_prediction ? '#ef4444' : '#3b82f6'} fillOpacity={entry.is_prediction ? 0.8 : 1} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* OXYGEN CHART CARD */}
        <div className="bg-gray-900/40 backdrop-blur-md p-6 rounded-3xl border border-gray-800/80 relative group transition-all duration-500 hover:bg-gray-900/80 hover:border-gray-700">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800/50">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-100">
                <div className="p-2 bg-teal-500/10 border border-teal-500/20 rounded-xl shadow-[0_0_10px_rgba(20,184,166,0.1)]"><Thermometer className="text-teal-400 w-5 h-5" /></div>
                Oxygen Depletion
              </h2>
              <div className="text-right">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">{today.oxygen_usage}L</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Current Usage</div>
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" opacity={0.5} />
                  <XAxis dataKey="date" tick={{fill: '#6b7280', fontSize: 11}} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{fill: '#6b7280', fontSize: 11}} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#1f2937', opacity: 0.3}} />
                  <ReferenceLine x={data.find(d => d.is_prediction)?.date} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={2} label={{ position: 'top', value: 'AI FORECAST ->', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                  <Bar dataKey="oxygen_usage" name="Oxygen (Liters)" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.is_prediction ? '#f59e0b' : '#14b8a6'} fillOpacity={entry.is_prediction ? 0.8 : 1} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
