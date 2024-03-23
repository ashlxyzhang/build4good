import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Vinyls from "./components/Vinyls";
import Navbar from "./components/Navbar";
import Home from "./components/Home";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/vinyls" element={<Vinyls />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
