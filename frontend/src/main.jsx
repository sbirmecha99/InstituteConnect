import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { UserProvider } from "../context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { SearchProvider } from "./pages/dashboards/features/SearchContext";



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
