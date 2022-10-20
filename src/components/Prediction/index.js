import React from "react";
import scroll from "../../assets/images/scroll.png";
import styles from "./Prediction.module.scss";
import Scrollbar from "../ScrollBar";
import { useHoroscopeState } from "../../context/horoscope-context";

const text = //"adssadsadsadasd";
  "Сегодня вы можете обнаружить, что близкие относятся к вам не так, как вы думали. Открытие может породить в вас разочарование. Возможно, вам даже захочется сменить круг общения. Но не рубите с плеча, не принимайте поспешных решений под влиянием эмоций.";
// "Это фиксированный знак стихии воды. Стрелец обладает природным магнетизмом и сильным характером. Скорпион умеет" +
// "Это фиксированный знак стихии воды. Стрелец обладает природным магнетизмом и сильным характером. Скорпион умеет" +
// "Это фиксированный знак стихии воды. Стрелец обладает природным магнетизмом и сильным характером. Скорпион умеет" +
// "Это фиксированный знак стихии воды. Стрелец обладает природным магнетизмом и сильным характером. Скорпион умеет" +
// "Это фиксированный знак стихии воды. Стрелец обладает природным магнетизмом и сильным характером. Скорпион умеет" +
// "Это фиксированный знак стихии воды. Стрелец обладает природным магнетизмом и сильным характером. Скорпион умеет";

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
