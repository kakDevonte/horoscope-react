import React from "react";
import styles from "./ErrorPage.module.scss";

const ErrorPage = () => {
  return (
    <div className={styles.root}>
      <h1>Отсутствует интернет соединение</h1>
    </div>
  );
};

export default ErrorPage;
