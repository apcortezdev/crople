import { Ionicons, AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';

const RankComponent = (props) => {
  const { colors, fonts } = useTheme();
  let userName = null;
  let score = null;
  let image = null;

  if (!!props.player) {
    userName = props.player[Object.keys(props.player)[0]].userName;
    score = props.player[Object.keys(props.player)[0]].highestScore;
    image = props.player[Object.keys(props.player)[0]].userImage;
  }

  let trophyColor;
  let trophy;
  let bgColor;
  switch (props.position) {
    case 1:
      trophy = 'md-trophy';
      trophyColor = colors.trophyColors.first;
      bgColor = colors.positionColors.first;
      break;
    case 2:
      trophy = 'md-trophy';
      trophyColor = colors.trophyColors.second;
      bgColor = colors.positionColors.second;
      break;
    case 3:
    case 4:
    case 5:
      trophy = 'md-trophy';
      trophyColor = colors.trophyColors.third;
      bgColor = colors.positionColors.third;
      break;
    default:
      trophy = 'md-trophy-outline';
      trophyColor = colors.trophyColors.outlined;;
      props.isHeader
        ? (bgColor = 'transparent')
        : props.isStandOut
        ? (bgColor = colors.positionColors.outlined)
        : (bgColor = colors.positionColors.other);
      break;
  }
  return (
    <View style={styles.rankLine(bgColor)}>
      <View style={styles.nameColumn}>
        {props.isHeader ? (
          <Text style={styles.text(colors, fonts)}>Player</Text>
        ) : (
          <View style={styles.userSnap}>
            <View style={styles.avatarContainer}>
              {!!image ? (
                <Avatar.Image
                  size={35}
                  source={{ uri: 'data:image/jpg;base64,' + image }}
                  theme={{colors}}
                />
              ) : (
                <Avatar.Icon
                  size={35}
                  theme={{colors}}
                  icon={() => <AntDesign name="user" size={24} color={colors.backgroundIcon} />}
                />
              )}
            </View>
            <Text style={styles.text(colors, fonts)}>{userName}</Text>
          </View>
        )}
      </View>
      <View style={styles.scoreColumn}>
        <Text style={styles.text(colors, fonts)}>{props.isHeader ? 'Score' : score}</Text>
      </View>
      <View style={styles.rankColumn}>
        <Text style={styles.text(colors, fonts)}>
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
  text: (colors, fonts) => ({
    color: colors.text,
    fontFamily: fonts.regular,
  }),
});

export default RankComponent;
