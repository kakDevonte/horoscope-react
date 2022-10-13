import React from "react";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { ChoiceSign } from "./components/ChoiceSign";
import { HomePage } from "./components/HomePage";
import "./App.scss";

const App = () => {
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
