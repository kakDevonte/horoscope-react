import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import App from "./App";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";
import { HoroscopeContextProvider } from "./context/horoscope-context";

bridge.send("VKWebAppInit");

screen.orientation
  .lock("portrait-primary")
  .then(() => {
    console.log(`Locked to portrait-primary\n`);
  })
  .catch((error) => {
    console.log(error);
  });

console.log("ЭЕКРАН");
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
