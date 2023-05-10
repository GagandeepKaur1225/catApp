import { Text, View } from 'react-native';

import Home from '../Home';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import SignIn from '../../screens/SignIn';
import SignUp from '../../screens/SignUp';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const LoggedOut = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="SignUp"
      >
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Home" component={Home} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default LoggedOut;
