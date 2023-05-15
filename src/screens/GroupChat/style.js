import { Platform, StyleSheet } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

export const style = StyleSheet.create({
  textInput: {
    borderWidth: 2,
    borderRadius: 6,
    borderColor: 'blue',
    width: '86%',
    height: heightPercentageToDP('8%'),
    zIndex: 2,
  },
  bottomView: {
    // position: 'absolute',
    // bottom: 0,
    // flex: 1,
    borderRadius: 2,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: heightPercentageToDP('10%'),
    width: widthPercentageToDP('100%'),
    zIndex: 1,
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
    // height:
    //   Platform.OS === 'ios'
    //     ? heightPercentageToDP('75%')
    //     : heightPercentageToDP('75%'),
    borderWidth: 2,
    flex:1
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
    height: '80%',
    width: '50%',
    aspectRatio: 1,
    left: '-2%',
    top: '3%',
  },
  loaderStyle: {
    top: heightPercentageToDP('10%'),
    height: heightPercentageToDP('5%'),
    width: widthPercentageToDP('100%'),
    flex: 1,
  },
});
