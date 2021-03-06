import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import MenuReturn from '../components/MenuReturn';
import RankComponent from '../components/RankComponent';

const Ranking = (props) => {
  const [isRefreshing, setIsRegreshing] = useState(false);

  const position = useSelector((state) => state.game.position);
  const rank = useSelector((state) => state.rank.rank);

  const loadRanks = () => {
    setIsRegreshing(true);
    setIsRegreshing(false);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.gradientScreen}>
        <LinearGradient
          colors={['#F63A65', '#f9ab8f']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.menuScreen}>
            <MenuReturn
              onPressBack={() => {
                props.navigation.goBack();
              }}
            />
          </View>
        </LinearGradient>
      </View>
      <View style={styles.rankingContainer}>
        <View style={styles.rankingPage}>
          <View style={styles.listTitle}>
            <Text style={styles.text}>This is the top 100 list</Text>
            <View>
              {position === 0 ? (
                <Text style={styles.text}>But you are not on it yet!</Text>
              ) : (
                <Text style={styles.text}>
                  You are in the {position.toString()}# position!
                </Text>
              )}
            </View>
          </View>
          <View style={styles.rankingList}>
            <RankComponent isHeader={true} />
            <FlatList
              onRefresh={loadRanks} // Pull to Refresh effect
              refreshing={isRefreshing} // Pull to Refresh effect
              keyExtractor={(item, index) => index.toString()}
              data={rank}
              renderItem={({ item, index }) =>
                index + 1 === position ? (
                  <RankComponent
                    position={index + 1}
                    isStandOut={true}
                    player={null}
                  />
                ) : (
                  <RankComponent
                    position={index + 1}
                    isStandOut={false}
                    player={null}
                  />
                )
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradientScreen: {
    flex: 0.3,
    borderBottomStartRadius: 30,
    borderBottomEndRadius: 30,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  menuScreen: {
    paddingHorizontal: '3%',
    paddingTop: Dimensions.get('window').height * 0.03,
  },
  rankingContainer: {
    flex: 1,
    position: 'absolute',
    top: Dimensions.get('window').height * 0.15,
    alignItems: 'center',
    width: '100%',
    height: '80%',
  },
  rankingPage: {
    backgroundColor: 'white',
    opacity: 0.99,
    borderRadius: 30,
    width: '90%',
    height: '100%',
    alignItems: 'center',
    padding: '5%',
  },
  listTitle: {
    width: '90%',
    alignItems: 'center',
    paddingBottom: 15,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  text: {
    color: '#1b1b1b',
    fontFamily: 'OpenSans',
  },
  rankingList: {
    flexShrink: 1,
    flexGrow: 1,
    width: '100%',
  },
});

export default Ranking;
