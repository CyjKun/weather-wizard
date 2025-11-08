// ...existing code...
import { useState } from "react";
import "./App.css";
import WeatherCard from "./components/weather/card";

function App() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sampleResults = [
    {
      city: "San Francisco",
      entries: [
        { time: "08:00 AM", precip: 5, weather: "sun" },
        { time: "12:00 PM", precip: 20, weather: "cloud" },
        { time: "04:00 PM", precip: 80, weather: "rain" },
      ],
    },
    {
      city: "Seattle",
      entries: [
        { time: "07:00 AM", precip: 85, weather: "rain" },
        { time: "01:00 PM", precip: 60, weather: "cloud" },
        { time: "06:00 PM", precip: 30, weather: "cloud" },
      ],
    },
  ];

  async function handleGo() {
    setError(null);
    if (!from.trim() || !to.trim()) {
      setError("Both From and To are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  function resetAll() {
    setFrom("");
    setTo("");
    setResults([]);
    setLoading(false);
    setError(null);
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold underline mb-4 text-white">Weather Wizard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-medium text-white">Select your route</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-white">From</label>
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="input input-bordered w-full text-black"
            placeholder="City, address or coordinates"
            type="text"
            inputMode="text"
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block text-sm text-white">To</label>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="input input-bordered w-full text-black"
            placeholder="City, address or coordinates"
            type="text"
            inputMode="text"
            autoComplete="off"
          />
        </div>

        <div className="md:col-span-2 flex justify-center mt-2">
          <div className="flex gap-3 items-center">
            <button
              onClick={resetAll}
              className="btn btn-ghost btn-square text-black"
              title="Reset"
              aria-label="Reset"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 11a8 8 0 10-4.3 6.9" />
                <path d="M20 5v6h-6" />
              </svg>
            Reset
            </button>

            <button
              onClick={handleGo}
              className={`btn btn-primary text-black ${loading ? "loading" : ""}`}
              disabled={loading}
              type="button"
            >
              {loading ? "Working..." : "Go"}
            </button>

            <button
              onClick={() => {
                setError(null); 
                setResults([...sampleResults]);
              }}
              className="btn btn-secondary text-black"
              type="button"
            >
              Show sample
            </button>
          </div>
        </div>
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.length === 0 && !loading ? (
          <div className="col-span-full text-sm text-gray-500">
            No results yet. Enter From and To, then click Go or "Show sample".
          </div>
        ) : (
          results.map((item, idx) => {
            const city = item.city || `Result ${idx + 1}`;
            const entries = Array.isArray(item.entries)
              ? item.entries
              : Array.isArray(item.data)
              ? item.data
              : Array.isArray(item)
              ? item
              : [{ time: item.time || "-", precip: item.prec ?? item.precipitation ?? "-", weather: item.weather || "cloud" }];

            return <WeatherCard key={idx} city={city} entries={entries} />;
          })
        )}
      </div>
    </div>
  );
}

export default App;