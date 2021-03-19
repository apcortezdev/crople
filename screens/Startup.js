import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startAsync } from '../store/crople.actions';
import { useColorScheme } from 'react-native';
import { useFonts } from 'expo-font';
import DarkTheme from '../styles/DarkTheme';
import LightTheme from '../styles/LightTheme';
import { StatusBar } from 'expo-status-bar';
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';
import Main from './MainScreen';

const Startup = (props) => {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);
  const isDark = useSelector((state) => state.game.darkTheme);
  const scheme = useColorScheme();

  let [fontsLoaded] = useFonts({
    Lexend: require('../assets/fonts/LexendMega-Regular.ttf'),
    OpenSans: require('../assets/fonts/OpenSans-Regular.ttf'),
  });

  dispatch(startAsync()).then(() => {
    setIsReady(true);
  });

  const colorScheme =
    isDark === 'auto'
      ? scheme === 'dark'
        ? DarkTheme
        : LightTheme
      : isDark === 'on'
      ? DarkTheme
      : LightTheme;

  if (!fontsLoaded || !isReady) {
    return <AppLoading />;
  } else {
    return (
      <NavigationContainer theme={colorScheme}>
        <Main />
        <StatusBar translucent={true} />
      </NavigationContainer>
    );
  }
};

export default Startup;
