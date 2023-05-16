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
    const loggedUser = CometChat.getLoggedinUser().then(data => {
      setLoggedIn(data.name);
      setLoggedId(data.uid);
    });
    getGroupMembers();
    // getDataFromDB();
    getRealMessages();
    console.log('re rendered using effect of parent', loading);
    fetchMessages();
    return () => {
      var listenerID = 'defaultchat_group';

      CometChat.removeMessageListener(listenerID);
    };
  }, []);

  useEffect(() => {
    console.log(messageRetrieve, 'message retrieve gives us value');
  }, [messageRetrieve]);

  async function sendMessagesDatabase(array) {
    const checkVariable = await database.get('messages').query();
    console.log(checkVariable, 'values in db are');
    console.log(arrayDummy.current, 'current value is 2');
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
  async function fetchMessages() {
    console.log('here fetch messages is re rendered');
    const dataCount = await database.get('messages').query().fetchCount();
    if (dataCount === 0) {
      let GUID = 'defaultchat_group';
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
    } else {
      getMessages();
      getUnreadMessages();
    }
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

  async function sendMessages() {
    console.log('entered sending messages function');
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
        // arrayDummy.current = message;
        console.log(arrayDummy.current, 'current value is 1');
        sendMessageToDatabase(message);
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

  async function getMessages() {
    const checkVariable = await database
      .get('messages')
      .query(Q.sortBy('sentAt', Q.asc));
    console.log(checkVariable.reverse(), 'checking data to retrieve');
    const arrayReverse = checkVariable;
    console.log(arrayReverse, 'array to be sent');
    setArrayMessage(arrayReverse);
    setLoading(false);
    console.log(arrayMessage, 'the array to be displayed is:');
  }

  function getUnreadMessages() {
    let GUID = 'defaultchat_group';
    let limit = 30;
    let messagesRequest = new CometChat.MessagesRequestBuilder()
      .setGUID(GUID)
      .setUnread(true)
      .setLimit(limit)
      .build();

    messagesRequest.fetchPrevious().then(
      messages => {
        console.log('Message list fetched:', messages);
        setArrayMessage(prev => [...messages, ...prev]);
        arrayDummy.current = messages;
        sendMessagesDatabase();
      },
      error => {
        console.log('Message fetching failed with error:', error);
      },
    );
  }

  async function getDataFromDB() {
    const countVariable = await database.get('messages').query().fetchCount();
    console.log(countVariable, 'countVariable of db');
    if (countVariable === 0) {
      console.log('in if of start');
      fetchMessages();
    } else {
      console.log('in else of start');
      messagesLeft();
    }
  }

  async function messagesLeft() {
    const checkVariable = await database
      .get('messages')
      .query(Q.sortBy('sentAt', Q.desc));
    if (arrayMessage.length === 0) {
      const reversedArrayUsed = checkVariable.reverse();
      setArrayMessage(reversedArrayUsed);
    }
    let GUID = 'defaultchat_group';
    let timestamp = checkVariable[0].sentAt;
    let limit = 50;
    let messagesRequest = new CometChat.MessagesRequestBuilder()
      .setGUID(GUID)
      .setTimestamp(timestamp)
      .setLimit(limit)
      .build();
    messagesRequest.fetchNext().then(
      messages => {
        console.log('Messages fetched:', messages);
        messages?.map(async arrayItem => {
          await database.write(async () => {
            const record = await database
              .get('messages')
              .query(Q.where('sentAt', arrayItem.sentAt))
              .fetchCount();
            if (record === 0 && arrayItem.sentAt !== 0) {
              console.log('now updating response to local');
              arrayMessage.unshift(arrayItem);
              setLoading(false);
              return await database.get('messages').create(data => {
                data.text = arrayItem.text;
                data.sentAt = arrayItem.updatedAt;
                data.idMessage = arrayItem.id;
                data.sender = arrayItem.sender.name;
                data.type = arrayItem.type;
                data.receiverId = arrayItem.receiverId;
              });
            } else {
              setLoading(false);
              console.log('data in else');
            }
          });
        });
      },
      error => {
        console.log('Message fetching failed with error:', error);
      },
    );
  }

  async function sendMessageToDatabase(item) {
    const checkDatabase = await database.get('messages').query();
    await database.write(async () => {
      const record = await database
        .get('messages')
        .query(Q.where('idMessage', item.id))
        .fetchCount();
      if (record === 0) {
        return await database.get('messages').create(data => {
          console.log(item.sentAt, 'sentAt in database call');
          data.text = item.text;
          data.sentAt = item.updatedAt;
          data.idMessage = item.id;
          data.sender = item.sender.name;
          data.type = item.type;
          data.receiverId = item.receiverId;
        });
      }
    });
  }

  function getRealMessages() {
    let listenerID = 'defaultchat_group';
    console.log('get real messages is called');
    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: textMessage => {
          console.log('Text message received successfully', textMessage);
          setArrayMessage(prev => [textMessage, ...prev]);
          sendMessageToDatabase(textMessage);
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
  console.log(arrayMessage, 'arrayMessage before flatlist');
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
            // ref={messageWritten}
            placeholder="Enter the message"
            value={messageWritten}
            style={style.textInput}
            onChangeText={data => setMessageWritten(data)}
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
