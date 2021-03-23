import React, { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useTheme } from '@react-navigation/native';

const SwitchComponent = (props) => {
  const { colors } = useTheme();

  const [switchValue, setSwitchValue] = useState(props.value);
  const switchTranslate = useRef(new Animated.Value(switchValue)).current;
  const switchInterpolation = switchTranslate.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 24, 48],
  });
  const switchAnimationStyle = {
    transform: [{ translateX: switchInterpolation }],
  };

  const switchAnimation = Animated.timing(switchTranslate, {
    toValue: switchValue,
    duration: 100,
    easing: Easing.out(Easing.exp),
    useNativeDriver: true,
  });

  const pressSwitch = () => {
    if (switchValue >= 0 && switchValue < 2) {
      setSwitchValue(switchValue + 1);
    } else {
      setSwitchValue(0);
    }
    props.onValueChange(switchValue);

    switchAnimation.start();
  };

  return (
    <TouchableWithoutFeedback onPress={pressSwitch}>
      <View style={styles.screen}>
        <View style={styles.notch(colors)}></View>
        <Animated.View
          style={[styles.switch(colors), switchAnimationStyle]}
        ></Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  screen: {
    width: 70,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notch: (colors) => ({
    width: 60,
    height: 15,
    borderRadius: 30,
    backgroundColor: colors.placeholder,
  }),
  switch: (colors) => ({
    position: 'absolute',
    left: 0,
    elevation: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
  }),
});

export default SwitchComponent;
