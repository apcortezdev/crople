import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Checkbox, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSettingsUserEmail,
} from '../store/temps.actions';
import { useTheme } from '@react-navigation/native';

const Login = (props) => {
  const { colors, fonts } = useTheme();
  const dispatch = useDispatch();

  const [userEmail, setUserEmail] = useState(useSelector((state) => state.temps.settings.userEmail));
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSecureEntry, setIsSecureEntry] = useState(true);

  const opacityInputUserEmail = useRef(new Animated.Value(0)).current;
  const translateYInputUserEmail = useRef(new Animated.Value(-10)).current;
  const inputUserEmailAnimation = {
    opacity: opacityInputUserEmail,
    transform: [{ translateY: translateYInputUserEmail }],
  };

  const opacityInputPassword = useRef(new Animated.Value(0)).current;
  const translateYInputPassword = useRef(new Animated.Value(-8)).current;
  const inputPasswordAnimation = {
    opacity: opacityInputPassword,
    transform: [{ translateY: translateYInputPassword }],
  };

  const opacitySignUpView = useRef(new Animated.Value(0)).current;
  const translateYSignUpView = useRef(new Animated.Value(-8)).current;
  const signUpViewAnimation = {
    opacity: opacitySignUpView,
    transform: [{ translateY: translateYSignUpView }],
  };

  const opacityButton = useRef(new Animated.Value(0)).current;
  const translateYButton = useRef(new Animated.Value(-8)).current;
  const buttonAnimation = {
    opacity: opacityButton,
    transform: [{ translateY: translateYButton }],
  };

  const opacityRememberMeHolder = useRef(new Animated.Value(0)).current;
  const translateYRememberMeHolder = useRef(new Animated.Value(-8)).current;
  const rememberMeHolderAnimation = {
    opacity: opacityRememberMeHolder,
    transform: [{ translateY: translateYRememberMeHolder }],
  };

  const setEmail = (email) => {
    dispatch(setSettingsUserEmail(email));
    setUserEmail(email);
  };

  useEffect(() => {
    formAnimation.start();
  }, []);

  const formAnimation = Animated.stagger(50, [
    Animated.parallel([
      Animated.timing(opacityInputUserEmail, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYInputUserEmail, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]),
    Animated.parallel([
      Animated.timing(opacityInputPassword, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYInputPassword, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]),
    Animated.parallel([
      Animated.timing(opacityRememberMeHolder, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYRememberMeHolder, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]),
    Animated.parallel([
      Animated.timing(opacityButton, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYButton, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]),
    Animated.parallel([
      Animated.timing(opacitySignUpView, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYSignUpView, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]),
  ]);

  return (
    <View style={styles.screen}>
      <Animated.View style={[styles.formHolder]}>
        <View style={styles.form}>
          <Animated.View style={[styles.inputHolder, inputUserEmailAnimation]}>
            <TextInput
              label="E-mail"
              value={userEmail}
              onChangeText={(text) => setEmail(text)}
              underlineColor={colors.accent}
              keyboardType="email-address"
              autoCapitalize={"none"}
            />
          </Animated.View>
          <Animated.View style={[styles.inputHolder, inputPasswordAnimation]}>
            <TextInput
              label="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              underlineColor={colors.accent}
              secureTextEntry={isSecureEntry}
              autoCapitalize={"none"}
              right={
                <TextInput.Icon
                  name={isSecureEntry ? "eye-outline" : "eye-off-outline"} 
                  color="#808080"
                  onPress={() => {
                    setIsSecureEntry(!isSecureEntry);
                  }}
                />
              }
            />
          </Animated.View>
          <Animated.View
            style={[styles.inputRememberMeHolder, rememberMeHolderAnimation]}
          >
            <View style={styles.checkBoxHolder}>
              <Checkbox
                status={rememberMe ? 'checked' : 'unchecked'}
                onPress={() => {
                  setRememberMe(!rememberMe);
                }}
                color={colors.primary}
              />
              <TouchableWithoutFeedback
                onPress={() => {
                  setRememberMe(!rememberMe);
                }}
              >
                <Text style={styles.text}>Remember me</Text>
              </TouchableWithoutFeedback>
            </View>
            <TouchableWithoutFeedback onPress={props.onForgotPassword.bind(this, userEmail)}>
              <Text style={styles.text}>Forgot Password?</Text>
            </TouchableWithoutFeedback>
          </Animated.View>
          <Animated.View style={[styles.inputHolder, buttonAnimation]}>
            <TouchableNativeFeedback onPress={props.onLogIn.bind(this, userEmail, password, rememberMe)}>
              <View style={styles.buttonLogIn(colors)}>
                <Text style={styles.text}>Login</Text>
              </View>
            </TouchableNativeFeedback>
          </Animated.View>
          <Animated.View style={[styles.signUpView, signUpViewAnimation]}>
            <Text style={styles.text}>New?</Text>
            <TouchableWithoutFeedback onPress={props.onSignUp}>
              <View style={styles.signUpTextView}>
                <Text style={styles.signUpText}>Sign Up Now!</Text>
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
      </Animated.View>
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
  formHolder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '75%',
  },
  inputHolder: {
    marginVertical: 10,
  },
  inputRememberMeHolder: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signUpView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'OpenSans',
    color: 'white',
    fontSize: 14,
  },
  signUpText: {
    fontFamily: 'OpenSans',
    color: 'white',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  signUpTextView: {
    marginLeft: 10,
  },
  checkBoxHolder: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonLogIn: (colors) => ({
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    height: 40,
    borderRadius: 5,
  }),
});

export default Login;
