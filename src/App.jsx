import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import TestPage from "./components/weather/card";

function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <h1 class="text-3xl font-bold underline">Weather Wizard</h1>
      <div>
        <h2>Select your destination</h2>
      </div>
      <div className="flex w-full bg-amber-600">
        <div class="card bg-base-300 rounded-box grid h-20 grow place-items-center">
          content
        </div>
        <div class="divider divider-horizontal">OR</div>
        <div class="card bg-base-300 rounded-box grid h-20 grow place-items-center">
          content
        </div>
      </div>
    </>
  );
}

export default App;
