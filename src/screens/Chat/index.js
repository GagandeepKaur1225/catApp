import {
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
  const [loggedId, setLoggedId] = useState('');
  console.log(data);
  const navigation = useNavigation();
  const link = data.userData.profilePicture;
  console.log(link, 'link for image is');
  const Uri = useRef('');
  function goToGroupChat() {
    console.log('group pressed');
    navigation.navigate('GroupChat');
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

  useEffect(() => {
    const loggedUser = CometChat.getLoggedinUser().then(data => {
      console.log(data, 'whole data of logged user is:');
      console.log(data.name, 'user logged in is');
      setLoggedId(data.uid);
    });
    addGroupMembers();
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
