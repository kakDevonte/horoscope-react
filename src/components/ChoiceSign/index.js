import React from "react";
import { Sign } from "../Sign";
import styles from "./ChoiceSign.module.scss";
import aquarius from "../../assets/images/icons/aquarius.png";
import aries from "../../assets/images/icons/aries.png";
import cancer from "../../assets/images/icons/cancer.png";
import capricorn from "../../assets/images/icons/capricorn.png";
import gemini from "../../assets/images/icons/gemini.png";
import leo from "../../assets/images/icons/leo.png";
import libra from "../../assets/images/icons/libra.png";
import pisces from "../../assets/images/icons/pisces.png";
import sagittarius from "../../assets/images/icons/sagittarius.png";
import scorpio from "../../assets/images/icons/scorpio.png";
import taurus from "../../assets/images/icons/taurus.png";
import virgo from "../../assets/images/icons/virgo.png";
import { Button } from "../Button";

const signs = [
  { name: "Овен", image: aries },
  { name: "Телец", image: taurus },
  { name: "Близнецы", image: gemini },
  { name: "Рак", image: cancer },
  { name: "Лев", image: leo },
  { name: "Дева", image: virgo },
  { name: "Весы", image: libra },
  { name: "Скорпион", image: scorpio },
  { name: "Стрелец", image: sagittarius },
  { name: "Козерог", image: capricorn },
  { name: "Водолец", image: aquarius },
  { name: "Рыбы", image: pisces },
];
export const ChoiceSign = () => {
  // const [isActive, setIsActive] = React.useState(false);
  const [signName, setSignName] = React.useState("");

  const onClickSign = (name) => {
    // setIsActive(!isActive);
    setSignName(name);
  };

  return (
    <div className={styles.root}>
      <div className={styles.list}>
        {signs.map((sign) => (
          <Sign
            key={sign.name}
            name={sign.name}
            image={sign.image}
            onClick={() => onClickSign(sign.name)}
            isActive={signName === sign.name}
          />
        ))}
      </div>
      <Button />
    </div>
  );
};
