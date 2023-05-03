import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useRef } from 'react';

import { CometChat } from '@cometchat-pro/react-native-chat';
import CustomGroup from '../../components/Group';
import { Images } from '../../shared/images';
import { style } from './style';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const Chat = () => {
  const data = useSelector(data => data);
  console.log(data);
  const navigation = useNavigation();
  const link = data.userData.profilePicture;
  console.log(link, 'link for image is');
  const Uri = useRef('');
  function goToGroupChat() {
    console.log('group pressed');
    navigation.navigate('GroupChat');
  }

  return (
    <View style={style.mainView}>
      <ImageBackground source={Images.background} resizeMode="cover">
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
            <Text>groups</Text>
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
