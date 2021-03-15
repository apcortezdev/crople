import { AntDesign, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Alert,
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
  Switch,
  TextInput,
  Title,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import MenuReturn from '../components/MenuReturn';
import ImagePicker from '../components/ImagePicker';
import { logout, resetPassword, updateUserData } from '../store/auth.actions';
import {
  setSettingsUserName,
  setSettingsUserEmail,
  setSettings,
  setSettingsImage,
} from '../store/temps.actions';
import {
  validateNameSize,
  validateNameSlur,
  validateIsEmail,
} from '../components/Validations';

const Settings = (props) => {
  const dispatch = useDispatch();

  const oldUserName = useSelector((state) => state.game.userName);
  const [userName, setUserName] = useState(
    useSelector((state) => state.temps.settings.userName)
      ? useSelector((state) => state.temps.settings.userName)
      : useSelector((state) => state.game.userName)
  );
  const [hasUserNameChanged, setHasUserNameChanged] = useState(
    userName === oldUserName ? false : true
  );

  const oldUserEmail = useSelector((state) => state.game.userEmail);
  const [userEmail, setUserEmail] = useState(
    useSelector((state) => state.temps.settings.userEmail)
      ? useSelector((state) => state.temps.settings.userEmail)
      : useSelector((state) => state.game.userEmail)
  );
  const [hasUserEmailChanged, setHasUserEmailChanged] = useState(
    userEmail === oldUserEmail ? false : true
  );

  const oldUserImage = useSelector((state) => state.game.userImage);
  const [userImage, setUserImage] = useState(
    useSelector((state) => state.temps.settings.userImage)
      ? useSelector((state) => state.temps.settings.userImage.uri)
      : useSelector((state) => state.game.userImage)
  );
  const [hasUserImageChanged, setHasUserImageChanged] = useState(
    userImage === oldUserImage ? false : true
  );

  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);

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

      try {
        dispatch(updateUserData(discartAndBack));
      } catch (err) {
        Alert.alert('Ops..', err.message, [{ text: 'Ok' }]);
      }
    } else {
      Alert.alert('Save', "Well.. looks like there's nothing to be saved.", [
        { text: 'Ok' },
      ]);
    }
  };
  // <VALIDATION

  const discartAndBack = () => {
    const settings = {
      userName: null,
      userEmail: null,
      userImage: null,
    };
    dispatch(setSettings(settings));
    props.navigation.goBack();
  };

  const discartChanges = () => {
    Alert.alert('Discart', 'Wish to discart all changes?', [
      { text: 'No' },
      { text: 'Yes', onPress: discartAndBack, style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.gradientScreen}>
        <LinearGradient
          colors={['#F63A65', '#f9ab8f']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.menuScreen}>
            <MenuReturn
              onPressBack={() => {
                props.navigation.goBack();
              }}
            />
          </View>
        </LinearGradient>
      </View>
      <View style={styles.settingsView}>
        <View style={styles.settingsCard}>
          <View style={styles.sectionTitleContaiter}>
            <Title style={styles.title}>Profile</Title>
            {(hasUserNameChanged ||
              hasUserEmailChanged ||
              hasUserImageChanged) && (
              <View style={styles.changeMessageContainer}>
                <FontAwesome5
                  name="exclamation-circle"
                  size={15}
                  color="#61f70a"
                />
                <Caption style={styles.changeMessage}>Changes pending!</Caption>
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
                          <AntDesign name="user" size={50} color="white" />
                        )}
                        theme={{
                          colors: { primary: '#F63A65' },
                        }}
                      />
                    ) : (
                      <Avatar.Image
                        size={80}
                        source={{
                          uri: userImage,
                        }}
                        theme={{
                          colors: { primary: '#F63A65' },
                        }}
                      />
                    )}
                    <View
                      style={
                        hasUserImageChanged
                          ? [styles.badge, styles.changedImage]
                          : [styles.badge, styles.NotchangedImage]
                      }
                    >
                      <MaterialIcons name="edit" size={24} color="white" />
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
                  underlineColor={hasUserNameChanged ? '#61f70a' : '#f9ab8f'}
                  autoCapitalize={'none'}
                  maxLength={10}
                  Color
                  theme={{
                    colors: { primary: '#F63A65' },
                  }}
                />
              </View>
              <View style={styles.textInputHolder}>
                <TextInput
                  label="E-mail"
                  value={userEmail}
                  onChangeText={(text) => setEmail(text)}
                  onBlur={emailOnBlur}
                  autoCapitalize={'none'}
                  underlineColor={hasUserEmailChanged ? '#61f70a' : '#f9ab8f'}
                  theme={{
                    colors: { primary: '#F63A65' },
                  }}
                />
              </View>
              <View style={styles.sectionButtonPassword}>
                <TouchableNativeFeedback onPress={changePasswordButton}>
                  <View style={styles.buttonSave}>
                    <Text style={styles.text}>Change Password</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
            <View style={styles.sectionTitleContaiter}>
              <Title style={styles.title}>Preferences</Title>
            </View>
            <View style={styles.mainSection}>
              <View style={styles.preferencesLine}>
                <Title style={styles.titlePreference}>Dark Theme</Title>
                <Switch
                  value={isDarkTheme}
                  onValueChange={() => setIsDarkTheme(!isDarkTheme)}
                  color="#F63A65"
                />
              </View>
            </View>
          </ScrollView>
          <View style={styles.sectionButtonSave}>
            <View style={styles.wrapButton}>
              <TouchableNativeFeedback onPress={discartChanges}>
                <View style={styles.buttonDiscart}>
                  <Text style={styles.text}>Discart</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
            <View style={styles.wrapButton}>
              <TouchableNativeFeedback onPress={saveChanges}>
                <View style={styles.buttonSave}>
                  <Text style={styles.text}>Save</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </View>
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
  },
  gradientScreen: {
    height: Dimensions.get('window').height * 0.3,
    borderBottomStartRadius: 30,
    borderBottomEndRadius: 30,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  menuScreen: {
    paddingHorizontal: Dimensions.get('window').width * 0.03,
    paddingTop: Dimensions.get('window').height * 0.03,
  },
  settingsView: {
    position: 'absolute',
    top: Dimensions.get('window').height * 0.15,
    alignItems: 'center',
    width: '100%',
  },
  settingsCard: {
    backgroundColor: 'white',
    padding: 25,
    opacity: 0.99,
    borderRadius: 30,
    height: Dimensions.get('window').height * 0.83,
    width: Dimensions.get('window').width * 0.9,
  },
  sectionButtonPassword: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sectionButtonSave: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  title: {
    fontFamily: 'OpenSans',
    fontSize: 20,
    color: '#808080',
  },
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
    marginVertical: 25,
  },
  buttonSave: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F63A65',
    height: 40,
    borderRadius: 5,
  },
  buttonDiscart: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9ab8f',
    height: 40,
    borderRadius: 5,
  },
  wrapButton: {
    width: '47%',
  },
  sectionTitleContaiter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  changedImage: {
    backgroundColor: '#61f70a',
  },
  NotchangedImage: {
    backgroundColor: '#e7e7e7',
  },
  changeMessage: {
    marginLeft: 10,
    color: '#61f70a',
  },
  changeMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Settings;
