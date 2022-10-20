import React from "react";
import { horoscopeAPI } from "../api/horoscope-api";

const SET_USER = "SET_USER";
const SET_SCENE = "SET_SCENE";
const SET_IS_AUTH = "SET_IS_AUTH";
const SET_PREDICT = "SET_PREDICT";

let horoscopeIsNotMade = "Астролог уже составляет ваш гороскоп, зайдите позже.";

const predict = {
  aries: horoscopeIsNotMade,
  taurus: horoscopeIsNotMade,
  gemini: horoscopeIsNotMade,
  cancer: horoscopeIsNotMade,
  leo: horoscopeIsNotMade,
  virgo: horoscopeIsNotMade,
  libra: horoscopeIsNotMade,
  scorpio: horoscopeIsNotMade,
  sagittarius: horoscopeIsNotMade,
  capricorn: horoscopeIsNotMade,
  aquarius: horoscopeIsNotMade,
  pisces: horoscopeIsNotMade,
  ophiuchus: horoscopeIsNotMade,
};

const initialState = {
  user: {
    id: 1,
    stars: 0,
    days: 0,
    newcomer: true,
    sign: 0,
    isGetTodayDay: "",
    isFullPredict: true,
    dateOfGetStars: "",
    countOfAdsPerDay: 0,
    dateOfShowAds: "",
  },
  scene: "today", //'today tomorrow week'
  isAuth: false,
  today: predict,
  tomorrow: predict,
};
const HoroscopeContext = React.createContext();

export const HoroscopeContextProvider = (props) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const actions = {
    getUser: async (id) => {
      try {
        const data = await horoscopeAPI.getData(id);
        dispatch({
          type: SET_USER,
          payload: data.data,
        });
        dispatch({
          type: SET_PREDICT,
          payload: data.data,
        });
        dispatch({
          type: SET_IS_AUTH,
          payload: true,
        });
      } catch (e) {
        dispatch({
          type: SET_IS_AUTH,
          payload: false,
        });
      }
    },
    setScene: (scene) => {
      dispatch({
        type: SET_SCENE,
        payload: scene,
      });
    },
    setIsAuth: (state) => {
      dispatch({
        type: SET_IS_AUTH,
        payload: state,
      });
    },
    setSign: async (sign) => {
      try {
        const data = await horoscopeAPI.setSign(state.user.id, sign);
        dispatch({
          type: SET_USER,
          payload: data.data,
        });
      } catch (e) {}
    },
    setDays: async (day, stars) => {
      try {
        const data = await horoscopeAPI.setDays(state.user.id, day, stars);
        dispatch({
          type: SET_USER,
          payload: data.data,
        });
      } catch (e) {}
    },
    setStars: async (stars) => {
      try {
        const data = await horoscopeAPI.setStars(state.user.id, stars);
        dispatch({
          type: SET_USER,
          payload: data.data,
        });
      } catch (e) {}
    },
    setFullPredict: async (stars) => {
      try {
        const data = await horoscopeAPI.setFullPredict(state.user.id, stars);
        dispatch({
          type: SET_USER,
          payload: data.data,
        });
      } catch (e) {}
    },
    setDateOfGetStars: async (date) => {
      try {
        const data = await horoscopeAPI.setDateOfGetStars(state.user.id, date);
        dispatch({
          type: SET_USER,
          payload: data.data,
        });
      } catch (e) {}
    },
    setAdsData: async (date, count) => {
      try {
        const data = await horoscopeAPI.setAdsData(state.user.id, date, count);
        dispatch({
          type: SET_USER,
          payload: data.data,
        });
      } catch (e) {}
    },
    addPushNotice: async () => {
      try {
        await horoscopeAPI.addPushNotice(state.user.id);
      } catch (e) {}
    },
  };

  return (
    <HoroscopeContext.Provider value={{ state, actions }}>
      {props.children}
    </HoroscopeContext.Provider>
  );
};

const reducer = (state, action) => {
  switch (action.type) {
    case SET_USER: {
      return { ...state, user: action.payload };
    }
    case SET_SCENE: {
      return { ...state, scene: action.payload };
    }
    case SET_IS_AUTH: {
      return { ...state, isAuth: action.payload };
    }
    case SET_PREDICT: {
      return {
        ...state,
        today: action.payload.today,
        tomorrow: action.payload.tomorrow,
      };
    }
  }
};

export const useHoroscopeState = () => {
  return React.useContext(HoroscopeContext).state;
};

export const useHoroscopeActions = () => {
  return React.useContext(HoroscopeContext).actions;
};
