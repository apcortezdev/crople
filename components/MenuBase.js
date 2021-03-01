import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MenuBase = (props) => {
  return (
    <View style={styles.menuBase}>
      <Entypo name="menu" size={30} color="black" onPress={props.onPressMenu} />
      <Text style={styles.logo}>Crople</Text>
      <MaterialCommunityIcons name="podium" size={24} color="black" onPress={props.onPressRanking}/>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    fontFamily: 'Lexend',
    fontSize: 20,
    color: '#151515',
  },
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
