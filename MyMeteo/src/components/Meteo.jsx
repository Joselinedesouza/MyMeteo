import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../App.css";

const apiKey = "eb293465a8757a7806a5455596a3e064";

const Meteo = () => {
  const { city } = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");

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

  useEffect(() => {
    const cityLower = city.toLowerCase();
    console.log(`Trying to load image for: /images/cities/${cityLower}.jpg`);
    const img = new Image();
    img.onload = () => setBackgroundImage(`/images/cities/${cityLower}.jpg`);
    img.onerror = () => setBackgroundImage("/images/default.jpg");
    img.src = `/images/cities/${cityLower}.jpg`;
  }, [city]);

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        paddingTop: "5rem",
        color: "white",
        textAlign: "center",
      }}
    >
      <div className="container">
        <h1 className="mb-4">{`Meteo a ${city}`}</h1>

        {loading && <div className="spinner-border text-black" role="status" />}
        {error && <p className="text-danger">{error}</p>}

        {weatherData && (
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
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              className="card-img-top"
              alt={weatherData.weather[0].description}
              style={{
                borderTopLeftRadius: "15px",
                borderTopRightRadius: "15px",
                maxHeight: "200px",
                objectFit: "cover",
              }}
            />
            <div className="card-body text-black">
              <h5
                className="card-title"
                style={{ fontSize: "2rem", fontWeight: "bold" }}
              >
                {Math.round(weatherData.main.temp - 273.15)}°C
              </h5>
              <p className="card-text ">
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
