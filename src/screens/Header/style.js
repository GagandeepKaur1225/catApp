import { Platform, StyleSheet } from 'react-native';

import { heightPercentageToDP } from 'react-native-responsive-screen';

export const style = StyleSheet.create({
  chatHeader: {
    height:
      Platform.OS === 'ios'
        ? heightPercentageToDP('10%')
        : heightPercentageToDP('12%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  groupHeadingBox: {
    height: '100%',
    flexDirection: 'row',
  },
  backButton: {
    height: '60%',
    width: '10%',
    aspectRatio: 1,
  },
  groupImage: {
    height: '48%',
    width: '23%',
    aspectRatio: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  groupHeading: {
    fontSize: 18,
    fontWeight: '700',
  },
  participantsImage: {
    height: '80%',
    aspectRatio: 1,
    marginRight: 10,
  },
});
