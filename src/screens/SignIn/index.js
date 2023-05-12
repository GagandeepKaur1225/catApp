import {
  Alert,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { addData, addToken, addUId } from '../../store/userInfo';

import { CometChat } from '@cometchat-pro/react-native-chat';
import CustomInput from '../../components/CustomInput';
import { Q } from '@nozbe/watermelondb';
import database from '../../database';
import { style } from './style';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import uuid from 'react-native-uuid';

const SignIn = () => {
  const dispatch = useDispatch();
  const token = useRef('');
  const [userLoad, setUserLoad] = useState([]);
  const [show, setShow] = useState(false);
  const [nmbr, setNmber] = useState('');
  const [nmbrErr, setNumberErr] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [pass, setPass] = useState('');
  const [passErr, setPassErr] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [confirmErr, setConfirmErr] = useState('');
  const password = useRef('');
  const exists = useRef('true');
  const filterResult = useRef([]);
  const navigation = useNavigation();
  useEffect(() => {
    async () => {
      const databaseData = await database
        .get('users')
        .query(Q.where('phoneNumber', +nmbr));
      console.log(databaseData, 'the values in db for number is');
    };
  }, [nmbrErr]);
  async function handleSubmit() {
    console.log('sub,it is pressed');
    const r = await checkCredentials();
    console.log(r, 'filtered array is');
    if (r.length === 0) {
      console.log('kjlakhsdl user doesnt exist');
      Alert.alert('user doesnt exist,Sign Up first');
      navigation.navigate('SignUp');
    } else {
      let key = r[0]._raw.userName;
      let UID = key.concat('_app');
      console.log(UID, 'UID IS:');
      let authKey = 'a33834be7959bd318261b78f2e7716430bdd369f';

      CometChat.getLoggedinUser().then(
        user => {
          console.log(user, 'user in if');
          if (!user) {
            CometChat.login(UID, authKey).then(
              user => {
                console.log('Login Successful:', { user });
                dispatch(addUId({ user }));
              },
              error => {
                console.log('Login failed with exception:', { error });
              },
            );
          } else {
            console.log('Login user in ele condition', user);
          }
        },
        error => {
          console.log('Some Error Occured', { error });
        },
      );
      navigation.navigate('Home');
    }
  }

  async function checkCredentials() {
    const item = await database
      .get('users')
      .query(Q.where('phoneNumber', +nmbr));
    console.log(typeof item);
    const y = item.filter(item => {
      if (item.password === pass) {
        const tokenNumber = uuid.v1();
        console.log(tokenNumber, 'toke generated is');
        dispatch(addToken(tokenNumber));
        console.log(item._raw, 'item to be sent as payload is ');
        dispatch(addData(item._raw));
        return item;
      } else {
        Alert.alert("user does't exist please signup first");
      }
    });
    filterResult.current = y;
    console.log(filterResult.current.length, 'array after adding');
    console.log(y, 'value of y is');
    console.log(y[0], 'value of map is');
    return y;
  }
  function numberCheck(data) {
    const reg = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    if (data.length === 0) {
      setNmber(data);
      setNumberErr('');
    } else if (reg.test(data) !== true) {
      setNumberErr('number is not correct');
    } else {
      setNmber(data);
      setNumberErr('');
    }
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
  return (
    <SafeAreaView style={style.mainView}>
      <Text style={style.mainHeading}>Sign In</Text>
      <View style={style.innerView}>
        <CustomInput
          field="Phone Number"
          required
          placeholder="Phone Number"
          onChangeText={data => numberCheck(data)}
        />
        <Text style={style.errText}>{nmbrErr}</Text>
      </View>
      <View style={style.innerView}>
        <CustomInput
          field="Password"
          placeholder="Password"
          Sensitive
          required
          onPressImage={() => setShow(prev => !prev)}
          state={show}
          onChangeText={data => checkPass(data)}
          secureTextEntry={show}
        />
        <Text style={style.errText}>{passErr}</Text>
      </View>
      <TouchableOpacity
        style={style.submitButton}
        hitSlop={{
          top: 20,
          left: 50,
          bottom: 20,
          right: 50,
        }}
        onPress={handleSubmit}
      >
        <Text style={style.buttonText}>SUBMIT</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={style.signUp}>Don't have Account?Sign Up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SignIn;
