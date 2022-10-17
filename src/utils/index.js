import clear from "../assets/images/moon/clear.png";
import stage1 from "../assets/images/moon/stage-1.png";
import stage2 from "../assets/images/moon/stage-2.png";
import stage3 from "../assets/images/moon/stage-3.png";
import stage4 from "../assets/images/moon/stage-4.png";
import stage5 from "../assets/images/moon/stage-5.png";
import star from "../assets/images/star.png";
import aquarius from "../assets/images/sign/aquarius.png";
import aries from "../assets/images/sign/aries.png";
import cancer from "../assets/images/sign/cancer.png";
import capricorn from "../assets/images/sign/capricorn.png";
import gemini from "../assets/images/sign/gemini.png";
import leo from "../assets/images/sign/leo.png";
import libra from "../assets/images/sign/libra.png";
import pisces from "../assets/images/sign/pisces.png";
import sagittarius from "../assets/images/sign/sagittarius.png";
import scorpio from "../assets/images/sign/scorpio.png";
import taurus from "../assets/images/sign/taurus.png";
import virgo from "../assets/images/sign/virgo.png";
import subAquarius from "../assets/images/icons/aquarius.png";
import subAries from "../assets/images/icons/aries.png";
import subCancer from "../assets/images/icons/cancer.png";
import subCapricorn from "../assets/images/icons/capricorn.png";
import subGemini from "../assets/images/icons/gemini.png";
import subLeo from "../assets/images/icons/leo.png";
import subLibra from "../assets/images/icons/libra.png";
import subPisces from "../assets/images/icons/pisces.png";
import subSagittarius from "../assets/images/icons/sagittarius.png";
import subScorpio from "../assets/images/icons/scorpio.png";
import subTaurus from "../assets/images/icons/taurus.png";
import subVirgo from "../assets/images/icons/virgo.png";
import scroll from "../assets/images/scroll.png";
import logo from "../assets/images/logo.png";
export const images = [
  logo,
  scroll,
  clear,
  stage1,
  stage2,
  stage3,
  stage4,
  stage5,
  star,
  aquarius,
  aries,
  cancer,
  capricorn,
  gemini,
  leo,
  libra,
  pisces,
  sagittarius,
  scorpio,
  taurus,
  virgo,
  subAquarius,
  subAries,
  subCancer,
  subCapricorn,
  subGemini,
  subLibra,
  subLeo,
  subPisces,
  subScorpio,
  subSagittarius,
  subTaurus,
  subVirgo,
];

export const interval = (date1, date2) => {
  if (date1 > date2) {
    // swap
    let result = this.interval(date2, date1);
    result.years = -result.years;
    result.months = -result.months;
    result.days = -result.days;
    result.hours = -result.hours;
    return result;
  }
  let result = {
    years: date2.getYear() - date1.getYear(),
    months: date2.getMonth() - date1.getMonth(),
    days: date2.getDate() - date1.getDate(),
    hours: date2.getHours() - date1.getHours(),
  };
  if (result.hours < 0) {
    result.days--;
    result.hours += 24;
  }
  if (result.days < 0) {
    result.months--;
    let copy1 = new Date(date1.getTime());
    copy1.setDate(32);
    result.days = 32 - date1.getDate() - copy1.getDate() + date2.getDate();
  }
  if (result.months < 0) {
    result.years--;
    result.months += 12;
  }
  return result;
};

export const loadImage = (image, cors = true) => {
  return new Promise((resolve) => {
    if (!image) return resolve(null);

    const img = new Image();

    img.crossOrigin = cors ? "use-credentials" : "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = image;
  });
};

export const regularText = (text) => {
  const count = text.split(" ").length;
  if (count < 44) return text;
  const REGEX = /((\s*\S+){44})([\s\S]*)/;
  return text ? REGEX.exec(text)[1] + "..." : "";
};

export const split = (text, limit) => {
  let i, length;
  let line, counter, word;
  let result = [""];

  text = text.split(" ");
  line = 0;
  counter = 0;

  for (i = 0, length = text.length; i < length; i++) {
    word = text[i];

    counter += word.length;

    if (counter > limit) {
      line++;
      counter = 0;
      result[line] = "";
    }

    result[line] += word + " ";
    counter++;
  }

  return result;
};
