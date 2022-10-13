import React from "react";
import scroll from "../../assets/images/scroll.png";
import styles from "./Prediction.module.scss";

const text =
  "Это фиксированный знак стихии воды. Стрелец обладает природным магнетизмом и сильным характером. Скорпион умеет" +
  "Это фиксированный знак стихии воды. Стрелец обладает природным магнетизмом и сильным характером. Скорпион умеет" +
  "Это фиксированный знак стихии воды. Стрелец обладает природным магнетизмом и сильным характером. Скорпион умеет" +
  "Это фиксированный знак стихии воды. Стрелец обладает природным магнетизмом и сильным характером. Скорпион умеет" +
  "Это фиксированный знак стихии воды. Стрелец обладает природным магнетизмом и сильным характером. Скорпион умеет" +
  "Это фиксированный знак стихии воды. Стрелец обладает природным магнетизмом и сильным характером. Скорпион умеет";

const regularText = (text) => {
  const count = text.split(" ").length;
  if (count < 15) return text;
  const REGEX = /((\s*\S+){15})([\s\S]*)/;
  return text ? REGEX.exec(text)[1] + "..." : "";
};

export const Prediction = ({ isFull, maxHeight }) => {
  const predict = isFull ? text : regularText(text);
  return (
    <div className={styles.root}>
      <img className={styles.scrollTop} src={scroll} />
      <div className={styles.content} style={{ maxHeight: maxHeight }}>
        <p>{predict}</p>
      </div>
      <img className={styles.scrollBottom} src={scroll} />
    </div>
  );
};
