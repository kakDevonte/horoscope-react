import React from "react";
import styles from "./MainSign.module.scss";
import aquarius from "../../assets/images/sign/aquarius.png";
import aries from "../../assets/images/sign/aries.png";
import cancer from "../../assets/images/sign/cancer.png";
import capricorn from "../../assets/images/sign/capricorn.png";
import gemini from "../../assets/images/sign/gemini.png";
import leo from "../../assets/images/sign/leo.png";
import libra from "../../assets/images/sign/libra.png";
import pisces from "../../assets/images/sign/pisces.png";
import sagittarius from "../../assets/images/sign/sagittarius.png";
import scorpio from "../../assets/images/sign/scorpio.png";
import taurus from "../../assets/images/sign/taurus.png";
import virgo from "../../assets/images/sign/virgo.png";
import subAquarius from "../../assets/images/icons/aquarius.png";
import subAries from "../../assets/images/icons/aries.png";
import subCancer from "../../assets/images/icons/cancer.png";
import subCapricorn from "../../assets/images/icons/capricorn.png";
import subGemini from "../../assets/images/icons/gemini.png";
import subLeo from "../../assets/images/icons/leo.png";
import subLibra from "../../assets/images/icons/libra.png";
import subPisces from "../../assets/images/icons/pisces.png";
import subSagittarius from "../../assets/images/icons/sagittarius.png";
import subScorpio from "../../assets/images/icons/scorpio.png";
import subTaurus from "../../assets/images/icons/taurus.png";
import subVirgo from "../../assets/images/icons/virgo.png";
import { useHoroscopeState } from "../../context/horoscope-context";

const signs = [
  { name: "Овен", image: aries, subImage: subAries },
  { name: "Телец", image: taurus, subImage: subTaurus },
  { name: "Близнецы", image: gemini, subImage: subGemini },
  { name: "Рак", image: cancer, subImage: subCancer },
  { name: "Лев", image: leo, subImage: subLeo },
  { name: "Дева", image: virgo, subImage: subVirgo },
  { name: "Весы", image: libra, subImage: subLibra },
  { name: "Скорпион", image: scorpio, subImage: subScorpio },
  { name: "Стрелец", image: sagittarius, subImage: subSagittarius },
  { name: "Козерог", image: capricorn, subImage: subCapricorn },
  { name: "Водолей", image: aquarius, subImage: subAquarius },
  { name: "Рыбы", image: pisces, subImage: subPisces },
];

export const MainSign = ({ index }) => {
  return (
    <div className={styles.root}>
      <img className={styles.mainSign} src={signs[index].image} />
      <img className={styles.subSign} src={signs[index].subImage} />
      <span className={styles.name}>{signs[index].name}</span>
    </div>
  );
};
