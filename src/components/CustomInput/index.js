import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

import { Images } from '../../shared/images';
import { style } from './style';

const CustomInput = props => {
  const [focus, setFocus] = useState(false);
  return (
    <View>
      <Text style={style.textStyle}>
        {props.field}
        {props.required ? <Text style={style.required}>*</Text> : <Text />}
      </Text>
      <TouchableOpacity
        style={
          focus ? [style.inputStyle, style.focusedStyle] : style.inputStyle
        }
      >
        <TextInput
          style={style.inputText}
          onChangeText={props.onChangeText}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder={props.placeholder}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={props.secureTextEntry}
        />
        <>
          {props.Sensitive ? (
            <TouchableOpacity
              onPress={props.onPressImage}
              hitSlop={{
                top: 5,
                left: 20,
                bottom: 10,
                right: 20,
              }}
            >
              {props.state ? (
                <Image source={Images.hidepass} style={style.image} />
              ) : (
                <Image source={Images.showpass} style={style.image} />
              )}
            </TouchableOpacity>
          ) : (
            <Text />
          )}
        </>
      </TouchableOpacity>
    </View>
  );
};

export default CustomInput;
