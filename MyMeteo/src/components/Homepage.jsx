import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import meteo from "../assets/Meteogif.1.gif";
import cloud from "../assets/cloud.jpg";
import rain from "../assets/rain.jpg";
import snow from "../assets/snow.jpg";
import sunny from "../assets/sunny.jpg";

const BATCH_SIZE = 6;
const CACHE_DURATION = 10 * 60 * 1000;
const apiKey = "eb293465a8757a7806a5455596a3e064";

const cities = [
  "Roma",
  "Milano",
  "Napoli",
  "Torino",
  "Palermo",
  "Genova",
  "Bologna",
  "Firenze",
  "Bari",
  "Catania",
  "Venezia",
  "Verona",
  "Messina",
  "Padova",
  "Trieste",
  "Taranto",
  "Brescia",
  "Prato",
  "Reggio Calabria",
  "Modena",
  "Cagliari",
  "Parma",
  "Livorno",
  "Foggia",
  "Perugia",
  "Salerno",
  "Ravenna",
  "Ferrara",
  "Sassari",
];

const getWeatherBgByIcon = (icon) => {
  if (!icon) return cloud;
  const group = icon.slice(0, 2);
  switch (group) {
    case "01":
      return sunny;
    case "02":
    case "03":
    case "04":
      return cloud;
    case "09":
    case "10":
    case "11":
      return rain;
    case "13":
      return snow;
    default:
      return cloud;
  }
};

const Home = () => {
  const [weatherList, setWeatherList] = useState([]);
  const [batchIndex, setBatchIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const [myWeather, setMyWeather] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Carica batch di città con caching
  const loadBatch = async (index) => {
    setLoading(true);
    const batchCities = cities.slice(
      index * BATCH_SIZE,
      (index + 1) * BATCH_SIZE
    );
    const cacheKey = `weatherBatch_${index}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_DURATION) {
        setWeatherList((prev) => [...prev, ...parsed.data]);
        setLoading(false);
        return;
      }
    }

    try {
      const promises = batchCities.map(async (city) => {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=it`
        );
        const data = await res.json();
        if (res.ok) {
          return {
            name: city,
            temp: data.main.temp,
            description: data.weather[0].description,
            main: data.weather[0].main,
            icon: data.weather[0].icon,
          };
        } else {
          return {
            name: city,
            error: data.message || "Errore nel caricamento",
          };
        }
      });
      const results = await Promise.all(promises);
      setWeatherList((prev) => [...prev, ...results]);
      localStorage.setItem(
        cacheKey,
        JSON.stringify({ data: results, timestamp: Date.now() })
      );
    } catch (error) {
      console.error("Errore fetch batch meteo", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBatch(batchIndex);
  }, [batchIndex]);

  // Meteo posizione utente
  useEffect(() => {
    const fetchUserWeather = async (lat, lon) => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=it`
        );
        const data = await res.json();
        if (res.ok) {
          setMyWeather({
            name: data.name,
            temp: data.main.temp,
            description: data.weather[0].description,
            main: data.weather[0].main,
            icon: data.weather[0].icon,
          });
        } else {
          setLocationError(data.message || "Errore nel recupero del meteo.");
        }
      } catch {
        setLocationError("Errore nel recupero del meteo.");
      }
    };
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchUserWeather(pos.coords.latitude, pos.coords.longitude),
        () => setLocationError("Posizione non disponibile.")
      );
    } else {
      setLocationError("Geolocalizzazione non supportata dal browser.");
    }
  }, []);

  const canLoadMore = (batchIndex + 1) * BATCH_SIZE < cities.length;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${meteo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        paddingTop: "2rem",
        paddingBottom: "2rem",
      }}
    >
      <div className="container bg-dark bg-opacity-50 rounded p-3">
        <h1 className="text-center mb-4">Meteo Italia e la tua posizione</h1>

        {/* Meteo utente */}
        {myWeather && (
          <div
            className="alert text-center mb-4 rounded"
            style={{
              backgroundImage: `url(${getWeatherBgByIcon(myWeather.icon)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              overflow: "hidden",
              color: "white",
            }}
          >
            {/* overlay scuro per il testo */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(0deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35))",
              }}
            />
            <div style={{ position: "relative" }}>
              <h4 className="mb-2">{`Meteo attuale a ${myWeather.name}`}</h4>
              <img
                src={`https://openweathermap.org/img/wn/${myWeather.icon}@4x.png`}
                alt={myWeather.description}
                style={{ width: "100px", height: "100px" }}
              />
              <p style={{ fontSize: "1.5rem", textTransform: "capitalize" }}>
                {Math.round(myWeather.temp)}°C — {myWeather.description}
              </p>
            </div>
          </div>
        )}

        {locationError && (
          <div className="alert alert-warning text-center">{locationError}</div>
        )}

        {/* Lista città */}
        <div className="row">
          {weatherList.map((cityData, idx) => (
            <div className="col-md-4 mb-3" key={idx}>
              <div
                className="card text-center"
                style={{
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "white",
                  borderRadius: "10px",
                }}
              >
                <div className="card-body">
                  <h5 className="card-title">{cityData.name}</h5>
                  {cityData.error ? (
                    <p>{cityData.error}</p>
                  ) : (
                    <>
                      <img
                        src={`https://openweathermap.org/img/wn/${cityData.icon}@2x.png`}
                        alt={cityData.description}
                      />
                      <p style={{ fontSize: "1.2rem", margin: "0" }}>
                        {Math.round(cityData.temp)}°C
                      </p>
                      <p style={{ textTransform: "capitalize" }}>
                        {cityData.description}
                      </p>
                      <Link
                        to={`/meteo/${cityData.name}`}
                        className="btn btn-primary"
                      >
                        Dettagli
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottone carica altro */}
        {canLoadMore && (
          <div className="text-center mt-3">
            <button
              className="btn btn-secondary"
              onClick={() => setBatchIndex(batchIndex + 1)}
              disabled={loading}
            >
              {loading ? "Caricamento..." : "Carica altre città"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
