import React, { useState } from 'react';
import { Text, View } from 'react-native';

import { style } from './style';

const ItemView = ({ item, index, arrayMessage = [], loggedIn }) => {
  const [changeInDate, setChangedState] = useState(false);
  const [lastMsgId, setLastMsgId] = useState('');
  console.log('props are', item, index);
  // function itemView({ item, index }) {
  function checkDate(dateOfCurrentMsg, dateOfPreviousMsg) {
    if (dateOfCurrentMsg === dateOfPreviousMsg) {
      setChangedState(false);
      changeInDate.current = false;
    } else {
      setChangedState(true);
      changeInDate.current = true;
    }
  }
  console.log(index, 'currentIndex of flatlist is:In itemView');
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
  setLastMsgId(item.id);

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
};

export default React.memo(ItemView);
