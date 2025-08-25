import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

const Navbar = () => {
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const cityTrimmed = city.trim();
    if (cityTrimmed) {
      // Naviga verso la pagina meteo della città cercata
      navigate(`/meteo/${encodeURIComponent(cityTrimmed)}`);
      setCity("");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-2">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          YouMeteo
        </Link>
        <form className="d-flex" onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control me-2"
            placeholder="Cerca una città"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-label="Cerca una città"
          />
          <button
            type="submit"
            className="btn btn-outline-light"
            disabled={!city.trim()}
          >
            Cerca
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
