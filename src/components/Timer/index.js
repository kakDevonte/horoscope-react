import React from "react";
import styles from "./Timer.module.scss";
import {
  useHoroscopeActions,
  useHoroscopeState,
} from "../../context/horoscope-context";

const addZeros = (num) => {
  if (num < 10) {
    num = "0" + num;
  }
  return num;
};

const secondsToHms = (d) => {
  d = Number(d);
  let h = Math.floor(d / 3600);
  let m = Math.floor((d % 3600) / 60);
  let s = Math.floor((d % 3600) % 60);

  let hDisplay = h > 0 ? addZeros(h) + ":" : "00:";
  let mDisplay = m > 0 ? addZeros(m) + ":" : "00:";
  let sDisplay = s > 0 ? addZeros(s) + "" : "00";
  return hDisplay + mDisplay + sDisplay;
};

const secondsInDate = () => {
  let now = new Date();
  let date = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0)
  );
  const diff = date - new Date();
  return diff / 1000;
};

export const Timer = () => {
  const [seconds, setSeconds] = React.useState(secondsInDate());
  const [text, setText] = React.useState(secondsToHms(seconds));
  const { getUser } = useHoroscopeActions();
  const { isAuth, user } = useHoroscopeState();

  React.useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds <= 0) {
        setSeconds(secondsInDate());
        getUser(user.id);
      }

      setSeconds(seconds - 1);
      setText(secondsToHms(seconds - 1));
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  return <span className={styles.root}>{text}</span>;
};
