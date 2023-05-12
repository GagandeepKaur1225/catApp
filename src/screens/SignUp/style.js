import { Platform, StyleSheet } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

export const style = StyleSheet.create({
  mainView: {
    flex: 1,
    top:
      Platform.OS === 'ios'
        ? heightPercentageToDP('10%')
        : heightPercentageToDP('2%'),
    marginTop:
      Platform.OS === 'ios'
        ? heightPercentageToDP('-5%')
        : heightPercentageToDP('-4%'),
    width: widthPercentageToDP('97%'),
    height: heightPercentageToDP('100%'),
    left: widthPercentageToDP('2.1%'),
    marginBottom:
      Platform.OS === 'ios'
        ? heightPercentageToDP('20%')
        : heightPercentageToDP('25%'),
    // borderWidth: 2,
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
    marginTop: heightPercentageToDP('2%'),
    fontWeight: '600',
    padding:2
  },
  errText: {
    color: '#FF0000',
    left: widthPercentageToDP('2.5%'),
    width: widthPercentageToDP('85%'),
  },
  imageView: {
    alignContent: 'center',
    alignSelf: 'center',
    padding: 5,
  },
  image: {
    height: heightPercentageToDP('10%'),
    width: widthPercentageToDP('14%'),
    borderRadius: 30,
    aspectRatio: 1,
  },
});
