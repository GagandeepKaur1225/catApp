import { Text, View } from 'react-native';

import GroupChat from '../../screens/GroupChat';
import Home from '../Home';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import SignIn from '../../screens/SignIn';
import SignUp from '../../screens/SignUp';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const LoggedIN = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="GroupChat" component={GroupChat} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default LoggedIN;
