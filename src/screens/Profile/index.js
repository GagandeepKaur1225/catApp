import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CometChat } from '@cometchat-pro/react-native-chat';
import { Images } from '../../shared/images';
import { clearRedux } from '../../store/userInfo';
import { style } from './style';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const Profile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const data = useSelector(item => item.userData);
  const link = data.profilePicture;
  const Uri = useRef('');
  Uri.current = link;
  console.log(data);
  function logOut() {
    dispatch(clearRedux());
    CometChat.logout().then(
      () => {
        console.log('Logout completed successfully');
      },
      error => {
        console.log('Logout failed with exception:', { error });
      },
    );
  }
  function goToChat() {
    navigation.navigate('Chat');
  }
  return (
    <View style={style.mainView}>
      <ImageBackground source={Images.background} resizeMode="cover">
        <View style={style.mainView}>
          <View style={style.profileTop}>
            <TouchableOpacity onPress={goToChat}>
              <Text style={style.myProfileText}>Back</Text>
            </TouchableOpacity>
            <Text style={style.emptyText}> </Text>
            <Text style={style.myProfileText}>My profile</Text>
          </View>
          <View>
            <Image
              source={
                Uri.current.length === 0
                  ? Images.defaultProfile
                  : { uri: Uri.current }
              }
              style={style.imageStyle}
            />
          </View>
          <View style={style.nameView}>
            <Text style={style.nameText}>{data.name}</Text>
          </View>
          <View style={style.infoView}>
            <Text>Name:</Text>
            <Text>{data.name}</Text>
          </View>
          <View style={style.infoView}>
            <Text>Email:</Text>
            <Text>{data.email}</Text>
          </View>
          <View style={style.infoView}>
            <Text>PhoneNumber:{data.phoneNumber}</Text>
          </View>
          <TouchableOpacity style={style.logOut} onPress={logOut}>
            <Text style={style.buttonText}>LOG OUT</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Profile;
