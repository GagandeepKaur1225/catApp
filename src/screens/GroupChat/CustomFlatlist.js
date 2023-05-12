import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import { CometChat } from '@cometchat-pro/react-native-chat';
import { Images } from '../../shared/images';
import { Q } from '@nozbe/watermelondb';
import database from '../../database';
import { style } from './style';

const CustomFlatlist = ({ ...props }) => {
  const [arrayMessage, setArrayMessage] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const arrayDummy = useRef('');
  const lastMsgId = useRef('');
  const changeInDate = useRef('');
  const [loggedId, setLoggedId] = useState();
  const [loggedIn, setLoggedIn] = useState();
  console.log('flatlst rendered again');

  useEffect(() => {
    fetchMessages();
    const loggedUser = CometChat.getLoggedinUser().then(data => {
      setLoggedIn(data.name);
      setLoggedId(data.uid);
    });
    getMessages();
  }, []);

  async function getMessages() {
    const checkVariable = await database
      .get('messages')
      .query(Q.sortBy('sentAt', Q.asc));
    console.log(checkVariable.reverse(), 'chacking data to retrieve');
    setArrayMessage(checkVariable.reverse());
    setLoading(false);
  }

  function fetchMessages() {
    console.log('here');
    let GUID = 'deafault_2122';
    let messagesRequest = new CometChat.MessagesRequestBuilder()
      .setGUID(GUID)
      .setLimit(50)
      .build()
      .fetchPrevious();
    messagesRequest.then(res => {
      const arrayReversed = res;
      arrayReversed.reverse();
      setArrayMessage([...arrayReversed]);
      arrayDummy.current = arrayReversed;
      setLoading(false);
    });
  }

  function checkDate(dateOfCurrentMsg, dateOfPreviousMsg) {
    if (dateOfCurrentMsg === dateOfPreviousMsg) {
      changeInDate.current = false;
    } else {
      changeInDate.current = true;
    }
  }

  async function sendMessagesDatabase() {
    arrayMessage?.map(async arrayItem => {
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

  function LoadMoreChats(messageNumber) {
    setLoadingMore(true);
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
      let reverseArrayAdded = [];
      reverseArrayAdded = res;
      console.log(res, 'response was');
      reverseArrayAdded.reverse();
      setArrayMessage([...arrayMessage, ...res]);
      setLoadingMore(false);
      res?.map(async arrayItem => {
        await database.write(async () => {
          console.log('got it');
          const record = await database
            .get('messages')
            .query(Q.where('idMessage', arrayItem.id))
            .fetchCount();
          if (record === 0) {
            console.log('now updating response to local');
            return await database.get('messages').create(data => {
              data.text = arrayItem.text;
              data.sentAt = arrayItem.updatedAt;
              data.idMessage = arrayItem.id;
              data.sender = arrayItem.sender.name;
              data.type = arrayItem.type;
              data.receiverId = arrayItem.receiverId;
            });
          } else {
            console.log('data in else');
          }
        });
      });
    });
  }

  function itemView({ item, index }) {
    console.log(item, 'item in custom component');
    const dateOfCurrentMsg1 = new Date(
      arrayMessage[index]?.sentAt * 1000,
    ).toDateString();
    const dateOfPrevMsg2 = new Date(
      arrayMessage[index + 1]?.sentAt * 1000,
    ).toDateString();
    checkDate(dateOfCurrentMsg1, dateOfPrevMsg2);
    let dateOfMsg = new Date(item.sentAt * 1000).toString();
    let timeOfMsg = new Date(item.sentAt * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    let x = compareDate(dateOfMsg.slice(3, 15));
    lastMsgId.current = item.messageId;
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
          style={loggedIn === item?.sender ? style.sentMsg : style.receivedMsg}
        >
          <View style={style.listView}>
            <Text style={style.senderName}>{item?.sender}</Text>
            <Text>{item.text}</Text>
          </View>
          <Text style={style.chatTime}>{timeOfMsg}</Text>
        </View>
      </View>
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
      return date;
    }
  }

  return (
    <View>
      <ImageBackground source={Images.groupBackground} resizeMode="cover">
        {loading === true ? (
          <View style={style.flatList}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <View style={style.flatList}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={props.arrayMessage}
              renderItem={itemView}
              keyExtractor={(_, index) => {
                index.toString();
              }}
              ref={props.ref}
              onEndReached={() => {
                LoadMoreChats(lastMsgId.current);
              }}
              onEndReachedThreshold={0.2}
              inverted={true}
            />
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

export default React.memo(CustomFlatlist);
