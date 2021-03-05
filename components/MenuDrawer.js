import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Caption, Divider, Drawer, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import * as authActions from '../store/auth.actions';

const MenuDrawer = (props) => {
  const maxScore = useSelector((state) => state.game.maxPoints);
  const position = useSelector((state) => state.game.position);
  const userName = useSelector((state) => state.auth.userName);

  const dispatch = useDispatch();

  const signout = () => {
    props.navigation.closeDrawer();
    dispatch(authActions.logout());
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfo}>
            <Avatar.Text size={80} label="XD" />
            <View style={styles.userTitle}>
              <Title style={styles.title}>@{userName}</Title>
              <View style={styles.trophy}>
                <Ionicons name="md-trophy-outline" size={14} color="black" />
                <View style={{ paddingLeft: 5 }}>
                  <Caption styles={styles.labelStyle}>{maxScore}</Caption>
                </View>
              </View>
            </View>
          </View>
          <Drawer.Section>
            <DrawerItem
              icon={({ color, size }) => (
                <FontAwesome5 name="flag-checkered" size={size} color={color} />
              )}
              label={position.toString()}
              labelStyle={styles.labelStyle}
              onPress={() => {
                props.navigation.navigate('Ranking');
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Ionicons name="settings-outline" size={size} color={color} />
              )}
              label="Settings"
              labelStyle={styles.labelStyle}
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
          labelStyle={styles.labelStyle}
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
  labelStyle: {
    fontFamily: 'OpenSans',
  },
  title: {
    color: 'black',
    fontFamily: 'OpenSans',
  },
});

export default MenuDrawer;
