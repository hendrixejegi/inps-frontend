import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";

// Register service worker for PWA
// Import must be at top level for Vite to handle it correctly
import { registerSW } from 'virtual:pwa-register'

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  registerSW()
}

createRoot(document.getElementById("root")!).render(<App />);
