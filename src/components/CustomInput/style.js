import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  inputStyle: {
    borderWidth: 2,
    backgroundColor: '#fff',
    width: widthPercentageToDP('84%'),
    height: heightPercentageToDP('6%'),
    borderRadius: 6,
    margin: heightPercentageToDP('1%'),
    flexDirection: 'row',
  },
  inputText: {
    width: widthPercentageToDP('72%'),
      height: heightPercentageToDP('6%'),
    padding: 8
  },
  textStyle: {
    left: widthPercentageToDP('2%'),
    fontWeight: '700',
  },
  focusedStyle: {
    borderColor: '#87CEEB',
  },
  required: {
    color: '#FF0000',
  },
  image: {
    height: heightPercentageToDP('3.5%'),
    width: widthPercentageToDP('9%'),
    position: 'absolute',
    left: widthPercentageToDP('1%'),
    top: heightPercentageToDP('1%'),
  },
});
