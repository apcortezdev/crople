import { useTheme } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View, Animated } from 'react-native';
import { Caption } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import MenuBase from '../components/MenuBase';
import RankComponent from '../components/RankComponent';
import * as rankActions from '../store/rank.actions';

const Ranking = (props) => {
  const { colors, fonts } = useTheme();
  const [isRefreshing, setIsRegreshing] = useState(false);
  const rank = useSelector((state) => state.rank.rank);
  const position = useSelector((state) => state.rank.position);

  const dispatch = useDispatch();

  const opacityOpen = useRef(new Animated.Value(0)).current;
  const scaleOpen = useRef(new Animated.Value(0.9)).current;
  const openStylesAnimation = {
    opacity: opacityOpen,
    transform: [{ scale: scaleOpen }],
  };

  const loadRanks = async () => {
    setIsRegreshing(true);
    dispatch(rankActions.fetchRanks());
    setIsRegreshing(false);
  };

  const openAnimation = Animated.parallel([
    Animated.timing(scaleOpen, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }),
    Animated.timing(opacityOpen, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }),
  ])

  useEffect(() => {
    openAnimation.start();
    setIsRegreshing(true);
    loadRanks().then(() => {
      setIsRegreshing(false);
    });
  }, []);

  return (
    <View style={styles.screen}>
      <MenuBase onPressMenu={props.onMenu} />
      <View style={styles.rankingContainer}>
        <Animated.View style={[styles.rankingPage(colors), openStylesAnimation]}>
          <View style={styles.listTitle}>
            <Text style={styles.text(colors, fonts)}>
              This is the top {rank.length} list
            </Text>
            <View>
              {position === 0 ? (
                <Text style={styles.text(colors, fonts)}>
                  But you are not on it yet!
                </Text>
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
        </Animated.View>
      </View>
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
  rankingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    width: '100%',
    height: '90%',
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
