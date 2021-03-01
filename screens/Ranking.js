import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MenuRanking from '../components/MenuRanking';

const Ranking = (props) => {
  return (
    <View style={styles.fullscreen}>
      <LinearGradient
        colors={['#F63A65', '#f9ab8f']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.screen}>
          <MenuRanking
            onPressMenu={() => {
              props.navigation.openDrawer();
            }}
            onPressRanking={() => {
              props.navigation.goBack();
            }}
          />
          <View style={styles.rankingList}/>
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
  rankingList: {
    flex: 1,
    height: '100%',
    marginBottom: 15,
    backgroundColor: 'white',
    opacity: .5,
    borderRadius: 30,
    elevation: 3,
  }
});

export default Ranking;
