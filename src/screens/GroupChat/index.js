import {
  ActivityIndicator,
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
import React, { useEffect, useRef, useState } from 'react';

import { CometChat } from '@cometchat-pro/react-native-chat';
import { Images } from '../../shared/images';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Pagination from 'react-native-pagination';
import { ScrollView } from 'react-native-gesture-handler';
import { style } from './style';
import { useNavigation } from '@react-navigation/native';

const GroupChat = () => {
  const [loading, setLoading] = useState(true);
  const [lastMsgId, setLastMsgId] = useState('');
  const arrayDummy = useRef([]);
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
  const [messageWritten, setMessageWritten] = useState('');
  function fetchMessages() {
    let GUID = 'deafault_2122';
    let messagesRequest = new CometChat.MessagesRequestBuilder()
      .setGUID(GUID)
      .setLimit(50)
      .build()
      .fetchPrevious();
    messagesRequest.then(res => {
      setArrayMessage(res);
      arrayDummy.current = res;
      setLoading(false);
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

  function compareDate(date) {
    var dateNow = new Date().toDateString();
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
      // console.log(
      //   typeof date,
      //   date.slice(1, 4),
      //   dateNow.slice(4, 7),
      //   date.slice(5, 7),
      //   dateNow.slice(8, 10),
      //   'checking varios dates',
      // );
      return date;
    }
  }

  function ChangedItems({ viewableItems, changed }) {
    console.log('Visible items are', viewableItems);
    console.log('Changed in this iteration', changed);
  }

  const viewabilityConfig = {
    waitForInteraction: true,
    // At least one of the viewAreaCoveragePercentThreshold or itemVisiblePercentThreshold is required.w
    itemVisiblePercentThreshold: 75,
  };

  function LoadMoreChats(messageNumber) {
    console.log('start is reached');
    let GUID = 'deafault_2122';
    let messageId = messageNumber;
    let limit = 30;
    let messagesRequest = new CometChat.MessagesRequestBuilder()
      .setGUID(GUID)
      .setMessageId(messageId)
      .setLimit(limit)
      .build()
      .fetchPrevious();
    messagesRequest.then(res => {
      console.log(res, 'response for more loading chats');
      setArrayMessage([...res]);
    });
    console.log(arrayMessage, 'array message for loading more chats');
  }
  function LoadNextChats(messageNumber) {
    console.log('end is reached');
    let GUID = 'deafault_2122';
    let messageId = messageNumber;
    let limit = 30;
    let messagesRequest = new CometChat.MessagesRequestBuilder()
      .setGUID(GUID)
      .setMessageId(messageId)
      .setLimit(limit)
      .build()
      .fetchNext();
    messagesRequest.then(res => setArrayMessage([...arrayMessage, ...res]));
  }

  const onViewableItemsChanged = ({ viewableItems }) => {
    console.log(
      'viewable items changed',
      { viewableItems }.viewableItems,
      'hello',
      arrayDummy.current,
    );
    const valueOfChangedItem = { viewableItems }.viewableItems;
    console.log(valueOfChangedItem, 'valueOfChangedItem', arrayDummy.current);
    console.log(
      arrayDummy.current[0].id,
      valueOfChangedItem[0].item.id,
      'checking comaparable Values',
    );
    if (arrayDummy.current[0].id === valueOfChangedItem[0].item.id) {
      LoadMoreChats(arrayDummy.current[0].id);
    } else {
      console.log('we cant reach');
      console.log(arrayMessage, 'array message for checking id of messages');
    }
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  useEffect(() => {
    getGroupMembers();
    fetchMessages();
    if (reference) {
      reference.scrollToEnd({ animated: true });
    }
    const loggedUser = CometChat.getLoggedinUser().then(data => {
      setLoggedIn(data.name);
      setLoggedId(data.uid);
    });
  }, [sent]);

  useEffect(() => {
    if (loading === false) {
      if (reference && arrayMessage.length !== 0) {
        reference.scrollToEnd({ animated: true });
      } else {
        console.log('reference not found');
      }
    } else {
      console.log('loading is true');
    }
  }, [loading, reference]);

  function itemView({ item, index }) {
    const dateOfCurrentMsg = new Date(item.sentAt * 1000).toDateString();
    const dateOfPreviousMsg = new Date(
      lastMsgRef?.current.sentAt * 1000,
    ).toDateString();
    function checkDate(dateOfCurrentMsg, dateOfPreviousMsg) {
      if (dateOfCurrentMsg === dateOfPreviousMsg) {
        setChangedState(false);
        changeInDate.current = false;
      } else {
        setChangedState(true);
        changeInDate.current = true;
      }
    }
    checkDate(dateOfCurrentMsg, dateOfPreviousMsg);
    lastMsgRef.current = item;
    let dateOfMsg = new Date(item.sentAt * 1000).toString();
    let timeOfMsg = new Date(item.sentAt * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    let x = compareDate(dateOfMsg.slice(3, 15));
    firstRender.current = false;
    setLastMsgId(item.id);
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
        arrayMessage.push(message);
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
    setMessageWritten(data);
  }

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView>
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
        {loading ? (
          <View style={style.flatList}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <View style={style.flatList}>
            <ImageBackground source={Images.groupBackground} resizeMode="cover">
              <FlatList
                data={arrayMessage}
                renderItem={itemView}
                keyExtractor={(_, index) => index.toString()}
                ref={ref => {
                  setReference(ref);
                }}
                viewabilityConfig={viewabilityConfig}
                viewabilityConfigCallbackPairs={
                  viewabilityConfigCallbackPairs.current
                }
                onEndReached={() => LoadNextChats(lastMsgId)}
                inverted
              />
            </ImageBackground>
          </View>
        )}
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
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default GroupChat;
