import {
  SET_SETTINGS_NAME,
  SET_SETTINGS_EMAIL,
  SET_SETTINGS_IMAGE,
  CLEAR_SETTINGS
} from './actionConstants';

export const clearSettings = () => {
  return { type: CLEAR_SETTINGS };
};

export const setSettingsUserName = (name) => {
  return { type: SET_SETTINGS_NAME, name: name };
};

export const setSettingsUserEmail = (email) => {
  return { type: SET_SETTINGS_EMAIL, email: email };
};

export const setSettingsImage = (image) => {
  return { type: SET_SETTINGS_IMAGE, image: image };
};
