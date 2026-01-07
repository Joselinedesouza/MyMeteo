import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage"; // o HomePage, dipende dal tuo nome file
import MeteoPage from "./pages/MeteoPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/meteo/:city" element={<MeteoPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
