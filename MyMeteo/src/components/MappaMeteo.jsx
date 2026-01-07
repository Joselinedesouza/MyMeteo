import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const apiKey = "eb293465a8757a7806a5455596a3e064";

const cities = [
  { name: "Roma", lat: 41.9, lon: 12.5 },
  { name: "Milano", lat: 45.5, lon: 9.2 },
  { name: "Napoli", lat: 40.8, lon: 14.25 },
  // aggiungi altre città con coordinate precise
];

// Funzione per creare icona personalizzata da codice icona OpenWeather
const createIcon = (iconCode) =>
  new L.Icon({
    iconUrl: `https://openweathermap.org/img/wn/${iconCode}@2x.png`,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
  });

export default function MappaMeteo() {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    // Fetch meteo per tutte le città
    const fetchAllWeather = async () => {
      const promises = cities.map(async ({ lat, lon }) => {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=it`
        );
        const data = await res.json();
        return {
          name: data.name,
          temp: data.main.temp,
          icon: data.weather[0].icon,
          description: data.weather[0].description,
          lat,
          lon,
        };
      });
      const results = await Promise.all(promises);
      setWeatherData(results);
    };

    fetchAllWeather();
  }, []);

  return (
    <MapContainer
      center={[41.9, 12.5]}
      zoom={5}
      style={{ height: "100vh", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {weatherData.map(({ name, temp, icon, description, lat, lon }) => (
        <Marker key={name} position={[lat, lon]} icon={createIcon(icon)}>
          <Popup>
            <strong>{name}</strong>
            <br />
            {Math.round(temp)}°C - {description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
