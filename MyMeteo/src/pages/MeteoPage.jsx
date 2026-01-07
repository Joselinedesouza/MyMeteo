import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/home.css"; // usa lo stesso tema

const apiKey = "eb293465a8757a7806a5455596a3e064";

export default function MeteoPage() {
  const { city } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            city
          )}&appid=${apiKey}&lang=it`
        );
        const json = await res.json();
        if (!res.ok)
          throw new Error(json?.message || "Errore nel recupero meteo");

        setData({
          name: json.name,
          temp: json.main.temp,
          feels: json.main.feels_like,
          humidity: json.main.humidity,
          wind: json.wind.speed,
          description: json.weather[0].description,
          icon: json.weather[0].icon,
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (city) load();
  }, [city]);

  const toC = (k) => (typeof k === "number" ? Math.round(k - 273.15) : "--");

  return (
    <div className="detail">
      <div className="detail__content">
        <Link to="/" className="detail__back">
          ← Torna alla Home
        </Link>

        <div className="glass-card detail-card">
          {loading && <div className="loading-block">Caricamento...</div>}
          {error && <div className="alert alert-warning">{error}</div>}

          {data && (
            <div className="detail-grid">
              <div className="detail-main">
                <h1 className="detail-title">{data.name}</h1>
                <div className="detail-pill">{data.description}</div>

                <div className="detail-temp">
                  {toC(data.temp)}°<span>C</span>
                </div>

                <div className="detail-sub">
                  Percepita: <b>{toC(data.feels)}°C</b>
                </div>
              </div>

              <div className="detail-iconWrap">
                <img
                  className="detail-icon"
                  src={`https://openweathermap.org/img/wn/${data.icon}@4x.png`}
                  alt={data.description}
                />
              </div>

              <div className="detail-stats">
                <div className="detail-stat">
                  <span className="detail-label">Umidità</span>
                  <span className="detail-value">{data.humidity}%</span>
                </div>

                <div className="detail-stat">
                  <span className="detail-label">Vento</span>
                  <span className="detail-value">
                    {Math.round(data.wind)} m/s
                  </span>
                </div>

                <div className="detail-stat">
                  <span className="detail-label">Stato</span>
                  <span className="detail-value cap">{data.description}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
