import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type GeoResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // toglie accenti
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CitySearch() {
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<GeoResult[]>([]);

  const canSearch = useMemo(() => q.trim().length >= 2, [q]);

  useEffect(() => {
    const query = q.trim();
    if (query.length < 2) {
      setResults([]);
      setError("");
      return;
    }

    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          query
        )}&count=7&language=it&format=json`;

        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) throw new Error("Errore nella ricerca città");

        const data = await res.json();
        setResults((data?.results ?? []) as GeoResult[]);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setError(e?.message ?? "Errore");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [q]);

  const goToCityPage = (r: GeoResult) => {
    const slug = slugify(r.name);

    const params = new URLSearchParams({
      city: r.name, // nome originale
      lat: String(r.latitude),
      lon: String(r.longitude),
      country: r.country,
      ...(r.admin1 ? { region: r.admin1 } : {}),
    });

    navigate(`/city/${slug}?${params.toString()}`);
    setQ("");
    setResults([]);
  };

  return (
    <div className="city-search">
      <div className="city-search-bar">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cerca una città (es. Venezia, New York...)"
          aria-label="Cerca una città"
        />
        {loading && <span className="city-search-loading">…</span>}
      </div>

      {error && <p className="city-search-error">{error}</p>}

      {canSearch && results.length > 0 && (
        <ul className="city-search-results">
          {results.map((r) => (
            <li key={r.id}>
              <button type="button" onClick={() => goToCityPage(r)}>
                <strong>{r.name}</strong>
                <span>
                  {r.admin1 ? `, ${r.admin1}` : ""} • {r.country}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {canSearch && !loading && results.length === 0 && !error && (
        <p className="city-search-empty">Nessun risultato.</p>
      )}
    </div>
  );
}
