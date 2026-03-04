// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";

// Menggunakan type assertion (!) karena kita yakin elemen 'root' ada di index.html
const rootElement = document.getElementById("root")!;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {/* HelmetProvider membungkus seluruh aplikasi agar tag <Helmet> 
      di setiap halaman (LandingPage, Blog, Detail) dapat mengupdate 
      Meta Tag secara dinamis untuk SEO OmzetNaik.id 
    */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
);
