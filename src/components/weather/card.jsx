import React from "react";
import "tailwindcss";

function WeatherIcon({ precip = 0, size = 20 }) {
  const p = Number(String(precip).replace("%", "")) || 0;

  if (p <= 10) {
    // sunny
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" title="Sunny">
        <circle cx="12" cy="12" r="4" fill="#FDB813" />
        <g stroke="#FDB813" strokeWidth="1.2">
          <path d="M12 1v3" />
          <path d="M12 20v3" />
          <path d="M4.2 4.2l2.1 2.1" />
          <path d="M17.7 17.7l2.1 2.1" />
          <path d="M1 12h3" />
          <path d="M20 12h3" />
          <path d="M4.2 19.8l2.1-2.1" />
          <path d="M17.7 6.3l2.1-2.1" />
        </g>
      </svg>
    );
  } else if (p <= 40) {
    // partly cloudy
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" title="Partly cloudy">
        <path d="M18 14a4 4 0 00-3.9-4A5 5 0 0010 6a5 5 0 00-4.5 7H16a4 4 0 002 1z" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="#F3F4F6"/>
        <circle cx="8" cy="6" r="2" fill="#FDE68A" />
      </svg>
    );
  } else if (p <= 69) {
    // cloudy
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" title="Cloudy">
        <path d="M20 16.58A4 4 0 0016 13H7.5A3.5 3.5 0 104.5 20H18" stroke="#6B7280" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="#E5E7EB"/>
      </svg>
    );
  } else {
    // heavy rain
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" title="Rainy">
        <path d="M20 16.58A4 4 0 0016 13H7.5A3.5 3.5 0 104.5 20H18" stroke="#3B82F6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="#DBEAFE"/>
        <g stroke="#3B82F6" strokeWidth="1.6" strokeLinecap="round">
          <path d="M8 20v2" />
          <path d="M12 20v2" />
          <path d="M16 20v2" />
        </g>
      </svg>
    );
  }
}

export default function WeatherCard({ city = "Unknown city", entries = [] }) {
  const fallback = [
    { time: "08:00 AM", precip: 69, weather: "rain" },
    { time: "12:00 PM", precip: 10, weather: "sun" },
    { time: "04:00 PM", precip: 25, weather: "cloud" },
  ];

  const rows = (Array.isArray(entries) && entries.length > 0) ? entries : fallback;

  return (
    <div className="card bg-base-200 p-4 rounded-lg shadow-sm w-full">
      <div className="mb-3">
        <h3 className="text-lg font-semibold">{city}</h3>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs font-medium text-gray-600 border-b pb-2">
        <div>Time</div>
        <div>Precipitation%</div>
        <div>Weather</div>
      </div>

      <div className="mt-2 space-y-2">
        {rows.map((r, i) => {
          const time = r.time ?? "-";
          // support both numeric and "69%" strings
          const precipRaw = r.precip ?? (r.precipitation ?? "-");
          const precipDisplay = typeof precipRaw === "number" ? `${precipRaw}%` : String(precipRaw).replace(/[^0-9]/g, "") ? `${String(precipRaw).replace(/[^0-9]/g, "")}%` : "-";
          return (
            <div
              key={i}
              className="grid grid-cols-3 items-center gap-2 text-sm bg-white/20 p-2 rounded"
            >
              <div className="text-left">{time}</div>
              <div className="text-left">{precipDisplay}</div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 flex items-center justify-center">
                  <WeatherIcon precip={precipRaw} />
                </div>
                <div className="capitalize">{r.weather ?? "-"}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}