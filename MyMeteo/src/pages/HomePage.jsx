import React from "react";
import "../styles/home.css";
import WeatherHeader from "../components/WeatherHeader";
import MyLocationWeather from "../components/MyLocationWeather";
import WeatherGrid from "../components/WeatherGrid";
import LoadingBlock from "../components/LoadingBlock";
import { useRandomBackground } from "../hooks/useRandomBackground";
import { useMyLocationWeather } from "../hooks/useMyLocationWeather";
import { useCitiesWeather } from "../hooks/useCitiesWeather";

const cities = ["Roma", "Milano", "Napoli", "Torino", "Firenze", "Palermo"];
const apiKey = "eb293465a8757a7806a5455596a3e064";
const images = ["/images/sunny.jpg", "/images/rainy.jpg", "/images/cloudy.jpg"];

export default function HomePage() {
  const { backgroundImage } = useRandomBackground(images);
  const { myWeather, locationError } = useMyLocationWeather(apiKey);
  const { weatherList, loading } = useCitiesWeather(cities, apiKey);

  return (
    <div
      className="home"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="home-content">
        <WeatherHeader />
        <MyLocationWeather myWeather={myWeather} />

        {locationError && (
          <div className="alert alert-warning">{locationError}</div>
        )}

        {loading ? (
          <LoadingBlock text="Caricamento meteo..." />
        ) : (
          <div className="cities-wrapper">
            <WeatherGrid weatherList={weatherList} />
          </div>
        )}
      </div>

      <footer className="app-footer">
        © 2025 · Created by <strong>JoselineDeSouza</strong> for{" "}
        <strong>Epicode</strong>
      </footer>
    </div>
  );
}
