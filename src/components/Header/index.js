import React from "react";
import logo from "../../assets/images/logo.png";
import star from "../../assets/images/star.png";
import styles from "./Header.module.scss";

export const Header = () => {
  return (
    <div className={styles.root}>
      <div className={styles.void}>
        <img className={styles.img} src={logo} />
      </div>
      <div className={styles.shop}>
        <span>5</span>
        <img src={star} />
        <p>пополнить</p>
      </div>
      <div className={styles.void}></div>
    </div>
  );
};
