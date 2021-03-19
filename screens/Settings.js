import { AntDesign, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
  Animated,
} from 'react-native';
import {
  Avatar,
  Button,
  Caption,
  Dialog,
  Paragraph,
  Switch,
  TextInput,
  Title,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import MenuReturn from '../components/MenuReturn';
import ImagePicker from '../components/ImagePicker';
import { resetPassword } from '../store/auth.actions';
import { logout, updateUserData } from '../store/user.actions';
import {
  setSettingsUserName,
  setSettingsUserEmail,
  clearSettings,
  setSettingsImage,
} from '../store/temps.actions';
import {
  validateNameSize,
  validateNameSlur,
  validateIsEmail,
} from '../components/Validations';
import { useTheme } from '@react-navigation/native';
import MenuBase from '../components/MenuBase';
import { setTheme } from '../store/crople.actions';

const Settings = (props) => {
  const dispatch = useDispatch();
  const { colors, fonts } = useTheme();

  const opacityOpen = useRef(new Animated.Value(0)).current;
  const scaleOpen = useRef(new Animated.Value(0.9)).current;
  const openStylesAnimation = {
    opacity: opacityOpen,
    transform: [{ scale: scaleOpen }],
  };

  const oldUserName = useSelector((state) => state.user.userName);
  const [userName, setUserName] = useState(
    useSelector((state) => state.temps.settings.userName)
      ? useSelector((state) => state.temps.settings.userName)
      : useSelector((state) => state.user.userName)
  );
  const [hasUserNameChanged, setHasUserNameChanged] = useState(
    userName === oldUserName ? false : true
  );

  const oldUserEmail = useSelector((state) => state.user.userEmail);
  const [userEmail, setUserEmail] = useState(
    useSelector((state) => state.temps.settings.userEmail)
      ? useSelector((state) => state.temps.settings.userEmail)
      : useSelector((state) => state.user.userEmail)
  );
  const [hasUserEmailChanged, setHasUserEmailChanged] = useState(
    userEmail === oldUserEmail ? false : true
  );

  const oldUserImage = useSelector((state) => state.user.userImage);
  const [userImage, setUserImage] = useState(
    useSelector((state) => state.temps.settings.userImage)
      ? useSelector((state) => state.temps.settings.userImage.uri)
      : useSelector((state) => state.user.userImage)
  );
  const [hasUserImageChanged, setHasUserImageChanged] = useState(
    userImage === oldUserImage ? false : true
  );

  const [isDarkThemeOn, setisDarkThemeOn] = useState(false);
  const [isDarkThemeOff, setisDarkThemeOff] = useState(false);
  const [isDarkThemeAuto, setisDarkThemeAuto] = useState(true);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);

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
      { text: 'Yes', onPress: saveChangesToDb },
    ]);
  };

  const saveChangesToDb = async () => {
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
      dispatch(updateUserData(discartAndBack)).catch((err) => {
        Alert.alert('Ops..', err.message, [{ text: 'Ok' }]);
      });
    } else {
      Alert.alert('Save', "Well.. looks like there's nothing to be saved.", [
        { text: 'Ok' },
      ]);
    }
  };
  // <VALIDATION

  const discartAndBack = () => {
    dispatch(clearSettings());
    props.navigation.goBack();
  };

  const discartChanges = () => {
    Alert.alert('Discart', 'Wish to discart all changes?', [
      { text: 'No' },
      { text: 'Yes', onPress: discartAndBack, style: 'cancel' },
    ]);
  };

  const setDarkOn = () => {
    if (isDarkThemeOn) {
      setisDarkThemeOn(false);
      setisDarkThemeOff(false);
      setisDarkThemeAuto(true);
      dispatch(setTheme('auto'));
    } else {
      setisDarkThemeOn(true);
      setisDarkThemeOff(false);
      setisDarkThemeAuto(false);
      dispatch(setTheme('on'));
    }
  };
  const setDarkOff = () => {
    if (isDarkThemeOff) {
      setisDarkThemeOn(false);
      setisDarkThemeOff(false);
      setisDarkThemeAuto(true);
      dispatch(setTheme('auto'));
    } else {
      setisDarkThemeOn(false);
      setisDarkThemeOff(true);
      setisDarkThemeAuto(false);
      dispatch(setTheme('off'));
    }
  };
  const setDarkAuto = () => {
    if (isDarkThemeAuto) {
      setisDarkThemeOn(true);
      setisDarkThemeOff(false);
      setisDarkThemeAuto(false);
      dispatch(setTheme('on'));
    } else {
      setisDarkThemeOn(false);
      setisDarkThemeOff(false);
      setisDarkThemeAuto(true);
      dispatch(setTheme('auto'));
    }
  };

  useEffect(() => {
    openAnimation.start();
  }, []);

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
                    {!!!userImage ? (
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
            </View>
          </ScrollView>
          <View style={styles.sectionTitleContaiter(colors)}>
            <Title style={styles.title(colors, fonts)}>Preferences</Title>
          </View>
          <View style={styles.mainSection}>
            <Title style={styles.titlePreference}>Dark Theme</Title>
            <View style={styles.preferencesLine}>
              <Title style={styles.titlePreference}>On</Title>
              <Switch
                value={isDarkThemeOn}
                onValueChange={setDarkOn}
                color="#F63A65"
              />
            </View>
            <View style={styles.preferencesLine}>
              <Title style={styles.titlePreference}>Off</Title>
              <Switch
                value={isDarkThemeOff}
                onValueChange={setDarkOff}
                color="#F63A65"
              />
            </View>
            <View style={styles.preferencesLine}>
              <Title style={styles.titlePreference}>Auto</Title>
              <Switch
                value={isDarkThemeAuto}
                onValueChange={setDarkAuto}
                color="#F63A65"
              />
            </View>
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
    marginVertical: 25,
  },
  buttonSave: (colors) => ({
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    height: 40,
    borderRadius: 5,
  }),
  buttonDiscart: (colors) => ({
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.accent,
    height: 40,
    borderRadius: 5,
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
});

export default Settings;
