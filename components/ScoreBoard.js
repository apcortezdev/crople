import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@react-navigation/native';

const Points = (props) => {
  const { colors, fonts } = useTheme();

  const score = useSelector((state) => state.game.points);
  const scoreScale = useRef(new Animated.Value(1)).current;
  const scoreAnimatedStyle = {
    transform: [{ scale: scoreScale }],
  };

  useEffect(() => {
    Animated.timing(scoreScale, {
      toValue: 1.5,
      duration: 50,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(scoreScale, {
        toValue: 1,
        duration: 50,
        useNativeDriver: false,
      }).start();
    });
  }, [score]);

  return (
    <LinearGradient
      colors={[colors.scoreBoardColors.primary, colors.scoreBoardColors.accent]}
      style={styles.pointsScreen}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Animated.View style={scoreAnimatedStyle}>
        <Text style={styles.score(colors, fonts)}>{score}</Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  pointsScreen: {
    width: Dimensions.get('window').width * 0.2,
    height: Dimensions.get('window').width * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    elevation: 10,
  },
  score: (colors, fonts) => ({
    fontFamily: fonts.regular,
    fontSize: 35,
    color: colors.text,
  }),
});

export default Points;
