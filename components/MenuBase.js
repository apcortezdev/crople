import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

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

export default MenuBase;
