import { useState } from "react";
import "./App.css";

function App() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [results, setResults] = useState([]); // expected array from backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold underline mb-4 text-white">Weather Wizard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-medium text-white">Select your route</h2>
      </div>

      <div className="flex gap-4 items-end mb-6 ">
        <div className="flex-1">
          <label className="block text-sm text-white">From</label>
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="input input-bordered w-full text-black"
            placeholder="City, address or coordinates"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm text-white ">To</label>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="input input-bordered w-full text-black"
            placeholder="City, address or coordinates"
          />
        </div>

        <div>
          <button
            onClick={handleGo}
            className={`btn btn-primary text-black  ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Working..." : "Go"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.length === 0 && !loading ? (
          <div className="col-span-full text-sm text-gray-500">No results yet. Enter From and To, then click Go.</div>
        ) : (
          results.map((item, idx) => (
            <div key={idx} className="card bg-base-200 p-4 rounded shadow">
              <h3 className="font-semibold">Result {idx + 1}</h3>
              <pre className="text-sm mt-2 whitespace-pre-wrap">{typeof item === "string" ? item : JSON.stringify(item, null, 2)}</pre>
            </div>
          ))
        )}
      </div>



      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.length === 0 && !loading ? (
          <div className="col-span-full text-sm text-gray-500">Still thinking where to go?</div>
        ) : (
          results.map((item, idx) => {
            const city = item.city || `Result ${idx + 1}`;
            const entries = Array.isArray(item.entries)
              ? item.entries
              : Array.isArray(item.data)
              ? item.data
              : Array.isArray(item) // if the result itself is an array
              ? item
              : 
                [{ time: item.time || "-", precip: item.precip ?? "-", weather: item.weather || "cloud" }];

            return <WeatherCard key={idx} city={city} entries={entries} />;
          })
        )}
      </div>
    </div>
  );
}

export default App;