import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import CustomInput from '../../components/CustomInput';
import database from '../../database';
import { style } from './style';
import { useNavigation } from '@react-navigation/native';

const SignUp = () => {
  useEffect(() => {
    const r = database.get('users').query();
    console.log('we are trying');
    console.log(r);
  }, []);
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [numbr, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [pass, setPass] = useState('');
  const [passErr, setPassErr] = useState('');
  const [numberErr, setNumberErr] = useState('');
  const [confirmErr, setConfirmErr] = useState('');
  const password = useRef('');
  const confirmpass = useRef('');
  const navigation = useNavigation();
  function numberCheck(data) {
    const reg = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    if (data.length == 0) {
      setNumber('');
      setNumberErr('');
    } else if (reg.test(data) !== true) {
      setNumberErr('number is not correct');
    } else {
      setNumber(data);
      setNumberErr('');
    }
  }
  function emailCheck(input) {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (input.length == 0) {
      setEmailErr('');
      setEmail('');
    } else if (reg.test(input) !== true) {
      setEmailErr('enter valid email');
    } else {
      setEmail(input);
      setEmailErr('');
    }
    console.log('email err is:');
  }
  function checkPass(data) {
    const reg =
      /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    if (data.length == 0) {
      setPassErr('');
      setPass('');
    } else if (reg.test(data) !== true) {
      setPassErr(
        'password contains at least eight characters, including at least one number and includes both lower and uppercase letters and special characters',
      );
    } else {
      setPass(data);
      password.current = data;
      console.log(password.current, 'currently');
      setPassErr('');
    }
  }
  async function handleSignUp(name, numbr, email, password) {
    await database.write(async () => {
      console.log('writer ');
      return await database.get('users').create(data => {
        data.userName = name;
        data.phoneNumber = +numbr;
        data.email = email;
        data.password = password;
        data.profilePicture = 'hj';
      });
    });
  }

  function confirmPassword(data) {
    confirmpass.current = data;
    console.log(confirmpass.current, 'current confirm pass');
    if (confirmpass.current !== password.current) {
      setConfirmErr("passwords doesn't match");
    } else {
      setConfirmErr('');
    }
  }
  async function handleSignIn() {
    const y = await database.get('users').query();
    console.log(y, 'the values in db');
    navigation.navigate('SignIn');
  }
  return (
    <View>
      <ScrollView style={style.mainView}>
        <Text style={style.mainHeading}>Sign Up</Text>
        <View style={style.innerView}>
          <CustomInput
            field="Name"
            placeholder="Name"
            onChangeText={data => setName(data)}
          />
          <Text></Text>
        </View>
        <View style={style.innerView}>
          <CustomInput
            field="Email"
            required
            placeholder="Email"
            onChangeText={emailCheck}
          />
          <Text style={style.errText}>{emailErr}</Text>
        </View>
        <View style={style.innerView}>
          <CustomInput
            field="Phone Number"
            required
            placeholder="Phone Number"
            onChangeText={numberCheck}
          />
          <Text style={style.errText}>{numberErr}</Text>
        </View>
        <View style={style.innerView}>
          <CustomInput
            field="Password"
            placeholder="Password"
            Sensitive
            required
            state={show}
            onPressImage={() => setShow(prev => !prev)}
            secureTextEntry={show}
            onChangeText={checkPass}
          />
          <Text style={style.errText}>{passErr}</Text>
        </View>
        <View style={style.innerView}>
          <CustomInput
            field=" Confirm Password"
            placeholder="Confirm Password"
            Sensitive
            required
            onPressImage={() => setShowConfirm(prev => !prev)}
            state={showConfirm}
            secureTextEntry={showConfirm}
            onChangeText={confirmPassword}
          />
          <Text style={style.errText}>{confirmErr}</Text>
        </View>
        <TouchableOpacity
          style={style.submitButton}
          onPress={() => handleSignUp(name, numbr, email, password)}
        >
          <Text style={style.buttonText}>SUBMIT</Text>
        </TouchableOpacity>
        <Text style={style.signIn}>
          Already have an account?
          <TouchableOpacity onPress={handleSignIn}>
            <Text>Sign in</Text>
          </TouchableOpacity>
        </Text>
        {/* </SafeAreaView> */}
      </ScrollView>
    </View>
  );
};

export default SignUp;
