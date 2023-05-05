import { Text, View } from 'react-native';

import Chat from '../../screens/Chat';
import { CometChat } from '@cometchat-pro/react-native-chat';
import Profile from '../../screens/Profile';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();
const Home = () => {
  return (
    <Tab.Navigator
      initialRouteName="Chat"
      backBehavior="initialRoute"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#eaf2af',
          height: heightPercentageToDP('10%'),
        },
        tabBarItemStyle: {
          backgroundColor: '#43ba7e',
          margin: 5,
          borderRadius: 10,
        },
        tabBarLabelStyle: {
          fontWeight: '800',
          fontSize: 20,
        },
      }}
    >
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default Home;
