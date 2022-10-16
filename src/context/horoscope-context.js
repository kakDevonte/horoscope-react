import React from "react";
import { horoscopeAPI } from "../api/horoscope-api";

const SET_USER = "SET_USER";
const SET_SCENE = "SET_SCENE";
const SET_IS_AUTH = "SET_IS_AUTH";

const initialState = {
  user: { day: 3 },
  scene: "today", //'today tomorrow week'
  isAuth: false,
};
const HoroscopeContext = React.createContext();

export const HoroscopeContextProvider = (props) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const actions = {
    setUser: async (user) => {
      dispatch({
        type: SET_USER,
        payload: user,
      });
    },
    getUser: async (id) => {
      try {
        const data = await horoscopeAPI.getData(id);
        dispatch({
          type: SET_USER,
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
      const data = await horoscopeAPI.setSign(state.user.id, sign);
      dispatch({
        type: SET_USER,
        payload: data.data,
      });
    },
    setDays: async (day, stars) => {
      const data = await horoscopeAPI.setDays(state.user.id, day, stars);
      dispatch({
        type: SET_USER,
        payload: data.data,
      });
    },
    setStars: async (stars) => {
      const data = await horoscopeAPI.setStars(state.user.id, stars);
      dispatch({
        type: SET_USER,
        payload: data.data,
      });
    },
    setFullPredict: async (stars) => {
      const data = await horoscopeAPI.setFullPredict(state.user.id, stars);
      dispatch({
        type: SET_USER,
        payload: data.data,
      });
    },
    setDateOfGetStars: async (date) => {
      const data = await horoscopeAPI.setDateOfGetStars(state.user.id, date);
      dispatch({
        type: SET_USER,
        payload: data.data,
      });
    },
    setAdsData: async (date, count) => {
      const data = await horoscopeAPI.setAdsData(state.user.id, date, count);
      dispatch({
        type: SET_USER,
        payload: data.data,
      });
    },
    addPushNotice: async () => {
      await horoscopeAPI.addPushNotice(state.user.id);
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
  }
};

export const useHoroscopeState = () => {
  return React.useContext(HoroscopeContext).state;
};

export const useHoroscopeActions = () => {
  return React.useContext(HoroscopeContext).actions;
};
