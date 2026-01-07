import WeatherCard from "./WeatherCard";

export default function WeatherGrid({ weatherList }) {
  return (
    <div className="grid">
      {weatherList.map((cityData) => (
        <WeatherCard key={cityData.name} cityData={cityData} />
      ))}
    </div>
  );
}
