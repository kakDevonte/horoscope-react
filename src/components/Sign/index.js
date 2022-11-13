import React from "react";
import styles from "./Sign.module.scss";
import useLongPress from "../../utils/useLongPress";

export const Sign = ({ name, image, onClick, isActive }) => {
  const [onStart, onEnd] = useLongPress(onClick);

  return (
    <div
      onTouchStart={onStart}
      onTouchEnd={onEnd}
      className={`${styles.root} ${isActive && styles.active}`}
      onClick={onClick}
    >
      <img src={image} />
      <span>{name}</span>
    </div>
  );
};
