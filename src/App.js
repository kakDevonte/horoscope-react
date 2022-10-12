import React from "react";
import "./App.scss";
import { Header } from "./components/Header";
import { Sign } from "./components/Sign";
import { ChoiceSign } from "./components/ChoiceSign";

const App = () => {
  return (
    <div className="root">
      <Header />
      <ChoiceSign />
    </div>
  );
};

export default App;
