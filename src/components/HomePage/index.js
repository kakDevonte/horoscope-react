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
import { Timer } from "../Timer";
import VideoStories from "../../utils/videoStories";
import { Loader } from "../Loader";

const moon = [stage1, stage2, stage3, stage4, stage5];
const MAX_DAY = 5;

const regexText = (text) => {
  const count = text.split(" ").length;
  if (count < 15) return text;
  const REGEX = /((\s*\S+){15})([\s\S]*)/;
  return text ? REGEX.exec(text)[1] + "..." : "";
};

export const HomePage = () => {
  const { scene, user, today, isLoading } = useHoroscopeState();
  const {
    setScene,
    setFullPredict,
    addPushNotice,
    setAdsData,
    setRemindMe,
    setDays,
  } = useHoroscopeActions();
  const [isShowInfo, seIsShowInfo] = React.useState(false);
  const [isAd, setIsAd] = React.useState(false);
  const [height, setHeight] = React.useState(0);
  const navigate = useNavigate();
  const [textPredict, setTextPredict] = React.useState(
    user.isFullPredict[user.sign]
      ? today[Object.keys(today)[user.sign]]
      : regexText(today[Object.keys(today)[user.sign]])
  );

  const [moons, setMoons] = React.useState([]);

  const [isOnline, setIsOnline] = React.useState(true);
  let intervalOnline = null;
  VideoStories.init(51439496, bridge, user.id, "windows");
  const InternetErrMessenger = () => setIsOnline(navigator.onLine === true);

  React.useEffect(() => {
    setTextPredict(
      user.isFullPredict[user.sign]
        ? today[Object.keys(today)[user.sign]]
        : regexText(today[Object.keys(today)[user.sign]])
    );
  }, [user]);

  React.useEffect(() => {
    if (!user.isGetTodayDay) {
      setDays();
    }
  }, []);

  React.useEffect(() => {
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
    setMoons(content);
  }, [user]);

  React.useEffect(() => {
    intervalOnline = setInterval(InternetErrMessenger, 3000);
    return () => {
      clearInterval(intervalOnline);
    };
  }, []);

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

      if (user.isFullPredict[user.sign]) btnHeight += h2.height * 2;

      setHeight(
        parentPos2.y - parentPos.y - (h2.y - parentPos2.y) / 2 - btnHeight
      );
    } catch (e) {}
  });

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
    } else {
      setIsAd(false);
    }
  };

  const onClickGetFullPredict = () => {
    setFullPredict(user.sign);
    setTextPredict(today[Object.keys(today)[user.sign]]);
  };

  const onClickWeekBtn = (scene) => {
    setScene(scene);
  };

  const onClickShowInfo = () => {
    seIsShowInfo(!isShowInfo);
  };

  const onClickCreateHistory = async () => {
    const predict = user.isFullPredict[user.sign]
      ? today[Object.keys(today)[user.sign]]
      : regexText(today[Object.keys(today)[user.sign]]);

    VideoStories.openPredictStoryBox(predict).then((res) => {
      console.log(res);
    });
  };

  const onClickWall = async () => {
    await bridge.send("VKWebAppShowWallPostBox", {
      message:
        textPredict +
        " \nУзнай, что звезды говорят тебе  https://vk.com/app51442719",
    });
  };

  const onClickMessage = async () => {
    await bridge.send("VKWebAppShare");
  };

  const onClickShowAd = async () => {
    if (isAd) {
      await setAdsData();
      await bridge.send("VKWebAppShowNativeAds", {
        ad_format: "interstitial",
      });
      setIsAd(!isAd);
      // await setStars();
    }
  };

  const onClickRemindMe = async () => {
    if (user.isClickedOnRemindMe) return;
    let data = await bridge.send("VKWebAppGetLaunchParams");
    if (data.vk_are_notifications_enabled) {
      addPushNotice();
      setRemindMe();
    } else {
      bridge.send("VKWebAppAllowNotifications").then((data) => {
        if (data.result) {
          addPushNotice();
          setRemindMe();
        }
      });
    }
  };

  if (isOnline !== true) {
    navigate("/404");
  }

  if (isLoading) {
    return (
      <div className="loader">
        <Loader />
      </div>
    );
  }

  return (
    <div className={`${styles.home} ${isShowInfo && styles.bg}`}>
      {isShowInfo && <ModalInfo onClick={onClickShowInfo} />}
      <div className={`${styles.root} ${isShowInfo && styles.bg}`}>
        <div className={styles.header}>
          <div>{moons}</div>
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
              {/*<button*/}
              {/*  className={`${styles.button} ${*/}
              {/*    scene === "week" && styles.selected*/}
              {/*  }`}*/}
              {/*  onClick={() => onClickWeekBtn("week")}*/}
              {/*>*/}
              {/*  Неделя*/}
              {/*</button>*/}
            </div>
          </div>
          {scene === "today" && (
            <div className={styles.predictContainer}>
              <div id="predict" className={styles.predict}>
                <Prediction
                  isFull={user.isFullPredict[user.sign]}
                  maxHeight={height}
                />
              </div>
              <div id="btn" className={styles.predictBtns}>
                <button
                  className={`${styles.button} 
                  ${user.stars >= 2 ? styles.selected : styles.disabled}`}
                  style={{
                    display: user.isFullPredict[user.sign] ? "none" : "block",
                  }}
                  disabled={user.stars < 2}
                  onClick={onClickGetFullPredict}
                >
                  <span className={styles.adBtnText}>
                    Читать полностью за 2 <img src={star} alt={"иконка"} />
                  </span>
                </button>
                <button
                  id="btn2"
                  className={`${styles.button}  ${
                    isAd ? styles.selected : styles.disabled
                  }`}
                  disabled={!isAd}
                  onClick={onClickShowAd}
                >
                  <span className={styles.adBtnText}>
                    {"Посмотреть рекламу"}
                    {" +2 "}
                    <img src={star} alt={"иконка"} />
                    {" +1 "}
                    <img src={stage1} alt={"иконка"} />
                  </span>
                </button>
              </div>
            </div>
          )}
          {scene === "tomorrow" && (
            <div className={styles.tomorrowContainer}>
              <span>
                Гороскоп на завтра будет <br /> доступен в{" "}
                <span className={styles.gradient}>10.00 по МСК</span>
              </span>
              <Timer />
              <RepostButton
                title={"Напомните мне"}
                onClick={onClickRemindMe}
                disabled={user.isClickedOnRemindMe}
              />
            </div>
          )}
        </div>
        <div className={styles.repost}>
          <span>Поделиться гороскопом</span>
          <div className={styles.repostBtns}>
            <RepostButton title={"На стену"} onClick={onClickWall} />
            <RepostButton title={"В историю"} onClick={onClickCreateHistory} />
            {/*<RepostButton title={"В личку"} onClick={onClickMessage} />*/}
          </div>
        </div>
      </div>
    </div>
  );
};
