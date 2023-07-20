import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { MessagingProvider } from "./MessagingContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <MessagingProvider>
    <App />
  </MessagingProvider>
);
