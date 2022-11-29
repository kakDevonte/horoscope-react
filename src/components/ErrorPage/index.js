import React from "react";
import styles from "./ErrorPage.module.scss";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = React.useState(false);
  let interval = null;

  const InternetErrMessenger = () => setIsOnline(navigator.onLine === true);

  React.useEffect(() => {
    interval = setInterval(InternetErrMessenger, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (isOnline) {
    navigate("/");
  }

  return (
    <div className={styles.root}>
      <h1>Отсутствует интернет соединение</h1>
    </div>
  );
};

export default ErrorPage;
