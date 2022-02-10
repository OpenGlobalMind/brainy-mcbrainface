import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import About from "./pages/About"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
    {/* <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} >
      <Route path="about" element={<About />} />
      <Route path="brainish" element={<Brainish />} />

      </Route>
    </Routes>
    </BrowserRouter> */}
  </React.StrictMode>,
  document.getElementById("root")
);
