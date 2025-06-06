import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
const Navbar = () => {
  const [city, setCity] = useState("");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-2">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          YouMeteo
        </Link>
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Cerca una città"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          {city.trim() && (
            <Link to={`/meteo/${city}`} className="btn btn-outline-light">
              Cerca
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
