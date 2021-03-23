import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PropTypes } from 'prop-types';

const MenuReturn = (props) => {
  return (
    <View style={styles.menuBase}>
      <MaterialIcons
        name="keyboard-backspace"
        size={30}
        color="black"
        onPress={props.onPressBack}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  menuBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 35,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  menuButtonContainer: {
    overflow: 'hidden',
    borderRadius: 17,
  },
  menuButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

MenuReturn.propTypes = {
  onPressBack: PropTypes.func.isRequired,
};

export default MenuReturn;
