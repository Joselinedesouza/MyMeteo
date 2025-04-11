import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

//Stefano come vedrai mi risulta un problema quando aggiorno tramite il browser la pagina!
//Devi schiacciare due volte la freccia aggiorna per far vedere tutto correttamente!
//Sto impazzendo ma non riesco a capire!!! se magari nel feedback mi lasci la soluzione ti sarei grata

const cities = ["Roma", "Milano", "Napoli", "Torino", "Firenze", "Palermo"]; //Elenco dell città
const apiKey = "eb293465a8757a7806a5455596a3e064"; // La mia chiave per usare l'API

const images = ["/images/sunny.jpg", "/images/rainy.jpg", "/images/cloudy.jpg"]; //Sfondi casuali da usare nella pagina

const Home = () => {
  const [weatherList, setWeatherList] = useState([]); //Meteo delle città
  const [myWeather, setMyWeather] = useState(null); // Meteo della posizione dell'utente
  const [locationError, setLocationError] = useState(null); //Errore se la posizione non è disponibile
  const [backgroundImage, setBackgroundImage] = useState(""); // Immagine di sfondo
  const [loading, setLoading] = useState(true); // Mostra un loader
  const [isLoaded, setIsLoaded] = useState(false); // Fa capire se l'immagine di sfondo è caricata

  //Qui monto il componente
  //Sceglie un'immagine casuale
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * images.length);
    const imageUrl = images[randomIndex];

    const img = new Image();
    //pre-carica l'immagine
    img.onload = () => {
      setBackgroundImage(imageUrl);
      // quando è pronta imposta lo sfondo è ci dice che è loaded
      setIsLoaded(true);
    };
    img.src = imageUrl;
  }, []);

  useEffect(() => {
    const cachedMyWeather = localStorage.getItem("myWeather"); //provo a caricare il meteo salvato nel localeStorage
    if (cachedMyWeather) {
      setMyWeather(JSON.parse(cachedMyWeather));
    }
    //Ottengo la posizione attuale
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
        )
          .then((res) => res.json())
          .then((data) => {
            const weatherData = {
              name: data.name,
              temp: data.main.temp,
              description: data.weather[0].description,
              icon: data.weather[0].icon,
            };
            setMyWeather(weatherData);
            localStorage.setItem("myWeather", JSON.stringify(weatherData));
          })
          .catch(() => setLocationError("Errore nel recupero del meteo."));
      },
      () => setLocationError("Posizione non disponibile.")
    );
  }, []);

  useEffect(() => {
    const cachedWeather = localStorage.getItem("weatherList");
    if (cachedWeather) {
      setWeatherList(JSON.parse(cachedWeather));
      setLoading(false);
    }

    const fetchData = () => {
      const requests = cities.map((city) =>
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
        )
          .then((res) => res.json())
          .then((data) => ({
            name: city,
            temp: data.main.temp,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
          }))
          .catch(() => ({
            name: city,
            error: "Errore nel caricamento",
          }))
      );

      Promise.all(requests).then((results) => {
        setWeatherList(results);
        localStorage.setItem("weatherList", JSON.stringify(results));
        setLoading(false);
      });
    };

    fetchData();
  }, []);

  return (
    <div
      style={{
        backgroundImage: isLoaded ? `url(${backgroundImage})` : "none",
        backgroundColor: isLoaded ? "transparent" : "#f0f0f0",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "white",
      }}
    >
      {isLoaded ? (
        <div className="container mt-2">
          <h1 className="text-center mb-4 text-white ">
            Meteo delle principali città
          </h1>

          {myWeather && (
            <div className="alert text-white text-center bg-dark bg-opacity-50 rounded">
              <h4>Meteo della tua posizione: {myWeather.name}</h4>
              <img
                src={`http://openweathermap.org/img/wn/${myWeather.icon}@2x.png`}
                alt={myWeather.description}
              />
              <p>
                {Math.round(myWeather.temp - 273.15)}°C -{" "}
                {myWeather.description}
              </p>
            </div>
          )}

          {locationError && (
            <div className="alert alert-warning text-center">
              {locationError}
            </div>
          )}

          {loading ? (
            <div className="text-center text-white mt-5">
              <div className="spinner-border text-light" role="status" />
              <p className="mt-2">Caricamento meteo...</p>
            </div>
          ) : (
            <div className="row">
              {weatherList.map((cityData, index) => (
                <div className="col-md-4 mb-3" key={index}>
                  <div className="card text-center custom-card">
                    <div className="card-body">
                      <h5 className="card-title">{cityData.name}</h5>
                      {cityData.error ? (
                        <p>{cityData.error}</p>
                      ) : (
                        <>
                          <img
                            src={`http://openweathermap.org/img/wn/${cityData.icon}@2x.png`}
                            alt={cityData.description}
                          />
                          <p>{Math.round(cityData.temp - 273.15)}°C</p>
                          <p>{cityData.description}</p>
                          <Link
                            to={`/meteo/${cityData.name}`}
                            className="btn btn-primary"
                          >
                            View
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="loading-screen text-center text-black">
          Caricamento...
        </div>
      )}
    </div>
  );
};

export default Home;
