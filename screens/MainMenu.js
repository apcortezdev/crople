import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import { Title } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { PropTypes } from 'prop-types';

const AuthScreen = (props) => {
  const { colors, fonts } = useTheme();

  const opacityMenu1 = useRef(new Animated.Value(0)).current;
  const translateYMenu1 = useRef(new Animated.Value(-10)).current;
  const translateYMenu1Animation = {
    opacity: opacityMenu1,
    transform: [{ translateY: translateYMenu1 }],
  };

  const opacityMenu2 = useRef(new Animated.Value(0)).current;
  const translateYMenu2 = useRef(new Animated.Value(-10)).current;
  const translateYMenu2Animation = {
    opacity: opacityMenu2,
    transform: [{ translateY: translateYMenu2 }],
  };
  const opacityMenu3 = useRef(new Animated.Value(0)).current;
  const translateYMenu3 = useRef(new Animated.Value(-10)).current;
  const translateYMenu3Animation = {
    opacity: opacityMenu3,
    transform: [{ translateY: translateYMenu3 }],
  };

  const openAnimation = Animated.stagger(50, [
    Animated.parallel([
      Animated.timing(opacityMenu1, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYMenu1, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]),
    Animated.parallel([
      Animated.timing(opacityMenu2, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYMenu2, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]),
    Animated.parallel([
      Animated.timing(opacityMenu3, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYMenu3, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]),
  ]);

  useEffect(() => {
    openAnimation.start();
  }, [openAnimation]);

  return (
    <View style={styles.screen}>
      <View style={styles.menuHolder}>
        <Animated.View style={[styles.menuItemBox, translateYMenu1Animation]}>
          <TouchableNativeFeedback onPress={props.onPlay}>
            <View style={styles.menuItemHolder}>
              <Title style={styles.menuItem(colors, fonts)}>Play</Title>
            </View>
          </TouchableNativeFeedback>
        </Animated.View>
        <Animated.View style={[styles.menuItemBox, translateYMenu2Animation]}>
          <TouchableNativeFeedback onPress={props.onRanking}>
            <View style={styles.menuItemHolder}>
              <Title style={styles.menuItem(colors, fonts)}>Ranking</Title>
            </View>
          </TouchableNativeFeedback>
        </Animated.View>
        <Animated.View style={[styles.menuItemBox, translateYMenu3Animation]}>
          <TouchableNativeFeedback onPress={props.onOptions}>
            <View style={styles.menuItemHolder}>
              <Title style={styles.menuItem(colors, fonts)}>Options</Title>
            </View>
          </TouchableNativeFeedback>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: 'absolute',
    top: '35%',
    width: '100%',
    height: '65%',
  },
  menuHolder: {
    alignItems: 'center',
    height: '100%',
  },
  menuItemBox: {
    width: '70%',
    borderRadius: 25,
    overflow: 'hidden',
  },
  menuItemHolder: {
    alignItems: 'center',
    marginVertical: 5,
  },
  menuItem: (colors, fonts) => ({
    fontFamily: fonts.title,
    color: colors.text,
    fontSize: 20,
    marginVertical: 5,
  }),
});

AuthScreen.propTypes = {
  onPlay: PropTypes.func.isRequired,
  onRanking: PropTypes.func.isRequired,
  onOptions: PropTypes.func.isRequired,
};

export default AuthScreen;
