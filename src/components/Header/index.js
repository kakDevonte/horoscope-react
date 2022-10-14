import React from "react";
import logo from "../../assets/images/logo.png";
import star from "../../assets/images/star.png";
import styles from "./Header.module.scss";
import { useLocation } from "react-router-dom";
import { useHoroscopeState } from "../../context/horoscope-context";

export const Header = () => {
  const { user } = useHoroscopeState();
  let location = useLocation();

  return (
    <div className={styles.root}>
      <div className={styles.void}>
        <img className={styles.img} src={logo} />
      </div>
      {location.pathname === "/home" && (
        <div className={styles.shop}>
          <span>{user.stars}</span>
          <img src={star} />
          {/*<p>пополнить</p>*/}
        </div>
      )}
      <div className={styles.void}></div>
    </div>
  );
};
