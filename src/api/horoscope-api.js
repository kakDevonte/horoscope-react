import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api/",
  //baseURL: "https://297349.simplecloud.ru/api/",
  headers: {
    // Прикрепляем заголовок, отвечающий за параметры запуска.
    Authorization: `${window.location.search.slice(1)}`,
  },
});

export const horoscopeAPI = {
  getData(id) {
    return instance.post(`getData/`, { id });
  },
  setSign(id, sign) {
    return instance.post(`setSign/`, { id, sign });
  },
  setDays(id, day, stars) {
    return instance.post(`setDays/`, { id, day, stars });
  },
  setStars(id, stars) {
    return instance.post(`setStars/`, { id, stars });
  },
  setFullPredict(id, stars) {
    return instance.post(`setFullPredict/`, { id, stars });
  },
  addPushNotice(id) {
    return instance.post("addPushNotice/", { id });
  },
  setDateOfGetStars(id, dateOfGetStars) {
    return instance.post("setDateOfGetStars/", { id, dateOfGetStars });
  },
  setAdsData(id, dateOfShowAds, countOfAdsPerDay) {
    return instance.post("setAdsData/", {
      id,
      dateOfShowAds,
      countOfAdsPerDay,
    });
  },
};
