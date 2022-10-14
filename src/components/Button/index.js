import React from "react";
import styles from "./Button.module.scss";

export const Button = ({ title, onClick, disabled }) => {
  return (
    <button className={styles.btnGrad} onClick={onClick} disabled={disabled}>
      {title}
    </button>
  );
};
