import React from "react";

const SET_USER = "SET_USER";
const SET_SCENE = "SET_SCENE";

const initialState = {
  user: { day: 3 },
  scene: "today", //'today tomorrow week'
};
const HoroscopeContext = React.createContext();

export const HoroscopeContextProvider = (props) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const actions = {
    getUser: async (id) => {
      let currUser = { id, balance: 1000 };
      dispatch({
        type: SET_USER,
        payload: currUser,
      });
    },
    setScene: (scene) => {
      dispatch({
        type: SET_SCENE,
        payload: scene,
      });
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
  }
};

export const useHoroscopeState = () => {
  return React.useContext(HoroscopeContext).state;
};

export const useHoroscopeActions = () => {
  return React.useContext(HoroscopeContext).actions;
};
