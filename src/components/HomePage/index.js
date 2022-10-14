import React from "react";
import styles from "./HomePage.module.scss";
import clear from "../../assets/images/moon/clear.png";
import stage1 from "../../assets/images/moon/stage-1.png";
import stage2 from "../../assets/images/moon/stage-2.png";
import stage3 from "../../assets/images/moon/stage-3.png";
import stage4 from "../../assets/images/moon/stage-4.png";
import stage5 from "../../assets/images/moon/stage-5.png";
import { MainSign } from "../MainSign";
import { Prediction } from "../Prediction";
import RepostButton from "../RepostButton";
import { useNavigate } from "react-router-dom";
import { ModalInfo } from "../ModalInfo";
import {
  useHoroscopeActions,
  useHoroscopeState,
} from "../../context/horoscope-context";

const moon = [stage1, stage2, stage3, stage4, stage5];
const MAX_DAY = 5;

export const HomePage = () => {
  const { scene, user } = useHoroscopeState();
  const { setScene, setFullPredict } = useHoroscopeActions();
  const [isShowInfo, seIsShowInfo] = React.useState(false);
  const [height, setHeight] = React.useState(0);
  const navigate = useNavigate();

  React.useEffect(() => {
    let btnHeight = 0;
    const parentPos = document
      .getElementById("predict")
      .getBoundingClientRect();
    const h2 = document.getElementById("btn2").getBoundingClientRect();
    const parentPos2 = document.getElementById("btn").getBoundingClientRect();

    if (user.isFullPredict) btnHeight += h2.height * 2;

    console.log(h2);
    console.log(btnHeight);
    setHeight(
      parentPos2.y - parentPos.y - (h2.y - parentPos2.y) / 2 - btnHeight
    );
  }, []);

  const onClickGetFullPredict = () => {
    setFullPredict(user.stars);
  };

  const onClickWeekBtn = (scene) => {
    setScene(scene);
  };

  const getMoon = () => {
    let content = [];
    for (let i = 1; i <= MAX_DAY; i++) {
      content.push(
        <img
          key={i}
          className={styles.moon}
          src={i <= user.day ? moon[i - 1] : clear}
          alt={""}
        />
      );
    }
    return content;
  };

  const onClickShowInfo = () => {
    seIsShowInfo(!isShowInfo);
  };
  return (
    <div className={`${styles.home} ${isShowInfo && styles.bg}`}>
      {isShowInfo && <ModalInfo onClick={onClickShowInfo} />}
      <div className={`${styles.root} ${isShowInfo && styles.bg}`}>
        <div className={styles.header}>
          <div>{getMoon()}</div>
          <span className={styles.who} onClick={onClickShowInfo}>
            что это?
          </span>
          <span className={styles.sign} onClick={() => navigate("/")}>
            Сменить знак
          </span>
        </div>
        <div className={styles.main}>
          <div className={styles.container}>
            <MainSign index={user.sign} />
            <div className={styles.weekBtns}>
              <button
                className={`${styles.button} ${
                  scene === "today" && styles.selected
                }`}
                onClick={() => onClickWeekBtn("today")}
              >
                Сегодня
              </button>
              <button
                className={`${styles.button} ${
                  scene === "tomorrow" && styles.selected
                }`}
                onClick={() => onClickWeekBtn("tomorrow")}
              >
                Завтра
              </button>
              <button
                className={`${styles.button} ${
                  scene === "week" && styles.selected
                }`}
                onClick={() => onClickWeekBtn("week")}
              >
                Неделя
              </button>
            </div>
          </div>
          <div className={styles.predictContainer}>
            <div id="predict" className={styles.predict}>
              <Prediction isFull={user.isFullPredict} maxHeight={height} />
            </div>
            <div id="btn" className={styles.predictBtns}>
              <button
                className={`${styles.button} ${
                  user.stars >= 2 && styles.selected
                }`}
                style={{ display: user.isFullPredict ? "none" : "block" }}
                disabled={user.stars < 2}
                onClick={onClickGetFullPredict}
              >
                Показать полностью
              </button>
              <button id="btn2" className={styles.button}>
                Кнопка 2
              </button>
            </div>
          </div>
        </div>
        <div className={styles.repost}>
          <span>Поделиться гороскопом</span>
          <div className={styles.repostBtns}>
            <RepostButton title={"На стену"} />
            <RepostButton title={"В историю"} />
            <RepostButton title={"В личку"} />
          </div>
        </div>
      </div>
    </div>
  );
};
