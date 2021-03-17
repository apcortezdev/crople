import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { useDispatch } from 'react-redux';
import * as cropleActions from '../store/crople.actions';
import { checkNewRecord } from '../store/user.actions';

const Board = (props) => {
  const dispatch = useDispatch();

  let listenedBladeScaleValue;
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isStartButton, setIsStartButton] = useState(true);
  const [runTime, setRunTime] = useState(2000);
  const [currentRemainderScale, setCurrentRemainderScale] = useState(1);
  const [counterText, setCounterText] = useState('2');

  const scaleBlade = useRef(new Animated.Value(1.3)).current;
  const scaleRemainder = useRef(new Animated.Value(1)).current;
  const scaleBack = useRef(new Animated.Value(1)).current;
  const opacityBack = useRef(new Animated.Value(1)).current;
  const bladeBorderWidth = useRef(new Animated.Value(1)).current;
  const counterOpacity = useRef(new Animated.Value(0)).current;
  const counterFontSize = useRef(new Animated.Value(70)).current;

  const counterAnimatedStyle = {
    opacity: counterOpacity,
  };

  const counterTextAnimatedStyle = {
    fontSize: counterFontSize,
  };

  const bladeAnimatedStyle = {
    borderWidth: bladeBorderWidth,
    transform: [{ scale: scaleBlade }],
  };
  const remainderAnimatedStyle = {
    transform: [{ scale: scaleRemainder }],
  };
  const backAnimatedStyle = {
    opacity: opacityBack,
    transform: [{ scale: scaleBack }],
  };

  const runBlade = Animated.timing(scaleBlade, {
    toValue: 0,
    duration: runTime,
    useNativeDriver: false,
  });

  const counterGo = Animated.timing(counterOpacity, {
    toValue: 0,
    duration: 900,
    useNativeDriver: false,
  });

  const resetBlade = Animated.timing(scaleBlade, {
    toValue: 1.3,
    duration: 100,
    easing: Easing.out(Easing.quad),
    useNativeDriver: false,
  });

  const resetRemainder = (value) =>
    Animated.spring(scaleRemainder, {
      toValue: value,
      stiffness: 850,
      damping: 15,
      mass: 0.7,
      useNativeDriver: false,
    });

  const setNewBack = (value) => {
    opacityBack.setValue(1);
    scaleBack.setValue(value);
    Animated.timing(opacityBack, {
      toValue: 0,
      duration: 700,
      useNativeDriver: false,
    }).start();
  };

  const focusOnBlade = () => {
    if (isGameRunning) {
      bladeBorderWidth.setValue(4);
    }
  };

  const focusOffBlade = () => {
    if (isGameRunning) {
      bladeBorderWidth.setValue(1);
      if (listenedBladeScaleValue <= currentRemainderScale) {
        setRunTime(runTime * 0.9);
        dispatch(cropleActions.addPoints());
        setNewBack(currentRemainderScale);
        setCurrentRemainderScale(listenedBladeScaleValue);
        scaleRemainder.setValue(listenedBladeScaleValue);
        resetBlade.start(() => {
          runBlade.start(({ finished }) => {
            if (finished) endGame();
          });
        });
      } else {
        endGame();
      }
    }
  };

  const startGame = () => {
    setIsStartButton(false);
    dispatch(cropleActions.setPoints(0));
    counterOpacity.setValue(1);
    counterGo.start(() => {
      setCounterText('1');
      counterOpacity.setValue(1);
      counterGo.start(() => {
        setCounterText('GO!');
        counterFontSize.setValue(40);
        counterOpacity.setValue(1);
        counterGo.start(() => {
          setIsGameRunning(true);
          runBlade.start(({ finished }) => {
            if (finished) endGame();
          });
        });
      });
    });
  };

  const endGame = () => {
    bladeBorderWidth.setValue(1);
    setIsGameRunning(false);
    counterFontSize.setValue(70);
    setRunTime(2000);
    setCounterText('2');
    resetBlade.start();
    setCurrentRemainderScale(1);
    resetRemainder(1).start(setIsStartButton(true));
    dispatch(checkNewRecord());
  };

  useEffect(() => {
    const listnerBlade = scaleBlade.addListener(({ value }) => {
      listenedBladeScaleValue = value;
    });
    return function cleanup() {
      scaleBlade.removeListener(listnerBlade);
    };
  });

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback
        onPressIn={focusOnBlade}
        onPressOut={focusOffBlade}
      >
        <View style={styles.gameScreen}>
          <View style={styles.circleSocket} />
          <Animated.View style={[styles.circleBack, backAnimatedStyle]} />
          <Animated.View
            style={[styles.circleRemainder, remainderAnimatedStyle]}
          >
            <LinearGradient
              colors={['#FFFB8B', '#FFD03D']}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>
          <Animated.View style={[styles.circleBlade, bladeAnimatedStyle]} />
          <Animated.View style={[styles.counter, counterAnimatedStyle]}>
            <Animated.Text
              style={[styles.counterText, counterTextAnimatedStyle]}
            >
              {counterText}
            </Animated.Text>
          </Animated.View>
          {isStartButton && (
            <TouchableWithoutFeedback
              style={styles.startButton}
              onPress={startGame}
            >
              <View style={styles.startBar}>
                <Text style={styles.start}>Start!</Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  gameScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleSocket: {
    position: 'absolute',
    opacity: 0.1,
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').width * 0.7,
    borderRadius: (Dimensions.get('window').width * 0.7) / 2,
    backgroundColor: '#0a0a0a',
  },
  circleBack: {
    position: 'absolute',
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').width * 0.7,
    borderRadius: (Dimensions.get('window').width * 0.7) / 2,
    backgroundColor: '#FFFB8B',
  },
  circleRemainder: {
    position: 'absolute',
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').width * 0.7,
    borderRadius: (Dimensions.get('window').width * 0.7) / 2,
    overflow: 'hidden',
  },
  circleBlade: {
    position: 'absolute',
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').width * 0.7,
    borderRadius: (Dimensions.get('window').width * 0.7) / 2,
    borderColor: '#151515',
  },
  gradient: {
    flex: 1,
  },
  startBar: {
    position: 'absolute',
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').width * 0.7,
    borderRadius: (Dimensions.get('window').width * 0.7) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {},
  start: {
    fontFamily: 'Lexend',
    fontSize: 30,
    color: '#151515',
  },
  counter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.25,
    height: Dimensions.get('window').width * 0.25,
    borderRadius: (Dimensions.get('window').width * 0.25) / 2,
    backgroundColor: '#FFF',
    elevation: 5,
  },
  counterText: {
    fontFamily: 'OpenSans',
    color: '#151515',
  },
});

export default Board;
