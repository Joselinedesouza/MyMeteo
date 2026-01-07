export default function MyLocationWeather({ myWeather }) {
  if (!myWeather) return null;

  const celsius =
    typeof myWeather.temp === "number"
      ? Math.round(myWeather.temp - 273.15)
      : "--";

  return (
    <div className="glass-card glass-card--wide">
      <div className="glass-row">
        <div>
          <h4 className="glass-title">La tua posizione</h4>
          <p className="glass-meta">{myWeather.name}</p>
          <p className="glass-temp">{celsius}°C</p>
          <p className="glass-desc">{myWeather.description}</p>
        </div>

        <img
          className="owm-icon"
          src={`https://openweathermap.org/img/wn/${myWeather.icon}@2x.png`}
          alt={myWeather.description}
          loading="lazy"
        />
      </div>
    </div>
  );
}
