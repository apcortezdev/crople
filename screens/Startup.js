import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import {
  authenticate,
  checkStorage,
  logout,
  refreshTokenAndAuthenticate,
} from '../store/auth.actions';

const Startup = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // const userData = dispatch(checkStorage());
    dispatch(checkStorage()).then(
      (userData) => {
        if (!userData) {
          props.navigation.navigate('Auth');
          return;
        }

        if (!userData.token || !userData.refreshToken || !userData.userId) {
          // STORAGE DATA CORRUPTED
          props.navigation.navigate('Auth');
          return;
        } else if (new Date(userData.expiryDate) <= new Date()) {
          // TOKEN INVALID

          dispatch(
            refreshTokenAndAuthenticate(userData.refreshToken, userData.userImage, true)
          ).catch(() => {
            // ERROR WHEN REFRESHING
            dispatch(logout());
            props.navigation.navigate('Auth');
            return;
          });
          return;
        }
        // TOKEN STILL VALID
        dispatch(
          authenticate(
            userData.userId,
            userData.token,
            userData.refreshToken,
            new Date(userData.expiryDate),
            userData.infoId,
            userData.userEmail,
            userData.userName,
            userData.highestScore,
            userData.userImage
          )
        );
      },
      () => {
        props.navigation.navigate('Auth');
        return;
      }
    );
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
