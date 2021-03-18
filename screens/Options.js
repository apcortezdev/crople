import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View, Animated } from 'react-native';
import Auth from '../components/Auth';
import Settings from './Settings';
import { useTheme } from '@react-navigation/native';

const Options = (props) => {
  const { colors, fonts } = useTheme();
  const [isLogged, setIsLogged] = useState(true);

  useEffect(() => {
    if (isLogged) {
      props.onSettings();
    }
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.optionsWrapper}></View>
      {isLogged ? (
        <Settings onGoBack={props.onMenu} />
      ) : (
        <Auth
          onGoBack={props.onMenu}
          onSignUp={props.onSignUp}
          onLogin={props.onLogin}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  optionsWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Options;
