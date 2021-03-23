import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Points from '../components/ScoreBoard';
import Board from '../components/GameBoard';
import MenuBase from '../components/MenuBase';
import { PropTypes } from 'prop-types';

const Crople = (props) => {
  return (
    <View style={styles.screen}>
      <MenuBase onPressMenu={props.onMenu} />
      <View style={styles.scoreWrapper}>
        <Points />
      </View>
      <Board />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
    paddingHorizontal: Dimensions.get('window').width * 0.03,
    paddingTop: Dimensions.get('window').height * 0.03,
  },
  scoreWrapper: {
    height: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

Crople.propTypes = {
  onMenu: PropTypes.func.isRequired,
}

export default Crople;
