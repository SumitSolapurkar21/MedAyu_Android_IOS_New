// counterSlice.js
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {loginapi} from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const userSlice = createSlice({
  name: 'loginuser',
  initialState: {
    data: [],
  },
  extraReducers: builder => {
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.data = action.payload; // Update the user state with payload
    });
  },
});

//login function ....
export const userLogin = createAsyncThunk(
  'user/loginuser',
  async userCredential => {
    console.log({userCredential});
    try {
      const response = await axios.post(`${loginapi}`, userCredential);

      const userdata = response.data.data[0];
      console.log('userdata', {userdata});
      AsyncStorage.setItem('user', JSON.stringify(userdata));
      return userdata;
    } catch (error) {
      throw error; // Throw the error to be handled by the rejected action
    }
  },
);

export default userSlice.reducer;
