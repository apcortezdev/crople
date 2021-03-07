import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Avatar, Checkbox, TextInput } from 'react-native-paper';

const SignUp = (props) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAgreement, setTermsAgreement] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const opacityAvatar = useRef(new Animated.Value(0)).current;
  const translateYAvatar = useRef(new Animated.Value(-8)).current;
  const avatarAnimation = {
    opacity: opacityAvatar,
    transform: [{ translateY: translateYAvatar }],
  };

  const opacityInputUserName = useRef(new Animated.Value(0)).current;
  const translateYInputUserName = useRef(new Animated.Value(-10)).current;
  const inputUserNameAnimation = {
    opacity: opacityInputUserName,
    transform: [{ translateY: translateYInputUserName }],
  };

  const opacityInputEmail = useRef(new Animated.Value(0)).current;
  const translateYInputEmail = useRef(new Animated.Value(-10)).current;
  const inputEmailAnimation = {
    opacity: opacityInputEmail,
    transform: [{ translateY: translateYInputEmail }],
  };

  const opacityInputPassword = useRef(new Animated.Value(0)).current;
  const translateYInputPassword = useRef(new Animated.Value(-8)).current;
  const inputPasswordAnimation = {
    opacity: opacityInputPassword,
    transform: [{ translateY: translateYInputPassword }],
  };

  const opacityInputAgreement = useRef(new Animated.Value(0)).current;
  const translateYInputAgreement = useRef(new Animated.Value(-8)).current;
  const inputAgreementAnimation = {
    opacity: opacityInputAgreement,
    transform: [{ translateY: translateYInputAgreement }],
  };

  const opacitySignUpButton = useRef(new Animated.Value(0)).current;
  const translateYSignUpButton = useRef(new Animated.Value(-8)).current;
  const signUpButtonAnimation = {
    opacity: opacitySignUpButton,
    transform: [{ translateY: translateYSignUpButton }],
  };

  const opacitySignUpWith = useRef(new Animated.Value(0)).current;
  const translateYSignUpWith = useRef(new Animated.Value(-8)).current;
  const signUpWithAnimation = {
    opacity: opacitySignUpWith,
    transform: [{ translateY: translateYSignUpWith }],
  };

  const opacitySignUpExternal = useRef(new Animated.Value(0)).current;
  const translateYSignUpExternal = useRef(new Animated.Value(-8)).current;
  const signUpExternalAnimation = {
    opacity: opacitySignUpExternal,
    transform: [{ translateY: translateYSignUpExternal }],
  };
  const opacityArrow = useRef(new Animated.Value(0)).current;
  const translateYArrow = useRef(new Animated.Value(-8)).current;
  const arrowAnimation = {
    opacity: opacityArrow,
    transform: [{ translateY: translateYArrow }],
  };

  const formAnimation = Animated.stagger(50, [
    Animated.parallel([
      Animated.timing(opacityAvatar, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAvatar, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]),
    Animated.parallel([
      Animated.timing(opacityInputUserName, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYInputUserName, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]),
    Animated.parallel([
      Animated.timing(opacityInputEmail, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYInputEmail, {
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
      Animated.timing(opacityInputAgreement, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYInputAgreement, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]),
    Animated.parallel([
      Animated.timing(opacitySignUpButton, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYSignUpButton, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]),
    Animated.parallel([
      Animated.timing(opacitySignUpWith, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYSignUpWith, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]),
    Animated.parallel([
      Animated.timing(opacitySignUpExternal, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYSignUpExternal, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]),
    Animated.parallel([
      Animated.timing(opacityArrow, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYArrow, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]),
  ]);

  useEffect(() => {
    formAnimation.start();
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.formHolder}>
        <Animated.View style={[styles.avatarHolder, avatarAnimation]}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <>
              <Avatar.Icon
                size={80}
                icon={() => <AntDesign name="user" size={50} color="white" />}
                theme={{
                  colors: { primary: '#F63A65' },
                }}
              />
              <View style={styles.badge}>
                <MaterialIcons name="edit" size={24} color="white" />
              </View>
            </>
          </TouchableWithoutFeedback>
        </Animated.View>
        <View style={styles.form}>
          <Animated.View style={[styles.inputHolder, inputUserNameAnimation]}>
            <TextInput
              label="User Name"
              value={userName}
              onChangeText={(text) => setUserName(text)}
              selectionColor="#F63A65"
              underlineColor="#f9ab8f"
              theme={{
                colors: { primary: '#F63A65' },
              }}
              maxLength={12}
            />
          </Animated.View>
          <Animated.View style={[styles.inputHolder, inputEmailAnimation]}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              selectionColor="#F63A65"
              underlineColor="#f9ab8f"
              keyboardType="email-address"
              theme={{
                colors: { primary: '#F63A65' },
              }}
              autoCapitalize="none"
            />
          </Animated.View>
          <Animated.View style={[styles.inputHolder, inputPasswordAnimation]}>
            <TextInput
              label="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              selectionColor="#F63A65"
              underlineColor="#f9ab8f"
              secureTextEntry
              theme={{
                colors: { primary: '#F63A65' },
              }}
              minLenth={6}
              autoCapitalize="none"
            />
          </Animated.View>
          <Animated.View
            style={[styles.inputAgreementHolder, inputAgreementAnimation]}
          >
            <View style={styles.checkBoxHolder}>
              <Checkbox
                status={rememberMe ? 'checked' : 'unchecked'}
                onPress={() => {
                  setRememberMe(!rememberMe);
                }}
                color="#F63A65"
              />
              <TouchableWithoutFeedback
                onPress={() => {
                  setRememberMe(!rememberMe);
                }}
              >
                <Text style={styles.text}>Remember me</Text>
              </TouchableWithoutFeedback>
            </View>
            <View style={styles.checkBoxHolder}>
              <Checkbox
                status={termsAgreement ? 'checked' : 'unchecked'}
                onPress={() => {
                  setTermsAgreement(!termsAgreement);
                }}
                color="#F63A65"
              />
              <TouchableWithoutFeedback
                onPress={() => {
                  setTermsAgreement(!termsAgreement);
                }}
              >
                <Text style={styles.text}>
                  I agree to the terms & privacy policy
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </Animated.View>
          <Animated.View style={[styles.inputHolder, signUpButtonAnimation]}>
            <TouchableNativeFeedback
              onPress={props.onSignUpWithEmail.bind(
                this,
                email,
                password,
                rememberMe,
                userName,
                termsAgreement
              )}
            >
              <View style={styles.buttonSignUp}>
                <Text style={styles.textButton}>Sign up</Text>
              </View>
            </TouchableNativeFeedback>
          </Animated.View>
          <Animated.View style={[styles.signUpText, signUpWithAnimation]}>
            <Text style={styles.text}>Or Sign up with</Text>
          </Animated.View>
          <Animated.View
            style={[styles.signUpExternal, signUpExternalAnimation]}
          >
            <Animated.View style={[styles.inputHolderButtonExternal]}>
              <TouchableNativeFeedback onPress={() => {}}>
                <View style={styles.buttonFacebook}>
                  <View style={styles.buttonIcon}>
                    <FontAwesome name="facebook-f" size={20} color="white" />
                  </View>
                  <Text style={styles.textButton}>Facebook</Text>
                </View>
              </TouchableNativeFeedback>
            </Animated.View>
            <Animated.View style={[styles.inputHolderButtonExternal]}>
              <TouchableNativeFeedback onPress={() => {}}>
                <View style={styles.buttonGoogle}>
                  <View style={styles.buttonIcon}>
                    <AntDesign name="google" size={20} color="white" />
                  </View>
                  <Text style={styles.textButton}>Google</Text>
                </View>
              </TouchableNativeFeedback>
            </Animated.View>
          </Animated.View>
          <Animated.View style={[styles.backArrowView, arrowAnimation]}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <MaterialIcons
                name="keyboard-backspace"
                size={34}
                color="black"
                onPress={props.onPressBack}
              />
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    position: 'absolute',
  },
  formHolder: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  avatarHolder: {
    marginBottom: 20,
  },
  badge: {
    position: 'absolute',
    top: 50,
    left: 50,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e7e7e7',
  },
  form: {
    width: '75%',
  },
  inputHolder: {
    marginVertical: 10,
    width: '100%',
  },
  inputHolderButtonExternal: {
    marginVertical: 10,
    width: '45%',
  },
  title: {
    fontFamily: 'Lexend',
    color: '#151515',
    fontSize: 30,
    marginBottom: 100,
  },
  signUpView: {
    flexDirection: 'row',
  },
  text: {
    fontFamily: 'OpenSans',
    color: '#151515',
    fontSize: 18,
  },
  inputAgreementHolder: {
    alignItems: 'flex-start',
  },
  checkBoxHolder: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  signUpText: {
    padding: 10,
    alignItems: 'center',
  },
  textButton: {
    fontFamily: 'OpenSans',
    color: 'white',
    fontSize: 14,
  },
  text: {
    fontFamily: 'OpenSans',
    color: '#151515',
    fontSize: 14,
  },
  buttonSignUp: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F63A65',
    height: 40,
    borderRadius: 5,
  },
  buttonFacebook: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4e61b0',
    height: 40,
    borderRadius: 5,
  },
  buttonGoogle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d5513c',
    height: 40,
    borderRadius: 5,
  },
  signUpExternal: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  buttonIcon: {
    position: 'absolute',
    left: 10,
  },
  backArrowView: {
    marginTop: 20,
    marginLeft: 10,
  },
});

export default SignUp;
