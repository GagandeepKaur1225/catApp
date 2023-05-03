import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  mainStyle: {
    height: heightPercentageToDP('12%'),
    borderWidth: 0.2,
    width: widthPercentageToDP('95%'),
    left: widthPercentageToDP('3%'),
    marginVertical: heightPercentageToDP('3%'),
    borderRadius: 6,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.6,
  },
  groupName: {
    fontWeight: '800',
    fontSize: 18,
  },
  groupView: {
    flexDirection: 'row',
    padding: 8,
  },
  imageStyle: {
    height: '100%',
    borderRadius: 35,
    aspectRatio: 1,
  },
  groupImage: {
    backgroundColor: '#000',
    borderRadius: 35,
  },
});
