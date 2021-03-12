import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  View,
} from 'react-native';
import { Title } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import ImagePicker from '../components/ImagePicker';
import Login from '../components/Login';
import SignUp from '../components/SignUp';
import {
  validateIsEmail,
  validateNameSize,
  validateNameSlur,
  validatePasswordSize,
} from '../components/Validations';
import * as authActions from '../store/auth.actions';
import { setSettings } from '../store/temps.actions';

const AuthScreen = (props) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLogIn, setIsLogIn] = useState(true);
  const [image, setImage] = useState(null);

  const dispatch = useDispatch();
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [isLoadingSignUp, setIsLoadingSignUp] = useState(false);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);

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
    if ((!!userEmail, !!password)) {
      setIsLoadingLogin(true);
      if (!validateIsEmail(userEmail)) {
        Alert.alert('Not an Email.', 'Please chose a valid e-mail address.', [
          { text: 'Ok' },
        ]);
        setIsLoadingLogin(false);
        return;
      }
      const action = authActions.signupOrLogin(
        'login',
        userEmail,
        password,
        rememberMe
      );
      await dispatch(action).then(
        () => {
          const settings = {
            userName: null,
            userEmail: null,
            userImage: null,
          };
          dispatch(setSettings(settings));
        },
        (err) => {
          Alert.alert('Wait a sec..', err.message, [{ text: 'Ok' }]);
        }
      );
      setIsLoadingLogin(false);
    } else {
      Alert.alert(
        'Login',
        'Something is missing! Check your e-mail and password.',
        [{ text: 'Ok' }]
      );
    }
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

  const choseImageModal = () => {
    setImagePickerVisible(!imagePickerVisible);
  };

  const setPickedImage = (pickedImage) => {
    setImagePickerVisible(false);
    setImage(pickedImage);
  };

  const signUpWithEmailHandler = async (
    email,
    password,
    rememberMe,
    userName,
    termsAgreement
  ) => {
    if (!!userName && !!password && !!email) {
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
      if (!validateIsEmail(email)) {
        Alert.alert('Not an Email.', 'Please chose a valid e-mail address.', [
          { text: 'Ok' },
        ]);
        return;
      }
      if (!validatePasswordSize(password)) {
        Alert.alert(
          'Password too short',
          'Please chose password with at least 6 characters',
          [{ text: 'Ok' }]
        );
        return;
      }
      if (termsAgreement) {
        setIsLoadingSignUp(true);
        dispatch(authActions.validateUserName(userName)).then(
          (isValid) => {
            if (isValid) {
              const action = authActions.signupOrLogin(
                'signup',
                email,
                password,
                rememberMe,
                userName,
                image
              );
              dispatch(action).then(
                () => {
                  const settings = {
                    userName: null,
                    userEmail: null,
                    userImage: null,
                  };
                  dispatch(setSettings(settings));
                },
                (err) => {
                  Alert.alert('Wait a sec..', err.message, [{ text: 'Ok' }]);
                }
              );
            } else {
              Alert.alert(
                'Name',
                'Sorry, this name is not available. Please try an other one',
                [{ text: 'Okay' }]
              );
            }
          },
          () => {
            Alert.alert(
              'Name',
              "There's something wrong with our servers. Please try again later =(",
              [{ text: 'Okay' }]
            );
          }
        );

        setIsLoadingSignUp(false);
      } else {
        Alert.alert(
          'Terms & Privacy Policy',
          'You have to agree to the terms and privacy policy',
          [{ text: 'Okay' }]
        );
      }
    } else {
      Alert.alert('Sign Up', 'Sorry, some information are missing.', [
        { text: 'Ok' },
      ]);
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
              onSetImage={choseImageModal}
              image={image}
            />
          )}
        </>
      )}
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
