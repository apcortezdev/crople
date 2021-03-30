import { useTheme } from '@react-navigation/native';
import { PropTypes } from 'prop-types';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../store/auth.actions';
import {
  signupOrLogin,
  validateUserName,
  facebookLogin,
} from '../store/user.actions';
import ImagePicker from './ImagePicker';
import Login from './Login';
import SignUp from './SignUp';
import {
  validateIsEmail,
  validateNameSize,
  validateNameSlur,
  validatePasswordSize,
} from './Validations';

const AuthScreen = (props) => {
  const { colors } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLogIn, setIsLogIn] = useState(true);
  const [image, setImage] = useState(null);

  const dispatch = useDispatch();
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [isLoadingSignUp, setIsLoadingSignUp] = useState(false);
  const [imagePickerVisible, setImagePickerVisible] = useState(false);

  const signUp = () => {
    setIsLogIn(false);
    props.onSignUp();
    setIsSignUp(true);
  };

  const backToLogIn = () => {
    setIsSignUp(false);
    props.onLogin();
    setIsLogIn(true);
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
      await dispatch(
        signupOrLogin('login', userEmail, password, rememberMe)
      ).catch((err) => {
        setIsLoadingLogin(false);
        Alert.alert('Wait a sec..', err.message, [{ text: 'Ok' }]);
      });
    } else {
      Alert.alert(
        'Login',
        'Something is missing! Check your e-mail and password.',
        [{ text: 'Ok' }]
      );
    }
  };

  const resetThePassword = async (userEmail) => {
    if (!userEmail) {
      Alert.alert('Reset Password', 'Please enter a valid email', [
        { text: 'Ok' },
      ]);
      return;
    }
    dispatch(resetPassword(userEmail)).then(
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
        dispatch(validateUserName(userName)).then(
          (isValid) => {
            if (isValid) {
              dispatch(
                signupOrLogin(
                  'signup',
                  email,
                  password,
                  rememberMe,
                  userName,
                  image
                )
              ).catch((err) => {
                setIsLoadingSignUp(false);
                Alert.alert('Wait a sec..', err.message, [{ text: 'Ok' }]);
              });
            } else {
              setIsLoadingSignUp(false);
              Alert.alert(
                'Name',
                'Sorry, this name is not available. Please try an other one',
                [{ text: 'Okay' }]
              );
            }
          },
          (err) => {
            setIsLoadingSignUp(false);
            Alert.alert('Ops..', err.message, [{ text: 'Okay' }]);
          }
        );
      } else {
        Alert.alert(
          'Terms & Privacy Policy',
          'You have to agree to the privacy policy',
          [{ text: 'Okay' }]
        );
      }
    } else {
      Alert.alert('Sign Up', 'Sorry, some information are missing.', [
        { text: 'Ok' },
      ]);
    }
  };

  const loginWithFacebook = async () => {
    try {
      await dispatch(facebookLogin());
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

  return (
    <View style={styles.screen}>
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
              onForgotPassword={resetThePassword}
              onGoBack={props.onGoBack}
            />
          )}
        </>
      )}
      {isSignUp && (
        <>
          {isLoadingSignUp ? (
            <View style={styles.activityIndicator}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <SignUp
              onPressBack={backToLogIn}
              onSignUpWithEmail={signUpWithEmailHandler}
              onSignUpWithFacebook={loginWithFacebook}
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
  title: (colors, fonts) => ({
    fontFamily: fonts.title,
    color: colors.text,
    fontSize: 30,
    marginBottom: 100,
  }),
  activityIndicator: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

AuthScreen.propTypes = {
  onSignUp: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
};

export default AuthScreen;
