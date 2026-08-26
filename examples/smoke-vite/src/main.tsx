import { KronusUIProvider } from "@kronus-ui/theme";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Missing #root element in index.html");

createRoot(rootEl).render(
  <StrictMode>
    <KronusUIProvider asRoot defaultThemeName="aurora" defaultModeName="dark">
      <App />
    </KronusUIProvider>
  </StrictMode>,
);
