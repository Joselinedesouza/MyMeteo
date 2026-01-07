import CitySearch from "./CitySearch";

export default function WeatherHeader() {
  return (
    <div className="home-header">
      <h1 className="home-title">You Meteo</h1>
      <p className="home-subtitle">
        Seleziona una città per vedere i dettagli aggiornati.
      </p>

      <CitySearch />
    </div>
  );
}
