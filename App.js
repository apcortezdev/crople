import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import CropleNavigator from './navigation/CropleNagivator';

import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import cropleReducer from './store/crople.reducer';
import authReducer from './store/auth.reducer';
import rankReducer from './store/rank.reducer';
import tempsReducer from './store/temps.reducer';
import ReduxThunk from 'redux-thunk';

import { enableScreens } from 'react-native-screens';
import DarkTheme from './styles/DarkTheme';
import LightTheme from './styles/LightTheme';
import { useColorScheme } from 'react-native';

enableScreens();

const rootReducer = combineReducers({
  game: cropleReducer,
  auth: authReducer,
  rank: rankReducer,
  temps: tempsReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  let [fontsLoaded] = useFonts({
    Lexend: require('./assets/fonts/LexendMega-Regular.ttf'),
    OpenSans: require('./assets/fonts/OpenSans-Regular.ttf'),
  });

  const colorScheme = useColorScheme() === 'dark' ? DarkTheme : LightTheme;

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <Provider store={store}>
        {/* <NavigationContainer theme={colorScheme}> */}
        <NavigationContainer>
          <CropleNavigator />
          <StatusBar translucent={true} />
        </NavigationContainer>
      </Provider>
    );
  }
}
