import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  textInput: {
    borderWidth: 2,
    borderRadius: 6,
    padding: 5,
    width: widthPercentageToDP('86%'),
    left: widthPercentageToDP('2%'),
    height: heightPercentageToDP('5%'),
  },
  bottomView: {
    // top: heightPercentageToDP('80%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listView: {
    borderWidth: 1,
    margin: 3,
    width: widthPercentageToDP('55%'),
    marginBottom: 4,
    borderRadius: 6,
    padding: 4,
  },
});
