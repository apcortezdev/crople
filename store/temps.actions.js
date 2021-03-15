import {
  SET_SETTINGS,
  SET_SETTINGS_NAME,
  SET_SETTINGS_EMAIL,
  SET_SETTINGS_IMAGE,
} from './actionConstants';

export const setSettings = (settings) => {
  return { type: SET_SETTINGS, settings: settings };
};

export const setSettingsUserName = (name) => {
  return { type: SET_SETTINGS_NAME, userName: name };
};

export const setSettingsUserEmail = (email) => {
  return { type: SET_SETTINGS_EMAIL, userEmail: email };
};

export const setSettingsImage = (image) => {
  return { type: SET_SETTINGS_IMAGE, userImage: image };
};
