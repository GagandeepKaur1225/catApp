import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  mainView: {
    top: heightPercentageToDP('0%'),
    width: widthPercentageToDP('99%'),
    height: heightPercentageToDP('95%'),
    left: widthPercentageToDP('2.1%'),
  },
  innerView: {
    left: widthPercentageToDP('1%'),
    marginVertical: heightPercentageToDP('1%'),
  },
  mainHeading: {
    fontSize: 55,
    alignSelf: 'center',
    color: '#87CEEB',
    fontWeight: '900',
  },
  submitButton: {
    alignSelf: 'center',
    width: widthPercentageToDP('40%'),
    borderRadius: 8,
    marginTop: heightPercentageToDP('1%'),
    height: heightPercentageToDP('4%'),
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    alignSelf: 'center',
    fontWeight: '900',
  },
  signIn: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: heightPercentageToDP('3%'),
    fontWeight: '600',
  },
  errText: {
    color: '#FF0000',
    left: widthPercentageToDP('2.5%'),
    width: widthPercentageToDP('85%'),
  },
});
