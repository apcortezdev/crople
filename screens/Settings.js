import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View
} from 'react-native';
import { Avatar, Modal, Switch, TextInput, Title } from 'react-native-paper';
import { useSelector } from 'react-redux';
import MenuReturn from '../components/MenuReturn';

const Settings = (props) => {
  const [userName, setUserName] = useState(useSelector((state) => state.game.userName));
  const [userEmail, setUserEmail] = useState(useSelector((state) => state.game.userEmail));
  const [userOldPassword, setUserOldPassword] = useState('');
  const [userNewPassword, setUserNewPassword] = useState('');
  const [userNewPasswordConfirm, setUserNewPasswordConfirm] = useState('');
  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

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
          </View>
          <ScrollView style={styles.settingsScrollView}>
            <View style={styles.mainSection}>
              <View style={styles.imageContainer}>
                <View>
                  <Avatar.Icon
                    size={80}
                    icon={() => (
                      <AntDesign name="user" size={50} color="white" />
                    )}
                    theme={{
                      colors: { primary: '#F63A65' },
                    }}
                  />
                  <View style={styles.badge}>
                    <MaterialIcons name="edit" size={24} color="white" />
                  </View>
                </View>
              </View>
              <View style={styles.textInputHolder}>
                <TextInput
                  label="Player Name (10 letters only!)"
                  value={userName}
                  onChangeText={(text) => setUserName(text)}
                  // autoFocus={true}
                  maxLength={10}
                  theme={{
                    colors: { primary: '#F63A65' },
                  }}
                />
              </View>
              <View style={styles.textInputHolder}>
                <TextInput
                  label="E-mail"
                  value={userEmail}
                  onChangeText={(text) => setUserEmail(text)}
                  secureTextEntry={false}
                  theme={{
                    colors: { primary: '#F63A65' },
                  }}
                />
              </View>
              <View style={styles.sectionButton}>
                <TouchableNativeFeedback onPress={() => setModalVisible(true)}>
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
          <View style={styles.sectionButton}>
            <TouchableNativeFeedback onPress={() => {}}>
              <View style={styles.buttonSave}>
                <Text style={styles.text}>Save</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </View>
      <Modal
        visible={isModalVisible}
        onDismiss={() => setModalVisible(false)}
        contentContainerStyle={styles.containerStyle}
      >
        <View style={styles.modalView}>
          <View style={styles.sectionTitleModalContainer}>
            <Title style={styles.title}>Change Password</Title>
          </View>
          <View style={styles.textInputHolder}>
            <TextInput
              label="Old Password"
              value={userOldPassword}
              onChangeText={(text) => setUserOldPassword(text)}
              secureTextEntry={isSecureEntry}
              right={
                <TextInput.Icon
                  name={isSecureEntry ? 'eye-off-outline' : 'eye-outline'}
                  color="#808080"
                  onPress={() => {
                    setIsSecureEntry(!isSecureEntry);
                  }}
                />
              }
              theme={{
                colors: { primary: '#F63A65' },
              }}
            />
          </View>
          <View style={styles.textInputHolder}>
            <TextInput
              label="New Password"
              value={userNewPassword}
              onChangeText={(text) => setUserNewPassword(text)}
              secureTextEntry={isSecureEntry}
              right={
                <TextInput.Icon
                  name={isSecureEntry ? 'eye-off-outline' : 'eye-outline'}
                  color="#808080"
                  onPress={() => {
                    setIsSecureEntry(!isSecureEntry);
                  }}
                />
              }
              theme={{
                colors: { primary: '#F63A65' },
              }}
            />
          </View>
          <View style={styles.textInputHolder}>
            <TextInput
              label="Confirm New Password"
              value={userNewPasswordConfirm}
              onChangeText={(text) => setUserNewPasswordConfirm(text)}
              secureTextEntry={isSecureEntry}
              right={
                <TextInput.Icon
                  name={isSecureEntry ? 'eye-off-outline' : 'eye-outline'}
                  color="#808080"
                  onPress={() => {
                    setIsSecureEntry(!isSecureEntry);
                  }}
                />
              }
              theme={{
                colors: { primary: '#F63A65' },
              }}
            />
          </View>
          <View style={styles.buttonSaveModalContainer}>
            <View style={styles.buttonSaveModal}>
              <TouchableNativeFeedback onPress={() => {}}>
                <View style={styles.buttonSave}>
                  <Text style={styles.text}>Save</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </View>
      </Modal>
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
  modalView: {
    backgroundColor: '#FFFFFF',
    width: Dimensions.get('window').width * 0.9,
    borderRadius: 25,
    paddingHorizontal: 20,
  },
  sectionTitleModalContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginVertical: 25,
    marginHorizontal: 15,
  },
  containerStyle: {
    width: '100%',
    alignItems: 'center',
  },
  sectionButton: {
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
    backgroundColor: '#e7e7e7',
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
  sectionTitleContaiter: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  buttonSaveModalContainer: {
    marginVertical: 25,
    marginHorizontal: 15,
    borderTopWidth: 1,
    paddingVertical: 10,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  buttonSaveModal: {
    width: '60%',
  },
});

export default Settings;
