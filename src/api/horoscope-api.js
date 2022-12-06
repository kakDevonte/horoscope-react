import axios from "axios";
import qs from "qs";

let parsed = qs.parse(window.location.href);
const url = parsed.odr_enabled ? "vkcors://" : "https://";

const instance = axios.create({
  //baseURL: "http://localhost:3000/api/",
  baseURL: "https://297349.simplecloud.ru/api/",
  headers: {
    // Прикрепляем заголовок, отвечающий за параметры запуска.
    //`${window.location.search.slice(1)}`,
    //` ${window.location.search.slice(1)}`,
    Authorization: `${window.location.search.slice(1)}`,
    //"vk_access_token_settings=friends,status&vk_app_id=51442719&vk_are_notifications_enabled=1&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=catalog_recent&vk_ts=1669782842&vk_user_id=224001505&sign=5ajT_TWgr7qO8S8QQnQZcQ6G__xSi1vKZtrJpn_Edh4", //`${window.location.search.slice(1)}`,
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
