import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Meteo from "./components/Meteo";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";
const App = () => {
  return (
    <div className="d-flex flex-column ">
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Homepage />} />

          <Route path="/meteo/:city" element={<Meteo />} />
        </Routes>
      </div>
      <Footer className="bg-dark text-white text-center py-3 mt-auto" />
    </div>
  );
};

export default App;
