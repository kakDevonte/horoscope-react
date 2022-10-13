import React from "react";
import styles from "./RepostButton.module.scss";

const RepostButton = ({ title, onClick }) => {
  return (
    <div className={styles.box} onClick={onClick}>
      {title}
    </div>
  );
};

export default RepostButton;
