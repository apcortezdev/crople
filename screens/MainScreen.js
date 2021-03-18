import { useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View, Easing } from 'react-native';
import Crople from './Crople';
import MainMenu from './MainMenu';
import Ranking from './Ranking';
import Options from './Options';
import { Title } from 'react-native-paper';

const AuthScreen = (props) => {
  const { colors, fonts } = useTheme();

  const [isMenu, setIsMenu] = useState(true);
  const [isPlay, setIsPlay] = useState(false);
  const [isRanking, setIsRanking] = useState(false);
  const [isOptions, setIsOptions] = useState(false);

  const translateYGradient = useRef(new Animated.Value(0)).current;
  const scaleYGradient = useRef(new Animated.Value(1)).current;
  const translateYGradientAnimation = {
    transform: [
      { translateY: translateYGradient },
      { scaleX: 1.5 },
      { scaleY: scaleYGradient },
    ],
  };

  const opacityTitle = useRef(new Animated.Value(1)).current;
  const translateYTitleAnimation = {
    opacity: opacityTitle,
  };

  const gradientAnimationMenu = Animated.parallel([
    Animated.timing(scaleYGradient, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }),
    Animated.timing(translateYGradient, {
      toValue: 0,
      duration: 200,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }),
    Animated.timing(opacityTitle, {
      toValue: 1,
      duration: 50,
      useNativeDriver: true,
    }),
  ]);

  const gradientAnimationPlay = Animated.parallel([
    Animated.timing(scaleYGradient, {
      toValue: 2,
      duration: 200,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }),
    Animated.timing(translateYGradient, {
      toValue: 0,
      duration: 200,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }),
    Animated.timing(opacityTitle, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
    }),
  ]);

  const gradientAnimationRankOpt = Animated.parallel([
    Animated.timing(scaleYGradient, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }),
    Animated.timing(translateYGradient, {
      toValue: -400,
      duration: 200,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }),
    Animated.timing(opacityTitle, {
      toValue: 0,
      duration: 50,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }),
  ]);

  const gradientAnimationOptionsSignUp = Animated.parallel([
    Animated.timing(scaleYGradient, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }),
    Animated.timing(translateYGradient, {
      toValue: -480,
      duration: 200,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }),
    Animated.timing(opacityTitle, {
      toValue: 0,
      duration: 50,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }),
  ]);

  const onSignUpAnimation = () => {
    gradientAnimationOptionsSignUp.start();
  };

  const onLogInAnimation = () => {
    gradientAnimationMenu.start();
  };

  const onOptionsAnimation = () => {
    gradientAnimationRankOpt.start()
  }

  const goMenu = () => {
    setIsRanking(false);
    setIsOptions(false);
    setIsPlay(false);
    gradientAnimationMenu.start();
    setIsMenu(true);
  };
  const goPlay = () => {
    setIsMenu(false);
    setIsRanking(false);
    setIsOptions(false);
    gradientAnimationPlay.start();
    setIsPlay(true);
  };
  const goRanking = () => {
    setIsMenu(false);
    setIsPlay(false);
    setIsOptions(false);
    gradientAnimationRankOpt.start();
    setIsRanking(true);
  };
  const goOptions = () => {
    setIsMenu(false);
    setIsPlay(false);
    setIsRanking(false);
    setIsOptions(true);
  };

  return (
    <View style={styles.screen(colors)}>
      <Animated.View
        style={[styles.gradientScreen, translateYGradientAnimation]}
      >
        <LinearGradient
          colors={[colors.accent, colors.primary]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      <Animated.View style={[styles.titleHolder, translateYTitleAnimation]}>
        <View style={styles.titleBox}>
          <LinearGradient
            colors={[colors.cropleCircle.primary, colors.cropleCircle.accent]}
            style={styles.gradientSun}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Title style={styles.title(colors, fonts)}>Crople®</Title>
        </View>
      </Animated.View>
      {isMenu && (
        <MainMenu onPlay={goPlay} onRanking={goRanking} onOptions={goOptions} />
      )}
      {isPlay && <Crople onMenu={goMenu} />}
      {isRanking && <Ranking onMenu={goMenu} />}
      {isOptions && (
        <Options
          onSignUp={onSignUpAnimation}
          onLogin={onLogInAnimation}
          onMenu={goMenu}
          onSettings={onOptionsAnimation}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: (colors) => ({
    flex: 1,
    backgroundColor: colors.background,
  }),
  gradientScreen: {
    top: 0,
    position: 'absolute',
    width: '100%',
    height: '80%',
    borderBottomStartRadius: Dimensions.get('window').width / 2,
    borderBottomEndRadius: Dimensions.get('window').width / 2,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  activityIndicator: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleHolder: {
    position: 'absolute',
    justifyContent: 'flex-end',
    width: '100%',
    height: '30%',
  },
  titleBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientSun: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  title: (colors, fonts) => ({
    position: 'absolute',
    fontFamily: fonts.title,
    color: colors.gameDetails,
    fontSize: 30,
  }),
});

export default AuthScreen;
