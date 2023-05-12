import { Platform, StyleSheet } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

export const style = StyleSheet.create({
  mainView: {
    top:
      Platform.OS === 'ios'
        ? heightPercentageToDP('6%')
        : heightPercentageToDP('0%'),
    height: heightPercentageToDP('100%'),
  },
  logOut: {
    alignSelf: 'center',
    padding: 8,
    backgroundColor: '#43ba7e',
    borderRadius: 6,
    height: heightPercentageToDP('7%'),
    width: widthPercentageToDP('30%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800',
  },
  imageStyle: {
    height: heightPercentageToDP('15%'),
    width: widthPercentageToDP('40%'),
    borderRadius: 35,
    aspectRatio: 1,
    alignSelf: 'center',
    marginBottom: heightPercentageToDP('2%'),
  },
  emptyText: { width: widthPercentageToDP('26%') },
  profileTop: {
    flexDirection: 'row',
    alignContent: 'space-around',
    padding: 10,
    marginBottom: heightPercentageToDP('3%'),
  },
  myProfileText: {
    fontWeight: '700',
    fontSize: 20,
  },
  infoView: {
    left: widthPercentageToDP('25%'),
    padding: 5,
    flexDirection: 'row',
    alignContent: 'space-between',
    marginBottom: heightPercentageToDP('2%'),
  },
  nameView: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: heightPercentageToDP('5%'),
  },
});
