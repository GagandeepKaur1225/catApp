import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
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
import withObservables from '@nozbe/with-observables';

const GroupChat = ({ messageRetrieve }) => {
  const refList = useRef();
  const [loading, setLoading] = useState(true);
  const arrayDummy = useRef([]);
  const [members, setMembers] = useState([]);
  const [loggedIn, setLoggedIn] = useState('');
  const [loggedId, setLoggedId] = useState('');
  const [groupId, setGroupId] = useState([]);
  const [arrayMessage, setArrayMessage] = useState([]);
  const [sendingMsg, setSendingMsg] = useState(false);
  console.log('re rendered parent');
  const [messageWritten, setMessageWritten] = useState('');
  console.log(loading, 'state to be checked outside loading');
  useEffect(() => {
    getGroupMembers();
    getRealMessages();
    console.log('re rendered using effect of parent', loading);
    fetchMessages();
  }, []);

  useEffect(() => {
    if (arrayMessage.length) {
      getMessages();
    }
  }, [messageRetrieve]);

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
            console.log(arrayItem.sentAt, 'sentAt in database call');
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
    getMessages();
  }
  function fetchMessages() {
    console.log('here fetch messages is re rendered');
    let GUID = 'defaultchat_group';
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
      arrayDummy.current = res;
      console.log(arrayDummy.current, 'response in ref');
      sendMessagesDatabase();
    });
  }
  function getGroupMembers() {
    let GUID = 'defaultchat_group';
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

  async function sendMessages(e) {
    setSendingMsg(true);
    let receiverID = 'defaultchat_group';
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
        console.log(message, arrayMessage, 'message to be written is:');
        // setArrayMessage([...arrayMessage, message]);
        arrayMessage.unshift(message);
        setSendingMsg(false);
        arrayDummy.current = message;
        sendMessagesDatabase();
        // refList.current.scrollToIndex({ index: 0, animated: true });
        setMessageWritten('');
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
    console.log(data, 'data typed is');
    setMessageWritten(data);
  }

  async function getMessages() {
    const checkVariable = await database
      .get('messages')
      .query(Q.sortBy('sentAt', Q.asc));
    console.log(checkVariable.reverse(), 'chacking data to retrieve');
    const arrayReverse = checkVariable;
    console.log(arrayReverse, 'array to be sent');
    setArrayMessage(arrayReverse);
    setLoading(false);
    console.log(arrayMessage, 'the array to be displayed is:');
  }

  function getRealMessages() {
    let listenerID = 'defaultchat_group';

    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: textMessage => {
          console.log('Text message received successfully', textMessage);
          arrayMessage.unshift(textMessage);
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
        {/* <KeyboardAwareScrollView
          keyboardShouldPersistTaps="always"
          behavior="padding"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flex: 1 }}
          keyboardVerticalOffset={Platform.select({ ios: 100, android: 500 })}
        > */}
        {loading === true ? (
          <View style={style.flatList}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <CustomFlatlist
            arrayMessage={arrayMessage}
            ref={ref => (refList.current = ref)}
          />
        )}
        <View style={style.bottomView}>
          <TextInput
            placeholder="Enter the message"
            value={messageWritten}
            style={style.textInput}
            onChangeText={data => changeOcurred(data)}
            multiline={true}
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
        {/* </KeyboardAwareScrollView> */}
      </View>
    </SafeAreaView>
  );
};

const enhance = withObservables([''], () => {
  return {
    messageRetrieve: database.get('messages').query().observe(),
  };
});
export default enhance(GroupChat);
