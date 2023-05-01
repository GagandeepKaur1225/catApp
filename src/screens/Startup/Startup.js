import { ActivityIndicator, Text, View } from 'react-native';
import React, { useEffect } from 'react';

import { Brand } from '../../components';
import { setDefaultTheme } from '../../store/theme';
import { useTheme } from '../../hooks';
import { useTranslation } from 'react-i18next';
const Startup = ({ navigation }) => {
  const { Layout, Gutters, Fonts } = useTheme();
  const { t } = useTranslation();
  const init = async () => {
    await new Promise(resolve =>
      setTimeout(() => {
        resolve(true);
      }, 2000),
    );
    await setDefaultTheme({ theme: 'default', darkMode: null });
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <View style={[Layout.fill, Layout.colCenter]}>
      <Brand />
      <ActivityIndicator size={'large'} style={[Gutters.largeVMargin]} />
      <Text style={Fonts.textCenter}>{t('welcome:title')}</Text>
    </View>
  );
};
export default Startup;
