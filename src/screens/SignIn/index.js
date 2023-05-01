import React, { useRef, useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import CustomInput from '../../components/CustomInput';
import { style } from './style';
import { useNavigation } from '@react-navigation/native';

const SignIn = () => {
  const token = useRef('');
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [pass, setPass] = useState('');
  const [passErr, setPassErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [confirmErr, setConfirmErr] = useState('');
  const password = useRef('');
  const confirmpass = useRef('');
  const navigation = useNavigation();
  return (
    <SafeAreaView style={style.mainView}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>back</Text>
      </TouchableOpacity>
      <Text style={style.mainHeading}>Sign In</Text>
      <View style={style.innerView}>
        <CustomInput
          field="Phone Number"
          required
          placeholder="Phone Number"
          //   onChangeText={data => numberCheck(data)}
        />
        <Text style={style.errText}>{emailErr}</Text>
      </View>
      <View style={style.innerView}>
        <CustomInput
          field="Password"
          placeholder="Password"
          Sensitive
          required
          onPressImage={() => setShow(prev => !prev)}
          state={show}
          //   onChangeText={data => checkPass(data)}
          secureTextEntry={show}
        />
        <Text style={style.errText}>{passErr}</Text>
      </View>
      <TouchableOpacity style={style.submitButton}>
        <Text
          style={style.buttonText}
          //   onPress={data => handleSubmit(data)}
        >
          SUBMIT
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SignIn;
