import React from "react";
import styles from "./RepostButton.module.scss";

const RepostButton = ({ title, onClick, disabled }) => {
  return (
    <div
      className={`${styles.box} ${disabled && styles.disabled}`}
      onClick={onClick}
    >
      {title}
    </div>
  );
};

export default RepostButton;
