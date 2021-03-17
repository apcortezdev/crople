import {
  AntDesign,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Caption, Divider, Drawer, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/user.actions';
import { useTheme } from '@react-navigation/native';

const MenuDrawer = (props) => {
  const { colors, fonts } = useTheme();

  const highestScore = useSelector((state) => state.user.highestScore);
  const position = useSelector((state) => state.rank.position);
  const userName = useSelector((state) => state.user.userName);

  const image = useSelector((state) => state.user.userImage);
  const changesPending = useSelector((state) => state.temps.pending);

  const dispatch = useDispatch();

  const signout = () => {
    props.navigation.closeDrawer();
    dispatch(logout());
  };

  let trophyIcon;
  let trophyColor;

  switch (position) {
    case 1:
      trophyIcon = 'md-trophy';
      trophyColor = colors.trophyColor.first;
      break;
    case 2:
      trophyIcon = 'md-trophy';
      trophyColor = colors.trophyColor.second;
      break;
    case 3:
    case 4:
    case 5:
      trophyIcon = 'md-trophy';
      trophyColor = colors.trophyColor.third;
      break;
    default:
      trophyIcon = 'md-trophy-outline';
      trophyColor = colors.trophyColor.other;
      break;
  }

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfo}>
            <View>
              {!!!image ? (
                <Avatar.Icon
                  size={80}
                  icon={() => <AntDesign name="user" size={50} color={colors.backgroundIcon} />}
                  theme={{colors}}
                />
              ) : (
                <Avatar.Image
                  size={80}
                  source={{ uri: image }}
                  theme={{colors}}
                />
              )}
            </View>
            <View style={styles.userTitle}>
              <Text style={styles.titleOne(colors, fonts)}>@{userName}</Text>
              <View style={styles.trophy}>
                <Ionicons name={trophyIcon} size={14} color={trophyColor} />
                <View style={{ paddingLeft: 5 }}>
                  <Text style={styles.titleTwo(colors, fonts)}>
                    {position <= 0 ? '\u221E' : position.toString().concat('#')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Drawer.Section>
            <DrawerItem
              icon={({ color, size }) => (
                <FontAwesome5 name="flag-checkered" size={size} color={color} />
              )}
              label={'Your record: '.concat(highestScore.toString())}
              labelStyle={{fontFamily: fonts.medium,}}
              onPress={() => {
                props.navigation.navigate('Ranking');
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Ionicons name="settings-outline" size={size} color={color} />
              )}
              label={
                changesPending
                  ? ({ color, size }) => (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Text
                          style={[
                            styles.labelStyle,
                            { fontSize: size, color: color },
                          ]}
                        >
                          Settings
                        </Text>
                        <FontAwesome5
                          name="exclamation-circle"
                          size={size}
                          color={colors.highlight}
                        />
                      </View>
                    )
                  : 'Settings'
              }
              labelStyle={{fontFamily: fonts.medium,}}
              onPress={() => {
                props.navigation.navigate('Settings');
              }}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Divider />
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name="location-exit"
              size={size}
              color={color}
            />
          )}
          label="Sign Out"
          labelStyle={{fontFamily: fonts.medium,}}
          onPress={signout}
        />
      </Drawer.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 40,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  userTitle: {
    paddingLeft: 10,
  },
  trophy: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomDrawerSection: {
    marginBottom: 15,
  },
  titleOne: (colors, fonts) => ({
    color: colors.text,
    fontSize: 18,
    fontFamily: fonts.medium
  }),
  titleTwo: (colors, fonts) => ({
    color: colors.text,
    fontSize: 14,
    fontFamily: fonts.medium
  })
});

export default MenuDrawer;
