import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../styles/home.css";

const apiKey = "eb293465a8757a7806a5455596a3e064";

type WeatherData = {
  name: string;
  temp: number;
  feels: number;
  humidity: number;
  wind: number;
  description: string;
  icon: string;
};

type ApiError = { message?: string };

export default function WeatherPage() {
  const [params] = useSearchParams();

  const city = params.get("city") ?? "";
  const lat = params.get("lat");
  const lon = params.get("lon");
  const country = params.get("country") ?? "";

  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        if (!lat || !lon) {
          throw new Error("Coordinate non disponibili");
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(
          lat
        )}&lon=${encodeURIComponent(lon)}&appid=${apiKey}&lang=it`;

        const res = await fetch(url);
        const json: unknown = await res.json();

        if (!res.ok) {
          const err = json as ApiError;
          throw new Error(err?.message || "Errore nel recupero meteo");
        }

        // tipizzazione "safe" minima
        const j = json as {
          name: string;
          main: { temp: number; feels_like: number; humidity: number };
          wind: { speed: number };
          weather: Array<{ description: string; icon: string }>;
        };

        setData({
          name: j.name || city,
          temp: j.main.temp,
          feels: j.main.feels_like,
          humidity: j.main.humidity,
          wind: j.wind.speed,
          description: j.weather?.[0]?.description ?? "—",
          icon: j.weather?.[0]?.icon ?? "01d",
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Errore sconosciuto";
        setError(msg);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [lat, lon, city]);

  const toC = (k: number) => Math.round(k - 273.15);

  return (
    <div className="detail">
      <div className="detail__content">
        <Link to="/" className="detail__back">
          ← Torna alla Home
        </Link>

        <div className="glass-card detail-card">
          {loading && <div className="loading-block">Caricamento...</div>}
          {error && <div className="alert alert-warning">{error}</div>}

          {data && !loading && !error && (
            <div className="detail-grid">
              <div className="detail-main">
                <h1 className="detail-title">
                  {data.name} {country ? `(${country})` : ""}
                </h1>

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
