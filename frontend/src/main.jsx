import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { UserProvider } from "../context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { SearchProvider } from "./pages/dashboards/features/SearchContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="195826618489-li2vh51tjrhqprlhoocj2lcnlcbi88pn.apps.googleusercontent.com">
    <React.StrictMode>
      <BrowserRouter>
        <UserProvider>
          <SearchProvider>
            <App />
          </SearchProvider>
        </UserProvider>
      </BrowserRouter>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
