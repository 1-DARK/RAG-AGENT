import "./App.css";
import Navbar from "./components/Navbar";
import SettingsPage from "./pages/SettingsPage";
import { Navigate, Route, Routes } from "react-router-dom";
import { useThemeStore } from "./store/useThemeStore.js";
function App() {
  const { theme } = useThemeStore();
  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}

export default App;
