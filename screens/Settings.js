import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import {
  Divider,
  Switch,
  TextInput,
  Title
} from 'react-native-paper';
import MenuReturn from '../components/MenuReturn';

const Settings = (props) => {
  const [userName, setUserName] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
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
              onPressMenu={() => {
                props.navigation.openDrawer();
              }}
              onPressRanking={() => {
                props.navigation.goBack();
              }}
            />
          </View>
        </LinearGradient>
      </View>
      <View style={styles.settingsView}>
        <View style={styles.settingsOptions}>
          <View style={styles.settingsTitleContainer}>
            <Title style={styles.title}>Settings</Title>
          </View>
          <View style={styles.textInputHolder}>
            <TextInput
              label="Your Nick Name"
              value={userName}
              onChangeText={(text) => setUserName(text)}
              autoFocus={true}
            />
          </View>
          <View style={styles.dividerContainer}>
            <Divider />
          </View>
          <View style={styles.preferencesTitleContainer}>
            <Title style={styles.title}>Preferences</Title>
          </View>
          <View>
            <Switch
              value={isDarkTheme}
              onValueChange={() => setIsDarkTheme(!isDarkTheme)}
            />
          </View>
        </View>
      </View>
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
  settingsOptions: {
    backgroundColor: 'white',
    opacity: 0.99,
    borderRadius: 30,
    height: Dimensions.get('window').height * 0.83,
    width: Dimensions.get('window').width * 0.9,
  },
  settingsTitleContainer: {
    marginTop: 75,
    marginHorizontal: 30,
  },
  preferencesTitleContainer: {
    marginTop: 15,
    marginHorizontal: 30,
  },
  title: {
    fontFamily: 'OpenSans',
    fontSize: 20,
    color: '#808080',
  },
  dividerContainer: {
    marginHorizontal: 30,
  },
  textInputHolder: {
    paddingHorizontal: 25,
  },
});

export default Settings;
