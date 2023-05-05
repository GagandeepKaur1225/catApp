import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
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
import { filteredMessages } from '../util/utility';
import moment from 'moment';
import { style } from './style';

const GroupChat = () => {
  const today = useMemo(() => new Date().toDateString(), []);
  const yesterday = useMemo(() => {
    const y = new Date();
    const r = new Date();
    y.setDate(y.getDate() - 1);
    console.log(y.toDateString(), 'y we tried to find out');
    return y.toDateString();
  }, []);
  const [members, setMembers] = useState([]);
  const [reference, setReference] = useState(null);
  const [sent, setSent] = useState(false);
  const [loggedIn, setLoggedIn] = useState('');
  const [loggedId, setLoggedId] = useState('');
  const [groupId, setGroupId] = useState([]);
  const [arrayMessage, setArrayMessage] = useState();
  const [previous, setPrevious] = useState('');
  const firstRender = useRef(true);
  console.log(arrayMessage, 'array check');
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
  let dateOutsideResult;

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
    if (!groupId.includes(loggedId)) {
      addGroupMembers();
    } else {
      console.log('failure');
    }
  }, [sent]);

  let previousState;
  let previousDate;
  function itemView({ item, index }) {
    console.log(item, 'message in itemView');
    console.log(index, index - 1, 'indices are');

    console.log(loggedIn, 'userLogged flatlist is:');
    console.log(userInfo, 'userCheck variable value');
    let timeOfMsg = new Date(item.sentAt * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    let dateOfMsg = new Date(item.sentAt * 1000).toDateString();
    console.log(previous, 'we got previous state');
    let x = compareDate(dateOfMsg.slice(3, 15));
    console.log(x, 'now x becomes');
    previousState = x;
    setPrevious(x);
    firstRender.current = false;
    console.log(timeOfMsg, 'time at which msg was sent is');
    return (
      <View style={style.chatBox}>
        <View style={style.filterTimeView}>
          <View>
            {console.log(previousState, x, 'comparisons are')}
            <Text style={style.filterTime}>{x}</Text>
          </View>

          {filteredMessages(arrayMessage, today, yesterday).todayMessages
            .length > 0 && (
            <View>
              <Text>Today</Text>
              {filteredMessages(
                arrayMessage,
                today,
                yesterday,
              ).todayMessages.map((m, i) => (
                <Text>{m.text}</Text>
              ))}
            </View>
          )}
        </View>
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
      },
      error => {
        console.log('Message sending failed with error:', error);
      },
    );
  }

  function changeOcurred(data) {
    console.log(data, 'datad lhaksdhl');
    setMessageWritten(data);
  }

  function addGroupMembers() {
    let GUID = 'deafault_2122';
    let UID = loggedId;
    let membersList = [
      new CometChat.GroupMember(UID, CometChat.GROUP_MEMBER_SCOPE.PARTICIPANT),
    ];

    CometChat.addMembersToGroup(GUID, membersList, []).then(
      response => {
        console.log('response', response);
      },
      error => {
        console.log('Something went wrong', error);
      },
    );
  }

  return (
    <KeyboardAwareScrollView>
      {/* <SafeAreaView>
        <View style={style.chatHeader}>
          <View style={style.groupHeadingBox}>
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
            style={style.textInput}
            onChangeText={data => changeOcurred(data)}
            multiline={true}
          />
          <TouchableOpacity onPress={sendMessages}>
            <Text>send</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView> */}
      {filteredMessages(arrayMessage, today, yesterday).todayMessages.length >
        0 && (
        <View>
          <Text>Today</Text>
          {filteredMessages(arrayMessage, today, yesterday).todayMessages.map(
            (m, i) => (
              <Text>{m.text}</Text>
            ),
          )}
          {filteredMessages.yesterdayMessages.length > 0 && (
            <View>
              <Text>Yesterday</Text>
              {filteredMessages.yesterdayMessages.map((m, i) => (
                <Text>{m.text}</Text>
              ))}
            </View>
          )}
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};

export default GroupChat;
