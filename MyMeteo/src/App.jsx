import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import WeatherPage from "./pages/WeatherPage";
import MeteoPage from "./pages/MeteoPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/meteo/:city" element={<MeteoPage />} />
      <Route path="/city/:slug" element={<WeatherPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
