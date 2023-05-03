import {
  FlatList,
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
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { style } from './style';

const GroupChat = () => {
  const [sent, setSent] = useState(false);
  const [arrayMessage, setArrayMessage] = useState();
  console.log(arrayMessage, 'array check');
  const messageWritten = useRef('');
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

    console.log(messagesRequest, 'requested messages are');
  }

  useEffect(() => {
    fetchMessages();
    console.log(sent, 'sent state is');
  }, [sent]);

  function itemView(item) {
    console.log(item, 'message in itemView');
    return (
      <View style={style.listView}>
        <Text>{item}</Text>
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
    messageWritten.current = data;
  }
  return (
    <SafeAreaView>
      <ImageBackground source={Images.groupBackground} resizeMode="cover" />
      <View style={{ height: heightPercentageToDP('80%') }}>
        <ImageBackground source={Images.groupBackground} resizeMode="cover" />
        <FlatList
          data={arrayMessage}
          renderItem={item => itemView(item.item.text)}
          keyExtractor={index => index.toString()}
        />
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
