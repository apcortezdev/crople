import { Alert, StyleSheet, Text } from 'react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authActions from '../store/auth.actions';
import { useDispatch } from 'react-redux';
import config from '../config';

const Startup = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    let dataFromStorage;
    const tryLogin = async () => {
      if (SecureStore.isAvailableAsync()) {
        // SECURE STORE IS AVAILABLE IN DEVICE
        dataFromStorage = await SecureStore.getItemAsync(config.STORAGE);
      } else {
        // SECURE STORE NOT AVAILABLE, USING GENERAL STORE
        dataFromStorage = await AsyncStorage.getItem(config.STORAGE);
      }
      if (!dataFromStorage) {
        // NO DATA STORED
        props.navigation.navigate('Auth');
        return;
      }

      const userData = JSON.parse(dataFromStorage);

      if (!userData.token || !userData.refreshToken || !userData.userId) {
        // STORAGE DATA CORRUPTED
        props.navigation.navigate('Auth');
        return;
      } else if (new Date(userData.expiryDate) <= new Date()) {
        // TOKEN INVALID
        dispatch(
          authActions.refreshTokenAndAuthenticate(userData.refreshToken, true)
        ).catch((err) => {
          // ERROR WHEN REFRESHING
          dispatch(authActions.logout());
          props.navigation.navigate('Auth');
          return;
        });
        return;
      }
      // TOKEN STILL VALID
      dispatch(
        authActions.authenticate(
          userData.userId,
          userData.token,
          userData.refreshToken,
          userData.userName
        )
      );
    };
    tryLogin();
  }, [dispatch]);
  return (
    <View style={styles.screen}>
      <ActivityIndicator
        size="large"
        color="#F63A65"
        style={{ transform: [{ scale: 1.5 }] }}
      />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    paddingTop: 35,
    fontFamily: 'OpenSans',
    fontSize: 25,
    color: '#F63A65',
  },
});

export default Startup;
