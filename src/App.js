import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Header } from "./components/Header";
import { ChoiceSign } from "./components/ChoiceSign";
import { HomePage } from "./components/HomePage";
import bridgeOrigin from "@vkontakte/vk-bridge";
import bridgeMock from "@vkontakte/vk-bridge-mock";
import {
  useHoroscopeActions,
  useHoroscopeState,
} from "./context/horoscope-context";
import { Loader } from "./components/Loader";
import "./App.scss";
import ErrorPage from "./components/ErrorPage";

const bridge = true ? bridgeOrigin : bridgeMock; //  "homepage": "./",

const App = () => {
  const { getUser } = useHoroscopeActions();
  const { user } = useHoroscopeState();
  const [isLoad, setIsLoad] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    (async () => {
      const data = await bridge.send("VKWebAppGetUserInfo");
      getUser(data.id);
    })();
  }, []);

  React.useEffect(() => {
    if (user.sign !== null) {
      navigate("/home");
    } else {
      navigate("/");
    }
    if (!isNaN(user.id)) {
      setIsLoad(true);
    }
  }, [user]);

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
        <Route path={"/404"} element={<ErrorPage />} />
      </Routes>
    </div>
  );
};

export default App;
