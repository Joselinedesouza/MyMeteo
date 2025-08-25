import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../App.css";

// immagini per lo sfondo dinamico
import cloud from "../assets/cloud.jpg";
import rain from "../assets/rain.jpg";
import snow from "../assets/snow.jpg";
import sunny from "../assets/sunny.jpg";

const apiKey = "eb293465a8757a7806a5455596a3e064";

// mappa icona -> immagine
const getWeatherBgByIcon = (icon) => {
  if (!icon) return cloud;
  const group = icon.slice(0, 2); // "01","02","03","04","09","10","11","13","50"
  switch (group) {
    case "01":
      return sunny; // sereno
    case "02":
    case "03":
    case "04":
      return cloud; // nuvole
    case "09":
    case "10":
    case "11":
      return rain; // pioggia/temporale
    case "13":
      return snow; // neve
    default:
      return cloud;
  }
};

const Meteo = () => {
  const { city } = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Carica dati meteo per la città
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            city || ""
          )}&appid=${apiKey}&units=metric&lang=it`
        );
        if (!res.ok) throw new Error("Errore nel recupero dati");
        const data = await res.json();
        setWeatherData(data);
      } catch (err) {
        setError(err?.message || "Si è verificato un errore");
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [city]);

  // sfondo dinamico in base all'icona
  const bgImage = getWeatherBgByIcon(weatherData?.weather?.[0]?.icon);

  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        paddingTop: "5rem",
        color: "white",
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* overlay per leggibilità */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35))",
        }}
      />

      <div
        className="container  bg-opacity-50 rounded p-4"
        style={{ position: "relative" }}
      >
        <h1 className="mb-4">{`Meteo a ${city}`}</h1>

        {/* Loader */}
        {loading && (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-light" role="status" />
          </div>
        )}

        {/* Errore */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Dati meteo */}
        {weatherData && !loading && !error && (
          <div
            className="card mx-auto shadow-lg"
            style={{
              width: "20rem",
              borderRadius: "15px",
              border: "1px solid white",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
            }}
          >
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              className="card-img-top"
              alt={weatherData.weather[0].description}
              style={{
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
                maxHeight: "200px",
                objectFit: "cover",
              }}
            />
            <div className="card-body text-white">
              <h5
                className="card-title"
                style={{ fontSize: "2rem", fontWeight: "bold" }}
              >
                {Math.round(weatherData.main.temp)}°C
              </h5>
              <p className="card-text text-capitalize">
                <strong>Condizione:</strong>{" "}
                {weatherData.weather[0].description}
              </p>
              <p>
                <strong>Umidità:</strong> {weatherData.main.humidity}%
              </p>
              <p>
                <strong>Vento:</strong> {weatherData.wind.speed} m/s
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meteo;
