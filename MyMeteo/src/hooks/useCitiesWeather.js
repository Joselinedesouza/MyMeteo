import { useEffect, useState } from "react";

export function useCitiesWeather(cities, apiKey) {
  const [weatherList, setWeatherList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem("weatherList");
    if (cached) {
      setWeatherList(JSON.parse(cached));
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const results = await Promise.all(
          cities.map(async (city) => {
            try {
              const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=it`
              );
              const data = await res.json();

              return {
                name: city,
                temp: data?.main?.temp,
                description: data?.weather?.[0]?.description ?? "",
                icon: data?.weather?.[0]?.icon ?? "01d",
              };
            } catch {
              return { name: city, error: "Errore nel caricamento" };
            }
          })
        );

        setWeatherList(results);
        localStorage.setItem("weatherList", JSON.stringify(results));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cities, apiKey]);

  return { weatherList, loading };
}
