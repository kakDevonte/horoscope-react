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

const App = () => {
  const { getUser, setIsAuth } = useHoroscopeActions();
  const { isAuth } = useHoroscopeState();

  React.useEffect(() => {
    (async () => {
      const data = await bridge.send("VKWebAppGetUserInfo");
      getUser(data.id);
      setIsAuth(true);
    })();
  }, []);

  if (!isAuth)
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
