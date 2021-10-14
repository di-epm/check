import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const [data, setData] = useState(null)

  async function load() {
    try {
      setData(await fetch('http://localhost:5000/WeatherForecast').then(resp => resp.json()))
    } catch (e) {
      setData(e)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={load}>Load data</button>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </header>
    </div>
  );
}

export default App;
