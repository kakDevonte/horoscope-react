import React from "react";

const week = ["Пн.", "Вт.", "Ср.", "Чт.", "Пт.", "Сб.", "Вс."];
export const WeekPredict = () => {
  const getPredicts = () => {
    const content = [];
    const now = new Date();

    for (let i = 0; i <= week; i++) {
      if (now.getDay() >= i + 1) {
        console.log(i + 1);
      }
    }
  };
  return <div>{getPredicts()}</div>;
};
