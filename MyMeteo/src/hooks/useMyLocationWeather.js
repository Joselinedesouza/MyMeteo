import { useEffect, useState } from "react";

export function useMyLocationWeather(apiKey) {
  const [myWeather, setMyWeather] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const cached = localStorage.getItem("myWeather");
    if (cached) setMyWeather(JSON.parse(cached));

    if (!navigator.geolocation) {
      setLocationError("Geolocalizzazione non supportata dal browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=it`
          );
          const data = await res.json();

          const weatherData = {
            name: data?.name ?? "La tua posizione",
            temp: data?.main?.temp,
            description: data?.weather?.[0]?.description ?? "",
            icon: data?.weather?.[0]?.icon ?? "01d",
          };

          setMyWeather(weatherData);
          localStorage.setItem("myWeather", JSON.stringify(weatherData));
        } catch {
          setLocationError("Errore nel recupero del meteo.");
        }
      },
      () => setLocationError("Posizione non disponibile.")
    );
  }, [apiKey]);

  return { myWeather, locationError };
}
