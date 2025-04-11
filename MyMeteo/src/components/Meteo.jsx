import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../App.css";

const apiKey = "eb293465a8757a7806a5455596a3e064";

const Meteo = () => {
  const { city } = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Errore nel recupero dati");
        return res.json();
      })
      .then((data) => {
        setWeatherData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [city]);

  return (
    <div className="container mt-5 text-center">
      <h1 className="mb-4 text-black">{`Meteo a ${city}`}</h1>

      {loading && <div className="spinner-border text-light" role="status" />}
      {error && <p className="text-danger">{error}</p>}

      {weatherData && (
        <div
          className="card mx-auto shadow-lg"
          style={{ width: "20rem", borderRadius: "10px" }}
        >
          <img
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            className="card-img-top"
            alt={weatherData.weather[0].description}
            style={{
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              maxHeight: "200px",
              objectFit: "cover",
            }}
          />
          <div
            className="card-body text-white"
            style={{
              backgroundColor: "#1c1c1c",
              borderBottomLeftRadius: "20px",
              borderBottomRightRadius: "20px",
            }}
          >
            <h5
              className="card-title"
              style={{ fontSize: "2rem", fontWeight: "bold" }}
            >
              {Math.round(weatherData.main.temp - 273.15)}°C
            </h5>
            <p className="card-text">
              <strong>Condizione:</strong> {weatherData.weather[0].description}
            </p>
            <p className="card-text">
              <strong>Umidità:</strong> {weatherData.main.humidity}%
            </p>
            <p className="card-text">
              <strong>Vento:</strong> {weatherData.wind.speed} m/s
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Meteo;
