import { Text, View } from 'react-native';

import Chat from '../../screens/Chat';
import Profile from '../../screens/Profile';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const Home = () => {
  return (
    <Tab.Navigator
      initialRouteName="Chat"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default Home;
