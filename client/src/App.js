import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [state, setState] = useState([]);
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const result = await await axios.get("/api/userlist");
        setState(result);
      } catch (err) {
        console.log(err, "error");
      }
    };
    fetchResult();
  }, [setState]);
  console.log(state, "state");
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
