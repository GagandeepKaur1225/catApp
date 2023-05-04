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
    width: widthPercentageToDP('80%'),
    left: widthPercentageToDP('2%'),
    height: heightPercentageToDP('5%'),
  },
  bottomView: {
    // top: heightPercentageToDP('80%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  listView: {
    // borderWidth: 0.2,
    margin: 3,
    width: widthPercentageToDP('60%'),
    marginBottom: 4,
    borderRadius: 6,
    padding: 4,
    backgroundColor: '#fff',
  },
  groupHeading: {
    fontSize: 18,
    fontWeight: '700',
  },
  chatHeader: {
    height: heightPercentageToDP('8%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  groupHeadingBox: {
    height: '100%',
    flexDirection: 'row',
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#43ba7e',
  },
  groupImage: {
    height: '50%',
    width: '23%',
    aspectRatio: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  sentMsg: {
    left: widthPercentageToDP('30%'),
  },
  receivedMsg: {
    left: widthPercentageToDP('2%'),
  },
  chatTime: {
    right: widthPercentageToDP('-45%'),
  },
  chatBox: {
    padding: 5,
  },
  participantsImage: {
    height: '80%',
    aspectRatio: 1,
    marginRight: 10,
  },
});
