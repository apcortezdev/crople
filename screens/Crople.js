import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Points from '../components/ScoreBoard';
import Board from '../components/GameBoard';
import MenuBase from '../components/MenuBase';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { fetchRanks } from '../store/rank.actions';
import { useTheme } from '@react-navigation/native';

const Crople = (props) => {
  const { colors, fonts } = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRanks());
  }, []);

  return (
    <View style={styles.fullscreen}>
      <LinearGradient
        colors={[colors.accent, colors.secondary, colors.primary]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.screen}>
          <MenuBase
            onPressMenu={() => {
              props.navigation.openDrawer();
            }}
            onPressRanking={() => {
              props.navigation.navigate('Ranking');
            }}
          />
          <View style={styles.scoreWrapper}>
            <Points />
          </View>
          <Board />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    height: '100%',
    paddingHorizontal: Dimensions.get('window').width * 0.03,
    paddingTop: Dimensions.get('window').height * 0.03,
  },
  fullscreen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scoreWrapper: {
    height: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Crople;
