import React from "react";
import styles from "./HomePage.module.scss";
import clear from "../../assets/images/moon/clear.png";
import stage1 from "../../assets/images/moon/stage-1.png";
import stage2 from "../../assets/images/moon/stage-2.png";
import stage3 from "../../assets/images/moon/stage-3.png";
import stage4 from "../../assets/images/moon/stage-4.png";
import stage5 from "../../assets/images/moon/stage-5.png";
import star from "../../assets/images/star.png";
import { MainSign } from "../MainSign";
import { Prediction } from "../Prediction";
import RepostButton from "../RepostButton";
import { useNavigate } from "react-router-dom";
import { ModalInfo } from "../ModalInfo";
import {
  useHoroscopeActions,
  useHoroscopeState,
} from "../../context/horoscope-context";
import { interval } from "../../utils";
import bridge from "@vkontakte/vk-bridge";
import { horoscopeAPI } from "../../api/horoscope-api";
import { Timer } from "../Timer";

const moon = [stage1, stage2, stage3, stage4, stage5];
const MAX_DAY = 5;

export const HomePage = () => {
  const { scene, user } = useHoroscopeState();
  const { dateOfShowAds } = user;
  const {
    setScene,
    setFullPredict,
    setAdsData,
    setDays,
    setStars,
    setDateOfGetStars,
    setUser,
  } = useHoroscopeActions();
  const [isShowInfo, seIsShowInfo] = React.useState(false);
  const [isAd, setIsAd] = React.useState(false);
  const [isTakeBonus, setIsTakeBonus] = React.useState(false);
  const [height, setHeight] = React.useState(0);
  const navigate = useNavigate();

  React.useEffect(() => {
    (async () => await isShowAd())();
  });

  React.useEffect(() => {
    try {
      let btnHeight = 0;
      const parentPos = document
        .getElementById("predict")
        .getBoundingClientRect();
      const h2 = document.getElementById("btn2").getBoundingClientRect();
      const parentPos2 = document.getElementById("btn").getBoundingClientRect();

      if (user.isFullPredict) btnHeight += h2.height * 2;

      setHeight(
        parentPos2.y - parentPos.y - (h2.y - parentPos2.y) / 2 - btnHeight
      );
    } catch (e) {}
  });

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

  const isShowAd = async () => {
    const data = await bridge.send("VKWebAppCheckNativeAds", {
      ad_format: "interstitial",
    });
    isAds(data.result);
  };

  const isAds = (result) => {
    if (result) {
      if (user.countOfAdsPerDay >= 3) setIsAd(false);
      if (user.dateOfShowAds) {
        let date1 = new Date(user.dateOfShowAds);
        let date2 = new Date();

        const diff = interval(date1, date2);
        setIsAd(
          diff.hours >= 6 ||
            diff.days >= 1 ||
            diff.months >= 1 ||
            diff.years >= 1
        );
      } else setIsAd(true);
    }
    if (user.dateOfGetStars) {
      let date1 = new Date(user.dateOfGetStars);
      let date2 = new Date();
      const diff = interval(date1, date2);
      if (
        diff.hours >= 21 ||
        diff.days >= 1 ||
        diff.months >= 1 ||
        diff.years >= 1
      ) {
        setIsTakeBonus(true);
      }
    } else {
      setIsTakeBonus(true);
    }
  };

  const onClickGetFullPredict = () => {
    setFullPredict(user.stars);
  };

  const onClickWeekBtn = (scene) => {
    setScene(scene);
  };

  const onClickShowInfo = () => {
    seIsShowInfo(!isShowInfo);
  };

  const onClickCreateHistory = () => {};

  const onClickShowAd = async () => {
    if (isAd) {
      const data = await horoscopeAPI.setAdsData(
        user.id,
        new Date(),
        user.countOfAdsPerDay + 1
      );
      setUser(data.data);
      // await setAdsData(new Date(), user.countOfAdsPerDay + 1);
      bridge.send("VKWebAppShowNativeAds", {
        ad_format: "interstitial",
      });
    } else if (isTakeBonus) {
      setDateOfGetStars(new Date());
    }
    await setDays(user.day + 1, user.stars);
    await setStars(user.stars + 2);
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
          {scene === "today" && (
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
                <button
                  id="btn2"
                  className={`${styles.button} ${
                    (isAd || isTakeBonus) && styles.selected
                  }`}
                  disabled={!(isAd || isTakeBonus)}
                  onClick={onClickShowAd}
                >
                  <span className={styles.adBtnText}>
                    {isAd ? "Посмотреть рекламу" : "Получить"} +2
                    <img src={stage1} />
                    +1 <img src={star} />
                  </span>
                </button>
              </div>
            </div>
          )}
          {scene === "tomorrow" && (
            <div className={styles.tomorrowContainer}>
              <span>
                Гороскоп на завтра будет <br /> доступен в{" "}
                <span className={styles.gradient}>21.00 по МСК</span>
              </span>
              <Timer />
              <RepostButton title={"Напомните мне"} />
            </div>
          )}
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
