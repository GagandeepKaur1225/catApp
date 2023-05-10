import { Platform, StyleSheet } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

export const style = StyleSheet.create({
  textInput: {
    borderWidth: 2,
    borderRadius: 6,
    padding: 5,
    width: widthPercentageToDP('85%'),
    left: widthPercentageToDP('2%'),
    height: heightPercentageToDP('7%'),
    position: 'relative',
    zIndex: 2
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
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#43ba7e',
  },
  flatList: {
    height:
      Platform.OS === 'ios'
        ? heightPercentageToDP('75%')
        : heightPercentageToDP('75%'),
  },
  groupImage: {
    height: '48%',
    width: '23%',
    aspectRatio: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  sentMsg: {
    left:
      Platform.OS === 'ios'
        ? widthPercentageToDP('30%')
        : widthPercentageToDP('35%'),
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
  filterTime: {
    alignSelf: 'center',
    color: '#fff',
  },
  filterTimeView: {
    // borderWidth: 2,
    width: widthPercentageToDP('30%'),
    left: widthPercentageToDP('35%'),
    backgroundColor: '#43ba7e',
    borderRadius: 4,
    marginBottom: heightPercentageToDP('2%'),
  },
  backButton: {
    height: '45%',
    width: '15%',
    aspectRatio: 1,
  },
  sendButton: {
    height: '25%',
    width: '25%',
    aspectRatio: 1,
    left: '-16%',
  },
});
