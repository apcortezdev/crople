import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { authenticate, checkStorage } from '../store/auth.actions';
import { useTheme } from '@react-navigation/native';
import { logout, refreshToken } from '../store/user.actions';

const Startup = (props) => {
  const { colors, fonts } = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkStorage()).then(
      (userData) => {
        if (!userData) {
          props.navigation.navigate('Auth');
          return;
        }

        if (!userData.token || !userData.refreshToken || !userData.userId) {
          // STORAGE DATA CORRUPTED
          dispatch(logout());
          props.navigation.navigate('Auth');
          return;
        } else if (new Date(userData.expiryDate) <= new Date()) {
          // TOKEN INVALID
          dispatch(
            refreshToken({ from: 'firebase', authentication: true })
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
        color={colors.accent}
        style={{ transform: [{ scale: 1.5 }] }}
      />
      <Text style={styles.loadingText(colors, fonts)}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: (colors, fonts) => ({
    paddingTop: 35,
    fontFamily: fonts.regular,
    fontSize: 25,
    color: colors.accent,
  }),
});

export default Startup;
