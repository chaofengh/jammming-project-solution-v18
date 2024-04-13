import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App/App";
import "./index.css";

import ReactDOM from "react-dom/client";
import "./index.css";

const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Material+Icons";
link.rel = "stylesheet";
document.head.appendChild(link);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
