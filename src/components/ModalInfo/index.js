import React from "react";
import styles from "./ModalInfo.module.scss";
import stage1 from "../../assets/images/moon/stage-1.png";
import stage2 from "../../assets/images/moon/stage-2.png";
import stage3 from "../../assets/images/moon/stage-3.png";
import stage4 from "../../assets/images/moon/stage-4.png";
import stage5 from "../../assets/images/moon/stage-5.png";
import star from "../../assets/images/star.png";
import RepostButton from "../RepostButton";

export const ModalInfo = ({ onClick }) => {
  return (
    <div className={styles.root}>
      <div className={styles.modal}>
        <span>Вырасти полную луну!</span>
        <span className={styles.close} onClick={onClick}>
          &#215;
        </span>
        <div className={styles.progress}>
          <img src={stage1} />
          <span>&#10230;</span>
          <img src={stage2} />
          <span>&#10230;</span>
          <img src={stage3} />
          <span>&#10230;</span>
          <img src={stage4} />
          <span>&#10230;</span>
          <img src={stage5} />
        </div>
        <div className={styles.container}>
          <p className={styles.info}>
            Заходи в приложение каждый день, чтобы собрать полную луну. Каждая
            полная луна наградит тебя пятью звездами!
          </p>
        </div>
        <div className={styles.result}>
          <img src={stage5} />
          <span>&#10230;</span>
          <span>+5</span>
          <img src={star} />
        </div>
        <div className={styles.button}>
          <RepostButton title={"Понятно"} onClick={onClick} />
        </div>
      </div>
    </div>
  );
};
