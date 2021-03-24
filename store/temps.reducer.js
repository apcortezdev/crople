import {
  CLEAR_SETTINGS,
  SET_SETTINGS_NAME,
  SET_SETTINGS_EMAIL,
  SET_SETTINGS_IMAGE,
  LOGOUT,
} from './actionConstants';

const initialState = {
  pending: false,
  settings: {
    name: null,
    email: null,
    image: null,
  },
};

export default (state = initialState, action) => {
  let newSettings = null;
  let pending = false;

  switch (action.type) {
    case CLEAR_SETTINGS:
      return initialState;
    case SET_SETTINGS_NAME:
      if (
        !!action.name ||
        !!state.settings.email ||
        !!state.settings.image
      ) {
        pending = true;
      }
      newSettings = {
        name: action.name,
        email: state.settings.email,
        image: state.settings.image,
      };
      return { ...state, settings: newSettings, pending: pending };
    case SET_SETTINGS_EMAIL:
      if (
        !!state.settings.name ||
        !!action.email ||
        !!state.settings.image
      ) {
        pending = true;
      }
      newSettings = {
        name: state.settings.name,
        email: action.email,
        image: state.settings.image,
      };
      return { ...state, settings: newSettings, pending: pending };
    case SET_SETTINGS_IMAGE:
      if (
        !!state.settings.name ||
        !!state.settings.email ||
        !!action.image
      ) {
        pending = true;
      }
      newSettings = {
        name: state.settings.name,
        email: state.settings.email,
        image: action.image,
      };
      return { ...state, settings: newSettings, pending: pending };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
