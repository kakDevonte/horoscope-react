import React from "react";
import scroll from "../../assets/images/scroll.png";
import styles from "./Prediction.module.scss";
import Scrollbar from "../ScrollBar";
import { useHoroscopeState } from "../../context/horoscope-context";

const regularText = (text) => {
  const count = text.split(" ").length;
  if (count < 15) return text;
  const REGEX = /((\s*\S+){15})([\s\S]*)/;
  return text ? REGEX.exec(text)[1] + "..." : "";
};

export const Prediction = ({ isFull, maxHeight }) => {
  const { user, today } = useHoroscopeState();
  const predict = isFull
    ? today[Object.keys(today)[user.sign]]
    : regularText(today[Object.keys(today)[user.sign]]);

  return (
    <div className={styles.root}>
      <img className={styles.scrollTop} src={scroll} />
      <div className={styles.content} style={{ maxHeight: maxHeight }}>
        <Scrollbar>
          <p>{predict}</p>
        </Scrollbar>
      </div>
      <img className={styles.scrollBottom} src={scroll} />
    </div>
  );
};
