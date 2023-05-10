import { createSlice } from '@reduxjs/toolkit';
const userData = createSlice({
  name: 'userData',
  initialState: {
    token: '',
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    profilePicture: '',
    uId: '',
  },
  reducers: {
    addData: (initialState, payload) => {
      console.log(payload, 'payload we got for userInfo is');
      initialState.name = payload.payload.userName;
      initialState.email = payload.payload.email;
      initialState.phoneNumber = payload.payload.phoneNumber;
      initialState.password = payload.payload.password;
      initialState.profilePicture = payload.payload.profilePicture;
    },
    addToken: (initialState, payload) => {
      console.log(payload, 'payload for token is');
      initialState.token = payload.payload;
    },
    addUId: (initialState, payload) => {
      initialState.uId = payload.payload.user.uid;
    },
    clearRedux: initialState => {
      initialState.token = '';
      initialState.name = '';
      initialState.email = '';
      initialState.phoneNumber = '';
      initialState.password = '';
      initialState.profilePicture = '';
    },
  },
});
export const { addData, addToken, clearRedux, addUId } = userData.actions;
export default userData.reducer;
