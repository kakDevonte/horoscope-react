import React from "react";
import styles from "./HomePage.module.scss";
import clear from "../../assets/images/moon/clear.png";
import stage1 from "../../assets/images/moon/stage-1.png";
import stage2 from "../../assets/images/moon/stage-2.png";
import stage3 from "../../assets/images/moon/stage-3.png";
import stage4 from "../../assets/images/moon/stage-4.png";
import stage5 from "../../assets/images/moon/stage-5.png";
import bgStory from "../../assets/images/sign/bg-story.png";
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
import { interval, loadImage, regularText, split } from "../../utils";
import bridge from "@vkontakte/vk-bridge";
import { Timer } from "../Timer";
import * as qs from "qs";
import { WeekPredict } from "../WeekPredict";

const moon = [stage1, stage2, stage3, stage4, stage5];
const MAX_DAY = 5;

const regexText = (text) => {
  const count = text.split(" ").length;
  if (count < 15) return text;
  const REGEX = /((\s*\S+){15})([\s\S]*)/;
  return text ? REGEX.exec(text)[1] + "..." : "";
};

export const HomePage = () => {
  const { scene, user, today } = useHoroscopeState();
  const {
    setScene,
    setFullPredict,
    setDays,
    setStars,
    setDateOfGetStars,
    addPushNotice,
    setAdsData,
  } = useHoroscopeActions();
  const [isShowInfo, seIsShowInfo] = React.useState(false);
  const [isAd, setIsAd] = React.useState(false);
  const [isTakeBonus, setIsTakeBonus] = React.useState(false);
  const [height, setHeight] = React.useState(0);
  const navigate = useNavigate();
  const [textPredict, setTextPredict] = React.useState(
    user.isFullPredict
      ? today[Object.keys(today)[user.sign]]
      : regexText(today[Object.keys(today)[user.sign]])
  );

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
    } else {
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
    }
  };

  const onClickGetFullPredict = () => {
    setFullPredict(user.stars);
    setTextPredict(today[Object.keys(today)[user.sign]]);
  };

  const onClickWeekBtn = (scene) => {
    setScene(scene);
  };

  const onClickShowInfo = () => {
    seIsShowInfo(!isShowInfo);
  };

  const onClickCreateHistory = async () => {
    let scale = 1;
    let baseFontSize = 36;
    let width = 1080;
    let height = 1920;

    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx.save();

    ctx.restore();
    const predict = { width: 0, height: 0, blob: "" };

    let fontSize = baseFontSize * scale;

    predict.width = width * 0.68 * scale;
    predict.height = height * 0.4 * scale;

    canvas.width = predict.width;
    canvas.height = predict.height;

    ctx.font = `${Math.floor(fontSize)}px Nasalization`;
    ctx.textAlign = "center";
    ctx.fillStyle = "white"; //44

    const data = split(regularText(textPredict), 28);
    const offset = data.length * fontSize - fontSize * 1.5;

    let interval = 0;
    data.forEach((phrase, index) => {
      ctx.fillText(
        phrase,
        canvas.width / 2,
        fontSize * index + interval + fontSize,
        predict.width
      );
      interval += 15;
    });

    predict.blob = canvas.toDataURL();

    const button = { width: 0, height: 0, blob: "" };

    ctx.restore();

    button.width = width * 0.775 * scale;
    button.height = height * 0.07 * scale;

    canvas.width = button.width;
    canvas.height = button.height;

    const fz = fontSize * 1.2 * scale,
      y = (button.height / 2 + fz / 2) * 0.9,
      gradient = ctx.createLinearGradient(0, 0, button.width, 0);

    gradient.addColorStop(0.5, "#0255D6");
    gradient.addColorStop(1, "#15FFE3");

    ctx.roundRect(0, 0, button.width, button.height, [10]);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.font = `${fz}px Nasalization`;
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText("Узнай, что звезды говорят тебе", button.width * 0.5, y);

    button.blob = canvas.toDataURL();

    const bg = await loadImage(bgStory);
    const btn = await loadImage(button.blob);
    const pre = await loadImage(predict.blob);
    let blobBtn;
    ctx.restore();

    canvas.width = width * scale;
    canvas.height = height * scale;

    if (bg) {
      ctx.drawImage(bg, 0, 0, width, height);
    }

    if (predict) {
      ctx.drawImage(pre, canvas.width * 0.17, canvas.height * 0.385);
    }

    const backgroundBlob = canvas.toDataURL();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    canvas.width = button.width;
    canvas.height = button.height;
    if (btn) {
      ctx.drawImage(btn, 0, 0);
    }

    blobBtn = canvas.toDataURL();

    await bridge.send("VKWebAppShowStoryBox", {
      background_type: "image",
      blob: backgroundBlob,
      stickers: [
        {
          sticker_type: "renderable",
          sticker: {
            blob: blobBtn,
            content_type: "image",
            transform: { translation_y: -0.22, gravity: "center_bottom" },
            can_delete: false,
            clickable_zones: [
              {
                action_type: "link",
                action: {
                  link: "https://vk.com/app51442719",
                  tooltip_text_key: "tooltip_open_post",
                },
                clickable_area: [
                  { x: 0, y: 0 },
                  {
                    x: button.width,
                    y: 0,
                  },
                  {
                    x: button.width,
                    y: button.height,
                  },
                  {
                    x: 0,
                    y: button.height,
                  },
                ],
              },
            ],
          },
        },
      ],
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
      await setAdsData(new Date(), user.countOfAdsPerDay + 1);
      await bridge.send("VKWebAppShowNativeAds", {
        ad_format: "interstitial",
      });
    } else if (isTakeBonus) {
      setDateOfGetStars(new Date());
    }
    await setDays(user.day + 1, user.stars);
    await setStars(user.stars + 2);
  };

  const onClickRemindMe = () => {
    let parsed = qs.parse(window.location.href);
    if (parseInt(parsed.vk_are_notifications_enabled)) {
      addPushNotice();
    } else {
      bridge.send("VKWebAppAllowNotifications").then((data) => {
        if (data.result) addPushNotice();
      });
    }
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
                  <span className={styles.adBtnText}>
                    Читать полностью за 2 <img src={star} />
                  </span>
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
                    {isAd ? "Посмотреть рекламу" : "Получить"}
                    {" +2 "}
                    <img src={star} />
                    {" +1"}
                    <img src={stage1} />
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
              <RepostButton title={"Напомните мне"} onClick={onClickRemindMe} />
            </div>
          )}
          {scene === "week" && (
            <div className={styles.tomorrowContainer}>
              <WeekPredict />
              {/*<span>Гороскоп на неделю на данный момент недоступен :)</span>*/}
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
