import React from "react";
import styles from "./Loader.module.scss";

export const Loader = () => {
  return (
    <div className={styles.spinner}>
      <div className={styles.spinnerIcon}></div>
    </div>
  );
};
