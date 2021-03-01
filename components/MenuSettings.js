import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const MenuSettings = (props) => {
  return (
    <View style={styles.menuBase}>
      <MaterialIcons
        name="keyboard-backspace"
        size={24}
        color="black"
        onPress={props.onPressSettings}
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
});

export default MenuSettings;
