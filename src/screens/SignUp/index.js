import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

import { Alert } from 'react-native';
import { CometChat } from '@cometchat-pro/react-native-chat';
import CustomInput from '../../components/CustomInput';
import ImageCropPicker from 'react-native-image-crop-picker';
import { Images } from '../../shared/images';
import database from '../../database';
import { style } from './style';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const SignUp = () => {
  useEffect(() => {
    const r = database.get('users').query();
    console.log('we are trying');
    console.log(r);
  }, []);
  const [imageUri, setUri] = useState('');
  const [show, setShow] = useState(false);
  const [nameUser, setName] = useState('');
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
  function selectImage() {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setUri(image.path);
      console.log(image.path);
    });
  }
  function handleSignUp2() {
    handleSignUp(nameUser, numbr, email, password);
    console.log('signing in');
    navigation.navigate('SignIn');
  }
  async function handleSignUp(namePerson, numbr, email, password) {
    await database.write(async () => {
      console.log('writer ');
      if (
        passErr.length === 0 &&
        confirmErr.length === 0 &&
        nameUser.length !== 0 &&
        emailErr.length === 0 &&
        numberErr.length === 0
      ) {
        Alert.alert('Registered Successfully');
        console.log(nameUser, 'USERnMAE IS');
        let authKey = 'a33834be7959bd318261b78f2e7716430bdd369f';
        let uid = nameUser.concat('_app');
        let name = nameUser;

        let user = new CometChat.User(uid);

        user.setName(name);

        CometChat.createUser(user, authKey).then(
          user => {
            console.log('user created', user);
          },
          error => {
            console.log('error', error);
            Alert.alert(error.message);
          },
        );
        console.log('submit button pressed in signup');
        return await database.get('users').create(data => {
          data.userName = namePerson;
          data.phoneNumber = +numbr;
          data.email = email;
          data.password = password.current;
          data.profilePicture = imageUri;
        });
      } else if (passErr.length !== 0) {
        Alert.alert('password error');
      } else if (confirmErr.length !== 0) {
        Alert.alert('passwords doesnt match');
      } else if (nameUser.length !== 0) {
        Alert.alert('Enter your name first');
      } else if (emailErr.length !== 0) {
        Alert.alert('Enter correct mail');
      } else {
        Alert.alert('something wrong happened');
      }
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
    console.log('handle Sign In');
    const y = await database.get('users').query();
    console.log(y, 'the values in db');
    navigation.navigate('SignIn');
  }
  const data1 = useSelector(item => item.userData);
  const userName = data1.name;
  console.log(data1, 'username here is');

  return (
    <ScrollView>
      <View style={style.mainView}>
        <Text style={style.mainHeading}>Sign Up</Text>
        <View style={style.imageView}>
          <Image
            style={style.image}
            source={
              imageUri.length === 0 ? Images.defaultProfile : { uri: imageUri }
            }
          />
          <TouchableOpacity onPress={selectImage}>
            <Text>add image</Text>
          </TouchableOpacity>
        </View>
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
        <View style={style.innerView}>
          <TouchableOpacity style={style.submitButton} onPress={handleSignUp2}>
            <Text style={style.buttonText}>SUBMIT</Text>
          </TouchableOpacity>
        </View>
        <View style={style.signIn}>
          <TouchableOpacity
            // hitSlop={{
            //   top: 5,
            //   left: 20,
            //   bottom: 10,
            //   right: 20,
            // }}
            onPress={handleSignIn}
          >
            <Text> Already have an account?Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;
//{Images.defaultProfile}
