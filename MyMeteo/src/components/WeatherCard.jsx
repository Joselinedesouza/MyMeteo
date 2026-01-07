import { Link } from "react-router-dom";

function getTempTone(celsius) {
  if (celsius === "--") return "neutral";
  if (celsius <= 0) return "cold";
  if (celsius >= 24) return "hot";
  return "mild";
}

export default function WeatherCard({ cityData }) {
  if (cityData.error) {
    return (
      <article className="wcard wcard--error">
        <header className="wcard__top">
          <h3 className="wcard__city">{cityData.name}</h3>
          <span className="wcard__badge wcard__badge--neutral">!</span>
        </header>

        <p className="wcard__desc">{cityData.error}</p>

        <div className="wcard__footer">
          <span className="wcard__hint">Riprova più tardi</span>
        </div>
      </article>
    );
  }

  const celsius =
    typeof cityData.temp === "number"
      ? Math.round(cityData.temp - 273.15)
      : "--";

  const tone = getTempTone(celsius);

  return (
    <article className="wcard">
      <div className="wcard__shine" />

      <header className="wcard__top">
        <div>
          <h3 className="wcard__city">{cityData.name}</h3>
          <div className="wcard__pill">{cityData.description}</div>
        </div>

        <img
          className="wcard__icon"
          src={`https://openweathermap.org/img/wn/${cityData.icon}@2x.png`}
          alt={cityData.description}
          loading="lazy"
        />
      </header>

      <div className="wcard__mid">
        <div className={`wcard__temp wcard__temp--${tone}`}>{celsius}°C</div>

        <div className="wcard__meta">
          <span className="wcard__dot" />
          Aggiornato ora
        </div>
      </div>

      <footer className="wcard__footer">
        <Link to={`/meteo/${cityData.name}`} className="wcard__btn">
          Dettagli <span className="wcard__arrow">→</span>
        </Link>
      </footer>
    </article>
  );
}
