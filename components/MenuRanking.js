import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const MenuRanking = (props) => {
  return (
    <View style={styles.menuBase}>
      <MaterialIcons
        name="keyboard-backspace"
        size={24}
        color="black"
        onPress={props.onPressRanking}
      />
      <Text style={styles.logo}>Ranking!</Text>
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

export default MenuRanking;
