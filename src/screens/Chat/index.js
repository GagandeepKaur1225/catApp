import {
  Alert,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import { CometChat } from '@cometchat-pro/react-native-chat';
import CustomGroup from '../../components/Group';
import { Images } from '../../shared/images';
import { style } from './style';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const Chat = () => {
  const data = useSelector(data => data);
  const loggedId = data.userData.uId;
  if (loggedId.length !== 0) {
    addGroupMembers();
  }
  console.log(data, 'data from store');
  const navigation = useNavigation();
  const link = data.userData.profilePicture;
  console.log(link, 'link for image is');
  const Uri = useRef('');
  function goToGroupChat() {
    console.log('group pressed');
    navigation.navigate('GroupChat');
  }

  function addGroupMembers() {
    var GUID = 'defaultchat_group';
    var password = '';
    var groupType = CometChat.GROUP_TYPE.PUBLIC;

    CometChat.joinGroup(GUID, groupType, password).then(
      group => {
        console.log('Group joined successfully:', group);
      },
      error => {
        // Alert.alert(error.code);
        console.log('Group joining failed with exception:', error);
      },
    );
  }
  async function getLatestMessage() {
    let GUID = 'deafault_2122';
    let limit = 30;
    let latestId = await CometChat.getLastDeliveredMessageId();

    var messagesRequest = new CometChat.MessagesRequestBuilder()
      .setGUID(GUID)
      .setMessageId(latestId)
      .setLimit(limit)
      .build();

    messagesRequest.fetchNext().then(
      messages => {
        console.log('Message list fetched:', messages);
      },
      error => {
        console.log('Message fetching failed with error:', error);
      },
    );
  }
  useEffect(() => {
    getLatestMessage();
  }, []);

  return (
    <View style={style.mainView}>
      <ImageBackground source={Images.background}>
        <View style={style.mainView}>
          <View style={style.upperView}>
            <Image
              source={
                Uri.current.length === 0
                  ? Images.defaultProfile
                  : { uri: Uri.current }
              }
              style={style.imageStyle}
            />
            <Text style={style.profileName}>{data.userData.name}</Text>
          </View>
          <View>
            <Text style={style.groupsHeader}>Groups</Text>
          </View>
          <View>
            <CustomGroup groupName="default" onPress={goToGroupChat} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Chat;
