import {
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import { CometChat } from '@cometchat-pro/react-native-chat';
import CustomInput from '../../components/CustomInput';
import { Images } from '../../shared/images';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { style } from './style';

const GroupChat = () => {
  const [members, setMembers] = useState([]);
  const [reference, setReference] = useState(null);
  const [sent, setSent] = useState(false);
  const [loggedIn, setLoggedIn] = useState('');
  const [loggedId, setLoggedId] = useState('');
  const [groupId, setGroupId] = useState([]);
  const [arrayMessage, setArrayMessage] = useState();
  console.log(arrayMessage, 'array check');
  const messageWritten = useRef('');
  let userInfo;
  function fetchMessages() {
    let GUID = 'deafault_2122';
    let messagesRequest = new CometChat.MessagesRequestBuilder()
      .setGUID(GUID)
      .setLimit(50)
      .build()
      .fetchPrevious();
    messagesRequest.then(res => {
      console.log(res);
      setArrayMessage(res);
    });
    if (reference) {
      reference.scrollToEnd({ animated: true });
    }

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
        console.log('Group Member list fetching failed with exception:', error);
      },
    );
    console.log(groupMembersRequest, 'members of this group are');
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
    if (!groupId.includes(loggedId)) {
      addGroupMembers();
    } else {
      console.log('failure');
    }
  }, [sent]);

  function itemView(item) {
    console.log(item, 'message in itemView');
    console.log(loggedIn, 'userLogged flatlist is:');
    console.log(userInfo, 'userCheck variable value');
    let timeOfMsg = new Date(item.sentAt * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    console.log(timeOfMsg, 'time at which msg was sent is');
    return (
      <View style={style.chatBox}>
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
    let receiverID = 'deafault_2122';
    let messageText = messageWritten.current;
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
    messageWritten.current = data;
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
    <SafeAreaView>
      <View style={style.chatHeader}>
        <View style={style.groupHeadingBox}>
          <Image
            source={Images.defaultProfile}
            style={style.groupImage}
            resizeMethod="cover"
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
      <View style={{ height: heightPercentageToDP('75%') }}>
        <ImageBackground source={Images.groupBackground} resizeMode="cover">
          <FlatList
            data={arrayMessage}
            renderItem={item => itemView(item.item)}
            keyExtractor={index => index.toString()}
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
        />
        <TouchableOpacity onPress={sendMessages}>
          <Text>send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GroupChat;
