import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "tw-elements";
// import { ThemeProvider } from "./context/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <ThemeProvider> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* </ThemeProvider> */}
  </React.StrictMode>,
);
