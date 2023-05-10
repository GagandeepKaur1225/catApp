import { Image, Text, TouchableOpacity, View } from 'react-native';

import { Images } from '../../shared/images';
import React from 'react';
import { style } from './style';

const CustomGroup = props => {
  return (
    <TouchableOpacity style={style.mainStyle} onPress={props.onPress}>
      <View style={style.groupView}>
        <View style={style.groupImage}>
          <Image
            source={Images.defaultProfile}
            style={style.imageStyle}
            resizeMode="contain"
          />
        </View>
        <View>
          <Text style={style.groupName}>{props.groupName}</Text>
          <Text>{props.textToShow}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CustomGroup;
