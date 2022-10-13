import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import App from "./App";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import { HoroscopeContextProvider } from "./context/horoscope-context";

// Init VK  Mini App
bridge.send("VKWebAppInit");

ReactDOM.render(
  <BrowserRouter>
    <HoroscopeContextProvider>
      <App />
    </HoroscopeContextProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
if (process.env.NODE_ENV === "development") {
  import("./eruda").then(({ default: eruda }) => {}); //runtime download
}
