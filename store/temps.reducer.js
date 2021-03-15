import {
  SET_SETTINGS,
  SET_SETTINGS_NAME,
  SET_SETTINGS_EMAIL,
  SET_SETTINGS_IMAGE,
} from './actionConstants';

const initialState = {
  pending: false,
  settings: {
    userName: null,
    userEmail: null,
    userImage: null,
  },
};

export default (state = initialState, action) => {
  let newSettings = null;
  let pending = false;

  switch (action.type) {
    case SET_SETTINGS:
      if (!!action.userName || !!action.userEmail || !!action.userImage) {
        pending = true;
      }
      return { ...state, settings: action.settings, pending: pending };
    case SET_SETTINGS_NAME:
      if (!!action.userName || !!state.settings.userEmail || !!state.settings.userImage) {
        pending = true;
      }
      newSettings = {
        userName: action.userName,
        userEmail: state.settings.userEmail,
        userImage: state.settings.userImage,
      };
      return { ...state, settings: newSettings, pending: pending };
    case SET_SETTINGS_EMAIL:
      if (!!state.settings.userName || !!action.userEmail || !!state.settings.userImage) {
        pending = true;
      }
      newSettings = {
        userName: state.settings.userName,
        userEmail: action.userEmail,
        userImage: state.settings.userImage,
      };
    return { ...state, settings: newSettings, pending: pending };
    case SET_SETTINGS_IMAGE:
      if (!!state.settings.userName || !!state.settings.userEmail || !!action.userImage) {
        pending = true;
      }
      newSettings = {
        userName: state.settings.userName,
        userEmail: state.settings.userEmail,
        userImage: action.userImage,
      };
      return { ...state, settings: newSettings, pending: pending };
    default:
      return state;
  }
};
