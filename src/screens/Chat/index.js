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
  const [date, setDate] = useState('');
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
    var GUID = 'deafault_2122';
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
  useEffect(() => {
    console.log('entering in useEffcet');
    (async () => {
      var  loggedUser = await CometChat.getLoggedinUser();
      console.log('data in then', loggedUser);
      setLoggedId(loggedUser.uid);
    })();
    // console.log(loggedId, 'logged In user Is');
  }, []);

  useEffect(() => {
    console.log(loggedId, 'log for logged user in addmemmbers useEffect');
    if (loggedId.length !== 0) {
      addGroupMembers();
    }
  }, [loggedId]);

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
