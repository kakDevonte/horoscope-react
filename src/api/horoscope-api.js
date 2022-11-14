import axios from "axios";

const instance = axios.create({
  //baseURL: "http://localhost:3000/api/",
  baseURL: "https://297349.simplecloud.ru/api/",
  headers: {
    // Прикрепляем заголовок, отвечающий за параметры запуска.
    Authorization: `${window.location.search.slice(1)}`,
  },
});

export const horoscopeAPI = {
  getData() {
    return instance.get(`getData/`);
  },
  setSign(sign) {
    return instance.get(`setSign/${sign}`);
  },
  setDays() {
    return instance.get(`setDays/`);
  },
  setStars() {
    return instance.get(`setStars/`);
  },
  setFullPredict(sign) {
    return instance.get(`setFullPredict/${sign}`);
  },
  addPushNotice() {
    return instance.get("addPushNotice/");
  },
  setDateOfGetStars() {
    return instance.get("setDateOfGetStars/");
  },
  setAdsData() {
    return instance.get("setAdsData/");
  },
  setRemindMe() {
    return instance.get("remindMe/");
  },
};
