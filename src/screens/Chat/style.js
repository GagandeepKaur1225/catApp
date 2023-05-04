import { Platform, StyleSheet } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

export const style = StyleSheet.create({
  mainView: {
    top:
      Platform.OS === 'ios'
        ? heightPercentageToDP('4.1%')
        : heightPercentageToDP('0%'),
    height: heightPercentageToDP('100%'),
  },
  imageStyle: {
    height: heightPercentageToDP('15%'),
    width: widthPercentageToDP('40%'),
    left: widthPercentageToDP('5%'),
    borderRadius: 35,
    aspectRatio: 1,
  },
  profileName: {
    left: widthPercentageToDP('8%'),
    fontWeight: '900',
    fontSize: 22,
  },
  upperView: {
    flexDirection: 'row',
    borderBottomWidth: 3,
    padding: 4,
    marginBottom: heightPercentageToDP('2%'),
  },
  groupsHeader: {
    fontSize: 16,
    fontWeight: '600',
    left: widthPercentageToDP('3%'),
  },
});
