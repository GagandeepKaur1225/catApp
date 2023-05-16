import { Image, Text, TouchableOpacity, View } from 'react-native';

import { Images } from '../../shared/images';
import React from 'react';
import { style } from './style';
import { useNavigation } from '@react-navigation/native';

const HeaderComponent = props => {
  const navigation = useNavigation();
  return (
    <View>
      <View style={style.chatHeader}>
        <View style={style.groupHeadingBox}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Image
              source={Images.backButton}
              style={style.backButton}
              resizeMode="cover"
              hitSlop={{
                top: 30,
                left: 5,
                bottom: 30,
                right: 30,
              }}
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
            <Text>{props.members} participants</Text>
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
    </View>
  );
};

export default HeaderComponent;
