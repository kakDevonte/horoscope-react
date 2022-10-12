import React from "react";
import styles from "./Sign.module.scss";

export const Sign = ({ name, image, onClick, isActive }) => {
  return (
    <div
      className={`${styles.root} ${isActive && styles.active}`}
      onClick={onClick}
    >
      <img src={image} />
      <span>{name}</span>
    </div>
  );
};
