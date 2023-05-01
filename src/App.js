import 'react-native-gesture-handler';
import './translations';

import { persistor, store } from './store';

import ApplicationNavigator from './navigators/Application';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { Provider } from 'react-redux';
import React from 'react';
import SignUp from './screens/SignUp';

const App = () => (
  <Provider store={store}>
    {/**
     * PersistGate delays the rendering of the app's UI until the persisted state has been retrieved
     * and saved to redux.
     * The `loading` prop can be `null` or any react instance to show during loading (e.g. a splash screen),
     * for example `loading={<SplashScreen />}`.
     * @see https://github.com/rt2zz/redux-persist/blob/master/docs/PersistGate.md
     */}
    <PersistGate loading={null} persistor={persistor}>
      <ApplicationNavigator />
      {/* <SignUp /> */}
    </PersistGate>
  </Provider>
);
export default App;
