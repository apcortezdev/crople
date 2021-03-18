// import React from 'react';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { createStackNavigator } from '@react-navigation/stack';
// import Crople from '../screens/Crople';
// import MenuDrawer from '../components/MenuDrawer';
// import Ranking from '../screens/Ranking';
// import Settings from '../screens/Settings';
// import { useSelector } from 'react-redux';
// import AuthScreen from '../screens/Auth';
// import Startup from '../screens/Startup';

// const Stack = createStackNavigator();

// const defaultStackNavigatorOptions = () => ({
//   headerShown: false,
// });

// const stackScreens = () => {
//   const userToken = useSelector((state) => state.auth.userToken);

//   return (
//     <Stack.Navigator
//       initialRouteName="Crople"
//       screenOptions={defaultStackNavigatorOptions}
//     >
//       {!!userToken ? (
//         <>
//           <Stack.Screen name="Crople" component={Crople}/>
//           <Stack.Screen name="Ranking" component={Ranking} />
//           <Stack.Screen name="Settings" component={Settings} />
//         </>
//       ) : (
//         <>
//           <Stack.Screen name="Startup" component={Startup} />
//           <Stack.Screen name="Auth" component={AuthScreen} />
//         </>
//       )}
//     </Stack.Navigator>
//   );
// };

// const Drawer = createDrawerNavigator();

// const CropleNavigator = (props) => {
//   return (
//     <Drawer.Navigator
//       initialRouteName="Crople"
//       drawerContent={(props) => <MenuDrawer {...props} />}
//     >
//       <Drawer.Screen
//         name="Crople"
//         component={stackScreens}
//         options={{ swipeEnabled: false }}
//       />
//     </Drawer.Navigator>
//   );
// };

// export default CropleNavigator;
