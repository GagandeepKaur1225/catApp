import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  LogBox,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { CometChat } from '@cometchat-pro/react-native-chat';
import { Images } from '../../shared/images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScrollView } from 'react-native-gesture-handler';
import { filteredMessages } from '../util/utility';
import { format } from 'prettier';
import moment from 'moment';
import { style } from './style';
import { useNavigation } from '@react-navigation/native';

const GroupChat = () => {
  const navigation = useNavigation();
  const [members, setMembers] = useState([]);
  const [changedState, setChangedState] = useState(false);
  const [reference, setReference] = useState(null);
  const [sent, setSent] = useState(false);
  const [loggedIn, setLoggedIn] = useState('');
  const [loggedId, setLoggedId] = useState('');
  const [groupId, setGroupId] = useState([]);
  const [arrayMessage, setArrayMessage] = useState([]);
  const firstRender = useRef(true);
  const changeInDate = useRef(true);
  const lastMsgRef = useRef('');
  console.log(arrayMessage, 'array check');
  const dateOutside = Date.now();
  const [messageWritten, setMessageWritten] = useState('');
  let userInfo;
  function fetchMessages() {
    let GUID = 'deafault_2122';
    let messagesRequest = new CometChat.MessagesRequestBuilder()
      .setGUID(GUID)
      .setLimit(50)
      .build()
      .fetchPrevious();
    messagesRequest.then(res => {
      console.log(res, 'response');
      setArrayMessage(res);
    });

    console.log(messagesRequest, 'requested messages are');
  }
  function getGroupMembers() {
    let GUID = 'deafault_2122';
    let limit = 30;
    let groupMembersRequest = new CometChat.GroupMembersRequestBuilder(GUID)
      .setLimit(limit)
      .build();
    groupMembersRequest.fetchNext().then(
      groupMembers => {
        console.log('Group Member list fetched successfully:', groupMembers);
        let list = groupMembers.map(data => {
          console.log(data, 'group members data is');
          groupId.push(data.uid);
          return data.name;
        });
        setMembers(list);
      },
      error => {
        Alert.alert(error.code);
        console.log('Group Member list fetching failed with exception:', error);
      },
    );
    console.log(groupMembersRequest, 'members of this group are');
  }

  function compareDate(date) {
    var dateNow = new Date().toDateString();
    console.log(dateNow, 'date we got for today is:');
    console.log(dateNow, date, 'sliced date is');
    if (date === dateNow.slice(3, 15)) {
      const today = 'Today';
      return today;
    } else if (
      date.slice(1, 4) === dateNow.slice(4, 7) &&
      +date.slice(5, 7) === dateNow.slice(8, 10) - 1
    ) {
      const yesterday = 'Yesterday';
      return yesterday;
    } else {
      console.log(
        typeof date,
        date.slice(1, 4),
        dateNow.slice(4, 7),
        date.slice(5, 7),
        dateNow.slice(8, 10),
        'checking varios dates',
      );
      return date;
    }
  }

  useEffect(() => {
    getGroupMembers();
    fetchMessages();
    console.log(sent, 'sent state is');
    console.log(reference, 'state of the fltlist is');
    if (reference) {
      reference.scrollToEnd({ animated: true });
    }
    const loggedUser = CometChat.getLoggedinUser().then(data => {
      console.log(data, 'whole data of logged user is:');
      console.log(data.name, 'user logged in is');
      setLoggedIn(data.name);
      setLoggedId(data.uid);
    });
    console.log(groupId, 'groupId in screen is');
  }, [sent]);

  useEffect(() => {
    if (reference && arrayMessage.length !== 0) {
      console.log('scrolled to end');
      reference.scrollToEnd({ animated: true });
    } else if (!reference) {
      console.log('reference not found');
    }
  }, [reference]);

  function itemView({ item, index }) {
    console.log(item, 'ITEM', lastMsgRef?.current, 'lastMsgRef?.current');
    const dateOfCurrentMsg = new Date(item.sentAt * 1000).toDateString();
    const dateOfPreviousMsg = new Date(
      lastMsgRef?.current.sentAt * 1000,
    ).toDateString();
    console.log(dateOfCurrentMsg, dateOfPreviousMsg, 'we are chcek ref values');
    function checkDate(dateOfCurrentMsg, dateOfPreviousMsg) {
      if (dateOfCurrentMsg === dateOfPreviousMsg) {
        setChangedState(false);
        changeInDate.current = false;
        console.log('data checked  for equality in if');
      } else {
        setChangedState(true);
        changeInDate.current = true;
        console.log('data checked  for equality in else');
      }
    }
    checkDate(dateOfCurrentMsg, dateOfPreviousMsg);
    lastMsgRef.current = item;
    let dateOfMsg = new Date(item.sentAt * 1000).toString();
    console.log(item, 'message in itemView');
    console.log(index, index - 1, 'indices are');

    console.log(loggedIn, 'userLogged flatlist is:');
    console.log(userInfo, 'userCheck variable value');
    let timeOfMsg = new Date(item.sentAt * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    console.log(dateOfMsg, 'date at which msg was sent');
    let x = compareDate(dateOfMsg.slice(3, 15));
    console.log(x, 'now x becomes');
    firstRender.current = false;
    console.log(timeOfMsg, 'time at which msg was sent is');
    return (
      <View style={style.chatBox}>
        {changeInDate?.current === true ? (
          <View style={style.filterTimeView}>
            <View>
              <Text>{x}</Text>
            </View>
          </View>
        ) : null}

        <View
          style={
            loggedIn === item.sender.name ? style.sentMsg : style.receivedMsg
          }
        >
          <View style={style.listView}>
            <Text style={style.senderName}>{item.sender.name}</Text>
            <Text>{item.text}</Text>
          </View>
          <Text style={style.chatTime}>{timeOfMsg}</Text>
        </View>
      </View>
    );
  }

  function sendMessages() {
    const dateNow = Date.now();
    console.log(dateNow, 'time when the button was pressed');
    console.log('send message pressed');
    let receiverID = 'deafault_2122';
    let messageText = messageWritten;
    let receiverType = CometChat.RECEIVER_TYPE.GROUP;
    let textMessage = new CometChat.TextMessage(
      receiverID,
      messageText,
      receiverType,
    );
    CometChat.sendMessage(textMessage).then(
      message => {
        console.log('Message sent successfully:', message);
        fetchMessages();
        setSent(prev => !prev);
        const dateThen = Date.now();
        console.log(
          dateThen,
          'time when the button was pressed and the function was called',
        );
      },
      error => {
        console.log('Message sending failed with error:', error);
      },
    );
    setMessageWritten('');
  }

  function changeOcurred(data) {
    console.log(data, 'datad lhaksdhl');
    setMessageWritten(data);
  }

  return (
    <KeyboardAwareScrollView>
      <ScrollView>
        <SafeAreaView>
          <View style={style.chatHeader}>
            <View style={style.groupHeadingBox}>
              <TouchableOpacity>
                <Image
                  source={Images.backButton}
                  style={style.backButton}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <Image
                source={Images.defaultProfile}
                style={style.groupImage}
                resizeMode="cover"
              />
              <View style={{ flexDirection: 'column' }}>
                <Text style={style.groupHeading}>DEFAULT GROUP</Text>
                <Text></Text>
                <Text>{members.length} participants</Text>
              </View>
            </View>
            <View style={{ alignSelf: 'center' }}>
              <TouchableOpacity>
                <Image
                  source={Images.participants}
                  style={style.participantsImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={style.flatList}>
            <ImageBackground source={Images.groupBackground} resizeMode="cover">
              <FlatList
                data={arrayMessage}
                renderItem={itemView}
                keyExtractor={(_, index) => index.toString()}
                ref={ref => {
                  setReference(ref);
                }}
              />
            </ImageBackground>
          </View>
          <View style={style.bottomView}>
            <TextInput
              placeholder="Enter the message"
              value={messageWritten}
              style={style.textInput}
              onChangeText={data => changeOcurred(data)}
              multiline={true}
              clearButtonMode="always"
            />
            <TouchableOpacity
              hitSlop={{
                top: 30,
                left: 30,
                bottom: 30,
                right: 30,
              }}
              onPress={sendMessages}
            >
              <Image source={Images.sendButton} style={style.sendButton} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

export default GroupChat;
