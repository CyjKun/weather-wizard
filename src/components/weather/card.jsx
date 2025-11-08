import "tailwindcss";

function TestPage(){
    return(
        <>
            <h1>TestMeBaby</h1>
        </>
    )
}


export default function WeatherCard({ city = "Unknown city", entries = [] }) {
  // entries: [{ time: "08:00 AM", precip: 69, weather: "rain" }, ...]
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
        {rows.map((r, i) => (
          <div
            key={i}
            className="grid grid-cols-3 items-center gap-2 text-sm bg-white/20 p-2 rounded"
          >
            <div className="text-left">{r.time}</div>
            <div className="text-left">{r.precip ?? "-"}%</div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 flex items-center justify-center">
                <WeatherIcon type={r.weather} />
              </div>
              <div className="capitalize">{r.weather}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}