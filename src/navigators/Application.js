import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { SafeAreaView, StatusBar, View } from 'react-native';

import { CometChat } from '@cometchat-pro/react-native-chat';
import GroupChat from '../screens/GroupChat';
import Home from './Home';
import MainNavigator from './Main';
import React from 'react';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import { Startup } from '../screens';
import { createStackNavigator } from '@react-navigation/stack';
import { useFlipper } from '@react-navigation/devtools';
import { useTheme } from '../hooks';

const Stack = createStackNavigator();
// @refresh reset
const ApplicationNavigator = () => {
  const { Layout, darkMode, NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;
  const navigationRef = useNavigationContainerRef();
  useFlipper(navigationRef);
  let appID = '238441c85d5a28f8';
  let region = 'us';
  let appSetting = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(region)
    .autoEstablishSocketConnection(true)
    .build();
  CometChat.init(appID, appSetting).then(
    () => {
      console.log('Initialization completed successfully');
    },
    error => {
      console.log('Initialization failed with error:', error);
    },
  );
  return (
    <View style={[Layout.fill, { backgroundColor: colors.card }]}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="SignUp"
        >
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="GroupChat" component={GroupChat} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};
export default ApplicationNavigator;
