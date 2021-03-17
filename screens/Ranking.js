import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { Caption } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import MenuReturn from '../components/MenuReturn';
import RankComponent from '../components/RankComponent';
import * as rankActions from '../store/rank.actions';
import { useTheme } from '@react-navigation/native';

const Ranking = (props) => {
  const { colors, fonts } = useTheme();
  const [isRefreshing, setIsRegreshing] = useState(false);
  const rank = useSelector((state) => state.rank.rank);
  const position = useSelector((state) => state.rank.position);

  const dispatch = useDispatch();

  const loadRanks = async () => {
    setIsRegreshing(true);
    dispatch(rankActions.fetchRanks());
    setIsRegreshing(false);
  };

  useEffect(() => {
    setIsRegreshing(true);
    loadRanks().then(() => {
      setIsRegreshing(false);
    });
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.gradientScreen}>
        <LinearGradient
          colors={[colors.accent, colors.primary]}
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
        <View style={styles.rankingPage(colors)}>
          <View style={styles.listTitle}>
            <Text style={styles.text(colors, fonts)}>This is the top {rank.length} list</Text>
            <View>
              {position === 0 ? (
                <Text style={styles.text(colors, fonts)}>But you are not on it yet!</Text>
              ) : (
                <Text style={styles.text(colors, fonts)}>
                  You are in the {position.toString()}# position!
                </Text>
              )}
            </View>
          </View>
          <View style={styles.rankingList}>
            <RankComponent isHeader={true} />
            {rank.length > 0 ? (
              <FlatList
                onRefresh={loadRanks} // Pull to Refresh effect
                refreshing={isRefreshing} // Pull to Refresh effect
                keyExtractor={(item) => Object.keys(item)[0]}
                data={rank}
                renderItem={({ item, index }) =>
                  index + 1 === position ? (
                    <RankComponent
                      position={index + 1}
                      isStandOut={true}
                      player={item}
                    />
                  ) : (
                    <RankComponent
                      position={index + 1}
                      isStandOut={false}
                      player={item}
                    />
                  )
                }
              />
            ) : (
              <View style={styles.enptyList}>
                <Caption>The internet is broken! Run to the hills!!</Caption>
                <Caption>Or just try again later...</Caption>
              </View>
            )}
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
  rankingPage: (colors) => ({
    backgroundColor: colors.card,
    opacity: 0.99,
    borderRadius: 30,
    width: '90%',
    height: '100%',
    alignItems: 'center',
    padding: '5%',
  }),
  listTitle: {
    width: '90%',
    alignItems: 'center',
    paddingBottom: 15,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  text: (colors, fonts) => ({
    color: colors.text,
    fontFamily: fonts.regular,
  }),
  rankingList: {
    flexShrink: 1,
    flexGrow: 1,
    width: '100%',
  },
  enptyList: {
    top: '15%',
    alignItems: 'center',
  },
});

export default Ranking;
