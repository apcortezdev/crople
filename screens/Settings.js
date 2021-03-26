import { AntDesign, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  Avatar,
  Button,
  Caption,
  Dialog,
  Paragraph,
  TextInput,
  Title,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker from '../components/ImagePicker';
import MenuBase from '../components/MenuBase';
import SwitchComponent from '../components/SwitchComponent';
import {
  validateIsEmail,
  validateNameSize,
  validateNameSlur,
} from '../components/Validations';
import { resetPassword } from '../store/auth.actions';
import { setTheme } from '../store/crople.actions';
import {
  clearSettings,
  setSettingsImage,
  setSettingsUserEmail,
  setSettingsUserName,
} from '../store/temps.actions';
import { logout, updateUserData } from '../store/user.actions';
import { PropTypes } from 'prop-types';
import PasswordConfirm from '../components/PasswordConfirm';

const Settings = (props) => {
  const dispatch = useDispatch();
  const { colors, fonts } = useTheme();

  const opacityOpen = useRef(new Animated.Value(0)).current;
  const scaleOpen = useRef(new Animated.Value(0.9)).current;
  const openStylesAnimation = {
    opacity: opacityOpen,
    transform: [{ scale: scaleOpen }],
  };

  const oldUserName = useSelector((state) => state.user.name);
  const tempUserName = useSelector((state) => state.temps.settings.name);
  const [userName, setUserName] = useState(
    tempUserName ? tempUserName : oldUserName
  );
  const [hasUserNameChanged, setHasUserNameChanged] = useState(
    userName === oldUserName ? false : true
  );

  const oldUserEmail = useSelector((state) => state.user.email);
  const tempUserEmail = useSelector((state) => state.temps.settings.email);
  const [userEmail, setUserEmail] = useState(
    tempUserEmail ? tempUserEmail : oldUserEmail
  );
  const [hasUserEmailChanged, setHasUserEmailChanged] = useState(
    userEmail === oldUserEmail ? false : true
  );

  const oldUserImage = useSelector((state) => state.user.image);
  const tempImage = useSelector((state) => state.temps.settings.image);
  const [userImage, setUserImage] = useState(
    tempImage ? tempImage.uri : oldUserImage
  );
  const [hasUserImageChanged, setHasUserImageChanged] = useState(
    userImage === oldUserImage ? false : true
  );

  const darkTheme = useSelector((state) => state.game.darkTheme);
  const [darkMode, setDarkMode] = useState(
    darkTheme === 'on' ? 0 : darkTheme === 'auto' ? 1 : 2
  );
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);
  const [passConfirmationVisible, setPassConfirmationVisible] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const openAnimation = Animated.parallel([
    Animated.timing(scaleOpen, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }),
    Animated.timing(opacityOpen, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }),
  ]);

  const setImage = () => {
    setImagePickerVisible(true);
  };

  const choseImageModal = () => {
    setImagePickerVisible(!imagePickerVisible);
  };

  const setPickedImage = (pickedImage) => {
    setImagePickerVisible(false);
    if (oldUserImage === pickedImage.uri) {
      setHasUserImageChanged(false);
      dispatch(setSettingsImage(null));
    } else {
      dispatch(setSettingsImage(pickedImage));
      setHasUserImageChanged(true);
    }
    setUserImage(pickedImage.uri);
  };

  const changePasswordButton = () => {
    setIsDialogVisible(true);
  };

  const changePassword = () => {
    dispatch(resetPassword(userEmail)).then(
      () => {
        dispatch(logout());
      },
      () => {
        Alert.alert('Sorry', 'We had a problem. Please try again later!', [
          { text: 'Ok' },
        ]);
      }
    );
  };

  // VALIDATION>
  const setName = (name) => {
    if (name.trim().replace(/ /g, '') === oldUserName) {
      setHasUserNameChanged(false);
      dispatch(setSettingsUserName(null));
    } else {
      setHasUserNameChanged(true);
      dispatch(setSettingsUserName(name));
    }
    setUserName(name.trim().replace(/ /g, ''));
  };

  const setEmail = (email) => {
    if (email.trim().replace(/ /g, '') === oldUserEmail) {
      setHasUserEmailChanged(false);
      dispatch(setSettingsUserEmail(null));
    } else {
      setHasUserEmailChanged(true);
      dispatch(setSettingsUserEmail(email));
    }
    setUserEmail(email.trim().replace(/ /g, ''));
  };

  const nameOnBlur = () => {
    if (userName.length === 0) {
      setUserName(oldUserName);
      setHasUserNameChanged(false);
      return;
    }
  };
  const emailOnBlur = () => {
    if (userEmail.length === 0) {
      setUserEmail(oldUserEmail);
      setHasUserEmailChanged(false);
      return;
    }
  };

  const saveChanges = () => {
    Alert.alert('Save', 'Would you like to save all changes?', [
      { text: 'No' },
      { text: 'Yes', onPress: validateForm },
    ]);
  };

  const validateForm = () => {
    if (hasUserNameChanged || hasUserEmailChanged || hasUserImageChanged) {
      if (!validateNameSlur(userName)) {
        Alert.alert("That's offensive...", "Sorry, you can't use this name.", [
          { text: 'Ok' },
        ]);
        return;
      }
      if (!validateNameSize(userName)) {
        Alert.alert('Too short...', 'Name has to have at least 4 letters.', [
          { text: 'Ok' },
        ]);
        return;
      }
      if (!validateIsEmail(userEmail)) {
        Alert.alert('Not an Email.', 'Please chose a valid e-mail address.', [
          { text: 'Ok' },
        ]);
        return;
      }
      setPassConfirmationVisible(true);
    } else {
      Alert.alert('Save', "Well.. looks like there's nothing to be saved.", [
        { text: 'Ok' },
      ]);
    }
  };
  // <VALIDATION

  const confirmAndSave = async () => {
    setPassConfirmationVisible(false);
    dispatch(updateUserData(passwordConfirmation)).then(() => {
      Alert.alert('All good', 'All changes have been saved!', [{ text: 'Ok' }]);
    }).catch((err) => {
      Alert.alert('Ops..', err.message, [{ text: 'Ok' }]);
    });
  };

  const discartAndBack = () => {
    dispatch(clearSettings());
    props.onGoBack();
  };

  const onPressLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'No' },
      { text: 'Yes', onPress: out },
    ]);
  };

  const out = () => {
    dispatch(logout());
    props.onGoBack();
  };

  const discartChanges = () => {
    if (hasUserNameChanged || hasUserEmailChanged || hasUserImageChanged) {
      Alert.alert('Discart', 'Wish to discart all changes?', [
        { text: 'No' },
        { text: 'Yes', onPress: discartAndBack, style: 'cancel' },
      ]);
    } else {
      props.onGoBack();
    }
  };

  const setDarkTheme = (value) => {
    try {
      dispatch(setTheme(value === 0 ? 'on' : value === 1 ? 'auto' : 'off'));
      setDarkMode(value);
    } catch (err) {
      Alert.alert('Sorry', 'Something wrong is not right', { text: 'Oh No!' });
    }
  };

  useEffect(() => {
    openAnimation.start();
  }, [openAnimation]);

  return (
    <View style={styles.screen}>
      <MenuBase onPressMenu={props.onGoBack} />
      <View style={styles.settingsView}>
        <Animated.View
          style={[styles.settingsCard(colors), openStylesAnimation]}
        >
          <View style={styles.sectionTitleContaiter(colors)}>
            <Title style={styles.title(colors, fonts)}>Profile</Title>
            {(hasUserNameChanged ||
              hasUserEmailChanged ||
              hasUserImageChanged) && (
              <View style={styles.changeMessageContainer}>
                <FontAwesome5
                  name="exclamation-circle"
                  size={15}
                  color={colors.highlight}
                />
                <Caption style={styles.changeMessage(colors)}>
                  Changes pending!
                </Caption>
              </View>
            )}
          </View>
          <ScrollView style={styles.settingsScrollView}>
            <View style={styles.mainSection}>
              <View style={styles.imageContainer}>
                <TouchableWithoutFeedback onPress={setImage}>
                  <View>
                    {!userImage ? (
                      <Avatar.Icon
                        size={80}
                        icon={() => (
                          <AntDesign
                            name="user"
                            size={50}
                            color={colors.backgroundIcon}
                          />
                        )}
                        theme={{ colors }}
                      />
                    ) : (
                      <Avatar.Image
                        size={80}
                        source={{
                          uri: userImage,
                        }}
                        theme={{ colors }}
                      />
                    )}
                    <View
                      style={
                        hasUserImageChanged
                          ? [styles.badge, styles.changedImage(colors)]
                          : [styles.badge, styles.NotchangedImage(colors)]
                      }
                    >
                      <MaterialIcons
                        name="edit"
                        size={24}
                        color={colors.backgroundIcon}
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
              <View style={styles.textInputHolder}>
                <TextInput
                  label="Name (10 letters, no space!)"
                  value={userName}
                  onChangeText={(text) => setName(text)}
                  onBlur={nameOnBlur}
                  underlineColor={
                    hasUserNameChanged ? colors.highlight : colors.accent
                  }
                  autoCapitalize={'none'}
                  maxLength={10}
                  theme={{ colors }}
                />
              </View>
              <View style={styles.textInputHolder}>
                <TextInput
                  label="E-mail"
                  value={userEmail}
                  onChangeText={(text) => setEmail(text)}
                  onBlur={emailOnBlur}
                  autoCapitalize={'none'}
                  underlineColor={
                    hasUserEmailChanged ? colors.highlight : colors.accent
                  }
                  theme={{ colors }}
                />
              </View>
              <View style={styles.sectionButtonPassword}>
                <TouchableNativeFeedback onPress={changePasswordButton}>
                  <View style={styles.buttonSave(colors)}>
                    <Text style={styles.text}>Change Password</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
              <View style={styles.sectionButtonSave}>
                <View style={styles.wrapButton}>
                  <TouchableNativeFeedback onPress={discartChanges}>
                    <View style={styles.buttonDiscart(colors)}>
                      <Text style={styles.text}>Discart</Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
                <View style={styles.wrapButton}>
                  <TouchableNativeFeedback onPress={saveChanges}>
                    <View style={styles.buttonSave(colors)}>
                      <Text style={styles.text}>Save</Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              </View>
              <View style={styles.logoutTextView}>
                <TouchableWithoutFeedback onPress={onPressLogout}>
                  <Text style={styles.logoutText(colors, fonts)}>Logout!</Text>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </ScrollView>
          <View style={styles.sectionTitleContaiter(colors)}>
            <Title style={styles.title(colors, fonts)}>Preferences</Title>
          </View>
          <View style={styles.mainSection}>
            <Title style={styles.titlePreference}>Dark Theme</Title>
            <View style={styles.preferencesLine}>
              <Title style={styles.titlePreference}>
                {darkMode === 0 ? 'On' : darkMode === 1 ? 'Auto' : 'Off'}
              </Title>
              <SwitchComponent value={darkMode} onValueChange={setDarkTheme} />
            </View>
          </View>
        </Animated.View>
      </View>
      <Dialog
        visible={isDialogVisible}
        onDismiss={() => setIsDialogVisible(false)}
      >
        <Dialog.Title>Change of Password</Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            This will log you out and send you an e-mail for password reset.
            Would you like to continue?
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setIsDialogVisible(false)}>Cancel</Button>
          <Button onPress={changePassword}>Continue</Button>
        </Dialog.Actions>
      </Dialog>
      <ImagePicker
        visible={imagePickerVisible}
        onSetImage={setPickedImage}
        onDismiss={choseImageModal}
      />
      <PasswordConfirm
        value={passwordConfirmation}
        visible={passConfirmationVisible}
        onConfirmPassword={() => setPassConfirmationVisible(false)}
        onDismiss={confirmAndSave}
        onChangeText={(text) => setPasswordConfirmation(text)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
    paddingHorizontal: Dimensions.get('window').width * 0.03,
    paddingTop: Dimensions.get('window').height * 0.03,
  },
  settingsView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    width: '100%',
    height: '90%',
  },
  settingsCard: (colors) => ({
    backgroundColor: colors.card,
    opacity: 0.99,
    borderRadius: 30,
    width: '90%',
    height: '100%',
    alignItems: 'center',
    padding: '5%',
  }),
  settingsScrollView: {
    width: '100%',
  },
  sectionButtonPassword: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sectionButtonSave: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  wrapButton: {
    borderRadius: 5,
    overflow: 'hidden',
    width: '47%',
  },
  title: (colors, fonts) => ({
    fontFamily: fonts.regular,
    fontSize: 20,
    color: colors.text,
  }),
  imageContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 7,
  },
  badge: {
    position: 'absolute',
    top: 50,
    left: 50,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputHolder: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  preferencesLine: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  titlePreference: {
    fontFamily: 'OpenSans',
    fontSize: 15,
    color: '#808080',
  },
  text: {
    fontFamily: 'OpenSans',
    color: 'white',
    fontSize: 14,
  },
  mainSection: {
    width: '100%',
    marginTop: 25,
    marginBottom: 10,
  },
  buttonSave: (colors) => ({
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    height: 40,
  }),
  buttonDiscart: (colors) => ({
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.accent,
    height: 40,
  }),
  sectionTitleContaiter: (colors) => ({
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  }),
  changedImage: (colors) => ({
    backgroundColor: colors.highlight,
  }),
  NotchangedImage: (colors) => ({
    backgroundColor: colors.border,
  }),
  changeMessage: (colors) => ({
    marginLeft: 10,
    color: colors.highlight,
  }),
  changeMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutTextView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
  },
  logoutText: (colors, fonts) => ({
    fontFamily: fonts.regular,
    color: colors.primary,
    fontSize: 14,
    textDecorationLine: 'underline',
  }),
  keyboardAvoidingStyle: {
    flex: 1,
  },
});

Settings.propTypes = {
  onGoBack: PropTypes.func.isRequired,
};

export default Settings;
