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
  const lastMsgTimeRef = useRef('');
  const [loggedId, setLoggedId] = useState();
  const [loggedIn, setLoggedIn] = useState();
  const [page, setPage] = useState(1);
  console.log('flatlst rendered again');

  useEffect(() => {
    const loggedUser = CometChat.getLoggedinUser().then(data => {
      setLoggedIn(data.name);
      setArrayMessage(props.arrayMessage);
      setLoading(false);
    });
  }, []);

  function checkDate(dateOfCurrentMsg, dateOfPreviousMsg) {
    if (dateOfCurrentMsg === dateOfPreviousMsg) {
      changeInDate.current = false;
    } else {
      changeInDate.current = true;
    }
  }

  function itemView({ item, index }) {
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
    lastMsgTimeRef.current = item.sentAt;
    return (
      <View style={style.chatBox}>
        {changeInDate?.current === true ? (
          <View style={style.filterTimeView}>
            <View>
              <Text>{x}</Text>
            </View>
          </View>
        ) : null}

        {item?.sender?.name ? (
          <View
            style={
              loggedIn === item?.sender?.name
                ? style.sentMsg
                : style.receivedMsg
            }
          >
            <View style={style.listView}>
              {item?.sender?.name ? (
                <Text style={style.senderName}>{item?.sender?.name}</Text>
              ) : (
                <Text style={style.senderName}>{item?.sender}</Text>
              )}
              <Text>{item.text}</Text>
            </View>
            <Text style={style.chatTime}>{timeOfMsg}</Text>
          </View>
        ) : (
          <View
            style={
              loggedIn === item?.sender ? style.sentMsg : style.receivedMsg
            }
          >
            <View style={style.listView}>
              {item?.sender?.name ? (
                <Text style={style.senderName}>{item?.sender?.name}</Text>
              ) : (
                <Text style={style.senderName}>{item?.sender}</Text>
              )}
              <Text>{item.text}</Text>
            </View>
            <Text style={style.chatTime}>{timeOfMsg}</Text>
          </View>
        )}
      </View>
    );
  }

  function loadingChats(lastTime) {
    setPage(page + 1);
    console.log(lastTime, 'last time for the message is:');
    const GUID = 'defaultchat_group';
    const LIMIT = 50; // number of messages to fetch
    const TIMESTAMP = lastTime; // timestamp before which messages are to be fetched

    const messagesRequest = new CometChat.MessagesRequestBuilder()
      .setGUID(GUID)
      .setTimestamp(TIMESTAMP)
      .setLimit(LIMIT)
      .build();

    messagesRequest.fetchPrevious().then(
      messages => {
        console.log('Messages fetched:', messages);
        setLoadingMore(false);
        messages?.map(async arrayItem => {
          await database.write(async () => {
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
      },
      error => {
        console.log('Message fetching failed with error:', error);
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
      return date;
    }
  }

  const renderFooter = () => {
    return (
      loadingMore && (
        <View style={{ alignItems: 'center' }}>
          <ActivityIndicator animating size="large" />
        </View>
      )
    );
  };

  return (
    <>
      {/* <ImageBackground source={Images.groupBackground} > */}
      {loading === true ? (
        <View style={style.flatList}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        // <View style={style.flatList}>
        //
        <>
          {/* <ImageBackground source={Images.groupBackground}> */}
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ marginBottom: 5 }}
            showsVerticalScrollIndicator={false}
            data={props.arrayMessage}
            renderItem={itemView}
            keyExtractor={(_, index) => {
              index.toString();
            }}
            ref={props.ref}
            // onEndReached={props.onEndReached(lastMsgTimeRef)}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              setLoadingMore(true);
              console.log(lastMsgTimeRef.current, 'here the last time is');
              loadingChats(lastMsgTimeRef.current);
            }}
            inverted={true}
            ListFooterComponent={renderFooter}
          />
          {/* </ImageBackground> */}
        </>
        //
        // </View>
      )}
      {/* </ImageBackground> */}
    </>
  );
};

export default React.memo(CustomFlatlist);
