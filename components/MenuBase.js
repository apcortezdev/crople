import { Entypo } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PropTypes } from 'prop-types';

const MenuBase = (props) => {
  const { colors } = useTheme();
  return (
    <View style={styles.menuBase}>
      <Entypo name="menu" size={30} color={colors.gameDetails} onPress={props.onPressMenu} />
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
});

MenuBase.propTypes = {
  onPressMenu: PropTypes.func.isRequired,
}

export default MenuBase;
