import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import { CometChat } from '@cometchat-pro/react-native-chat';
import CustomFlatlist from './CustomFlatlist';
import HeaderComponent from '../Header';
import { Images } from '../../shared/images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Messages from '../../database/models/messages';
import { Q } from '@nozbe/watermelondb';
import database from '../../database';
import { style } from './style';

const GroupChat = () => {
  const refList = useRef();
  const [loading, setLoading] = useState(true);
  const arrayDummy = useRef([]);
  const [members, setMembers] = useState([]);
  const [loggedIn, setLoggedIn] = useState('');
  const [loggedId, setLoggedId] = useState('');
  const [groupId, setGroupId] = useState([]);
  const [arrayMessage, setArrayMessage] = useState([]);
  const [sendingMsg, setSendingMsg] = useState(false);
  console.log(arrayMessage, 'array check');
  console.log('re rendered parent');
  const [messageWritten, setMessageWritten] = useState('');
  console.log(loading, 'state to be checked outside loading');
  useEffect(() => {
    getGroupMembers();
    console.log('re rendered');
    fetchMessages();
    getRealMessages();
    getMessages();
  }, []);

  useEffect(() => {
    if (arrayMessage.length !== 0) {
      sendMessagesDatabase();
    }
  }, [arrayMessage]);

  async function sendMessagesDatabase() {
    const checkVariable = await database.get('messages').query();
    console.log(checkVariable, 'values in db are');

    arrayDummy.current?.map(async arrayItem => {
      console.log(arrayItem, 'item in database function');
      await database.write(async () => {
        const record = await database
          .get('messages')
          .query(Q.where('idMessage', arrayItem.id))
          .fetchCount();
        if (record === 0) {
          return await database.get('messages').create(data => {
            data.text = arrayItem.text;
            data.sentAt = arrayItem.updatedAt;
            data.idMessage = arrayItem.id;
            data.sender = arrayItem.sender.name;
            data.type = arrayItem.type;
            data.receiverId = arrayItem.receiverId;
          });
        }
      });
    });
  }
  function fetchMessages() {
    console.log('here');
    let GUID = 'deafault_2122';
    const loggedUser = CometChat.getLoggedinUser().then(data => {
      setLoggedIn(data.name);
      setLoggedId(data.uid);
    });
    let messagesRequest = new CometChat.MessagesRequestBuilder()
      .setGUID(GUID)
      .setLimit(50)
      .build()
      .fetchPrevious();
    messagesRequest.then(res => {
      const arrayReversed = res;
      arrayReversed.reverse();
      // setArrayMessage([...arrayReversed]);
      arrayDummy.current = arrayReversed;
      // setLoading(false);
      sendMessagesDatabase();
    });
  }
  function getGroupMembers() {
    let GUID = 'deafault_2122';
    let limit = 30;
    let groupMembersRequest = new CometChat.GroupMembersRequestBuilder(GUID)
      .setLimit(limit)
      .build();
    groupMembersRequest.fetchNext().then(
      groupMembers => {
        let list = groupMembers.map(data => {
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
  }

  function sendMessages() {
    setSendingMsg(true);
    let receiverID = 'deafault_2122';
    let messageText = messageWritten;
    let receiverType = CometChat.RECEIVER_TYPE.GROUP;
    let textMessage = new CometChat.TextMessage(
      receiverID,
      messageText,
      receiverType,
    );
    console.log(sendingMsg, 'state for sending messages is:');
    CometChat.sendMessage(textMessage).then(
      message => {
        arrayMessage.unshift(message);
        setSendingMsg(false);
        setMessageWritten('');
        refList.current.scrollToIndex({ index: 0, animated: true });
        console.log(sendingMsg, 'reversed array after appending is');
      },
      error => {
        console.log('Message sending failed with error:', error);
        Alert.alert(error.message);
        setSendingMsg(false);
      },
    );
  }

  function changeOcurred(data) {
    setMessageWritten(data);
  }

  async function getMessages() {
    setLoading(true);
    const checkVariable = await database
      .get('messages')
      .query(Q.sortBy('sentAt', Q.asc));
    console.log(checkVariable.reverse(), 'chacking data to retrieve');
    const arrayReverse = checkVariable;
    setArrayMessage(arrayReverse);
    setLoading(false);
  }

  function getRealMessages() {
    let listenerID = 'deafault_2122';

    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: textMessage => {
          console.log('Text message received successfully', textMessage);
        },
        onMediaMessageReceived: mediaMessage => {
          console.log('Media message received successfully', mediaMessage);
        },
        onCustomMessageReceived: customMessage => {
          console.log('Custom message received successfully', customMessage);
        },
      }),
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <HeaderComponent members={members.length} />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          behavior="padding"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flex: 1 }}
        >
          <CustomFlatlist
            arrayMessage={arrayMessage}
            ref={ref => (refList.current = ref)}
          />
          <View style={style.bottomView}>
            <TextInput
              placeholder="Enter the message"
              value={messageWritten}
              style={style.textInput}
              onChangeText={data => changeOcurred(data)}
              multiline={true}
              // underlineColorAndroid="transparent"
            />
            <TouchableOpacity
              hitSlop={{
                top: 30,
                left: 5,
                bottom: 30,
                right: 30,
              }}
              onPress={sendMessages}
            >
              {console.log(sendingMsg, 'chacking the loader state')}
              {sendingMsg === false ? (
                <Image source={Images.sendButton} style={style.sendButton} />
              ) : (
                <View style={style.sendButton}>
                  <ActivityIndicator size="large" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
};

export default GroupChat;
