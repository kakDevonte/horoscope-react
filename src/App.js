import React from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { ChoiceSign } from "./components/ChoiceSign";
import { HomePage } from "./components/HomePage";
import bridge from "@vkontakte/vk-bridge";
import {
  useHoroscopeActions,
  useHoroscopeState,
} from "./context/horoscope-context";
import { Loader } from "./components/Loader";
import "./App.scss";
import { images } from "./utils";

const App = () => {
  const { getUser, setIsAuth } = useHoroscopeActions();
  const { isAuth } = useHoroscopeState();
  const [isLoad, setIsLoad] = React.useState(false);

  React.useEffect(() => {
    images.forEach((picture) => {
      const img = new Image();
      img.src = picture;
    });
    setIsLoad(true);
  }, []);

  React.useEffect(() => {
    (async () => {
      const data = await bridge.send("VKWebAppGetUserInfo");
      getUser(data.id);
    })();
  }, []);

  if (!isLoad)
    return (
      <div className="loader">
        <Loader />
      </div>
    );

  return (
    <div className="root">
      <Header />
      <Routes>
        <Route path={"/"} element={<ChoiceSign />} />
        <Route path={"/home"} element={<HomePage />} />
      </Routes>
    </div>
  );
};

export default App;
