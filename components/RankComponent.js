import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from 'react-native-paper';

const RankComponent = (props) => {
  let userName = null;
  let score = null;

  if (!!props.player) {
    userName = props.player[Object.keys(props.player)[0]].userName;
    score = props.player[Object.keys(props.player)[0]].highestScore;
  }

  let trophyColor;
  let trophy;
  let bgColor;
  switch (props.position) {
    case 1:
      trophy = 'md-trophy';
      trophyColor = '#FFD700';
      bgColor = '#FFF6C7';
      break;
    case 2:
      trophy = 'md-trophy';
      trophyColor = '#C0C0C0';
      bgColor = '#EFEFEF';
      break;
    case 3:
    case 4:
    case 5:
      trophy = 'md-trophy';
      trophyColor = '#CD7F32';
      bgColor = '#F3E0CE';
      break;
    default:
      trophy = 'md-trophy-outline';
      trophyColor = 'black';
      props.isHeader
        ? (bgColor = 'transparent')
        : props.isStandOut
        ? (bgColor = '#FEEDE7')
        : (bgColor = '#FAFAFA');
      break;
  }
  return (
    <View style={styles.rankLine(bgColor)}>
      <View style={styles.nameColumn}>
        {props.isHeader ? (
          <Text style={styles.text}>Player</Text>
        ) : (
          <View style={styles.userSnap}>
            <View style={styles.avatarContainer}>
              <Avatar.Text size={35} label="XD" />
            </View>
            <Text style={styles.text}>{userName}</Text>
          </View>
        )}
      </View>
      <View style={styles.scoreColumn}>
        <Text style={styles.text}>{props.isHeader ? 'Score' : score}</Text>
      </View>
      <View style={styles.rankColumn}>
        <Text style={styles.text}>
          {props.isHeader ? 'Rank' : props.position}
        </Text>
        {props.isHeader ? null : (
          <Ionicons name={trophy} size={20} color={trophyColor} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rankLine: (bgColor) => ({
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginVertical: 5,
    backgroundColor: bgColor,
  }),
  userSnap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    paddingRight: 15,
  },
  nameColumn: {
    width: '65%',
  },
  scoreColumn: {
    width: '20%',
    alignItems: 'center',
  },
  rankColumn: {
    width: '15%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  text: {
    color: '#1b1b1b',
    fontFamily: 'OpenSans',
  },
});

export default RankComponent;
