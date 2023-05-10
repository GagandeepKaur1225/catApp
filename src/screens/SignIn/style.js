import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  mainView: {
    top: heightPercentageToDP('0%'),
    width: widthPercentageToDP('95%'),
    height: heightPercentageToDP('95%'),
    left: widthPercentageToDP('4.8%'),
  },
  mainHeading: {
    fontSize: 55,
    alignSelf: 'center',
    color: '#87CEEB',
    fontWeight: '900',
    marginVertical: heightPercentageToDP('4%'),
    marginTop: heightPercentageToDP('10%'),
  },
  submitButton: {
    alignSelf: 'center',
    width: widthPercentageToDP('40%'),
    borderRadius: 8,
    marginTop: heightPercentageToDP('1%'),
    height: heightPercentageToDP('4%'),
    backgroundColor: '#87CEEB',
    justifyContent: 'center',
    marginBottom: '2%',
  },
  buttonText: {
    color: '#fff',
    alignSelf: 'center',
    fontWeight: '900',
  },
  errText: {
    color: '#FF0000',
    left: widthPercentageToDP('2.5%'),
    width: widthPercentageToDP('85%'),
  },
  signUp: {
    alignSelf: 'center',
    padding: 10,
    fontSize: 16,
    fontWeight: '600',
  },
});
