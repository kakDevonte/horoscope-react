import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import App from "./App";
import "./index.scss";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { HoroscopeContextProvider } from "./context/horoscope-context";
import qs from "qs";

bridge.send("VKWebAppInit");

let parsed = qs.parse(window.location.href);
const Router = parsed.odr_enabled ? MemoryRouter : BrowserRouter;

ReactDOM.render(
  <Router>
    <HoroscopeContextProvider>
      <App />
    </HoroscopeContextProvider>
  </Router>,
  document.getElementById("root")
);
if (process.env.NODE_ENV === "development") {
  import("./eruda").then(({ default: eruda }) => {}); //runtime download
}
