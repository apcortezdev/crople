import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Alert,
  Easing,
  StyleSheet,
  View,
} from 'react-native';
import { Title } from 'react-native-paper';
import Login from '../components/Login';
import SignUp from '../components/SignUp';
import * as authActions from '../store/auth.actions';
import { useDispatch } from 'react-redux';

const AuthScreen = (props) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLogIn, setIsLogIn] = useState(true);
  const [error, setError] = useState();

  const dispatch = useDispatch();
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [isLoadingSignUp, setIsLoadingSignUp] = useState(false);

  const translateYGradient = useRef(new Animated.Value(0)).current;
  const translateYGradientAnimation = {
    transform: [{ translateY: translateYGradient }, { scaleX: 1.5 }],
  };

  const translateYTitle = useRef(new Animated.Value(0)).current;
  const translateYTitleAnimation = {
    transform: [{ translateY: translateYTitle }],
  };

  const signUpAnimation = Animated.parallel([
    Animated.timing(translateYGradient, {
      toValue: -480,
      duration: 300,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }),
    Animated.timing(translateYTitle, {
      toValue: -110,
      duration: 300,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }),
  ]);

  const signUp = () => {
    setIsLogIn(false);
    signUpAnimation.start();
    setTimeout(() => setIsSignUp(true), 30);
  };

  const backToLogIn = () => {
    setIsSignUp(false);
    setIsLogIn(true);
    Animated.sequence([
      Animated.parallel([
        Animated.timing(translateYGradient, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(translateYTitle, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const logInHandler = async (userEmail, password, rememberMe) => {
    setIsLoadingLogin(true);
    const action = authActions.signupOrLogin(
      'login',
      userEmail,
      password,
      rememberMe
    );
    try {
      await dispatch(action);
    } catch (err) {
      Alert.alert('Wait a sec..', err.message, [{ text: 'Ok' }]);
    }
    setIsLoadingLogin(false);
  };

  const resetPassword = async (userEmail) => {
    if (!!!userEmail) {
      Alert.alert('Reset Password', 'Please enter a valid email', [
        { text: 'Ok' },
      ]);
      return;
    }
    dispatch(authActions.resetPassword(userEmail)).then(
      () => {
        Alert.alert(
          'Reset Password',
          'Please check your e-mail inbox for password reset!',
          [{ text: 'Ok' }]
        );
      },
      () => {
        Alert.alert(
          'Sorry',
          'Your e-mail might be wrong or misspelled. Please try again!',
          [{ text: 'Ok' }]
        );
      }
    );
  };

  const signUpWithEmailHandler = async (
    email,
    password,
    rememberMe,
    userName,
    termsAgreement
  ) => {
    if (termsAgreement) {
      setIsLoadingSignUp(true);
      const action = authActions.signupOrLogin(
        'signup',
        email,
        password,
        rememberMe,
        userName
      );
      try {
        await dispatch(action);
      } catch (err) {
        // REVIEW THISSSSSS
        setError(err.message);
      }
      setIsLoadingSignUp(false);
    } else {
      Alert.alert(
        'Terms & Privacy Policy',
        'You have to agree to the terms and privacy policy',
        [{ text: 'Okay' }]
      );
    }
  };

  return (
    <View style={styles.screen}>
      <Animated.View
        style={[styles.gradientScreen, translateYGradientAnimation]}
      >
        <LinearGradient
          colors={['#F63A65', '#f9ab8f']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      <Animated.View style={[styles.titleHolder, translateYTitleAnimation]}>
        <Title style={styles.title}>Crople®</Title>
      </Animated.View>
      {isLogIn && (
        <>
          {isLoadingLogin ? (
            <View style={styles.activityIndicator}>
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : (
            <Login
              onSignUp={signUp}
              onLogIn={logInHandler}
              onForgotPassword={resetPassword}
            />
          )}
        </>
      )}
      {isSignUp && (
        <>
          {isLoadingSignUp ? (
            <View style={styles.activityIndicator}>
              <ActivityIndicator size="large" color="#F63A65" />
            </View>
          ) : (
            <SignUp
              onPressBack={backToLogIn}
              onSignUpWithEmail={signUpWithEmailHandler}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradientScreen: {
    position: 'absolute',
    width: Dimensions.get('window').width * 1,
    height: Dimensions.get('window').height * 0.8,
    borderBottomStartRadius: Dimensions.get('window').width / 2,
    borderBottomEndRadius: Dimensions.get('window').width / 2,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  titleHolder: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '60%',
  },
  title: {
    fontFamily: 'Lexend',
    color: '#151515',
    fontSize: 30,
    marginBottom: 100,
  },
  activityIndicator: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthScreen;
