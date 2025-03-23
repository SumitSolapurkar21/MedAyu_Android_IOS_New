// counterSlice.js
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {addpatientapi, getpatients} from '../api/api';

export const addpatientSlice = createSlice({
  name: 'patients',
  initialState: {
    patientdata: [],
    patientdataarray: [],
  },
  extraReducers: builder => {
    builder.addCase(addPatientFunction.fulfilled, (state, action) => {
      state.patientdata = action.payload; // Update the user state with payload
    });

    builder.addCase(fetchPatientFunction.fulfilled, (state, action) => {
      state.patientdataarray = action.payload; // Update the user state with payload
    });
  },
});

//add patients function ....
export const addPatientFunction = createAsyncThunk(
  'user/addpatient',
  async data => {
    try {
      const response = await axios.post(`${addpatientapi}`, data);
      const patientData = response.data;
      return patientData;
    } catch (error) {
      throw error; // Throw the error to be handled by the rejected action
    }
  },
);

export const fetchPatientFunction = createAsyncThunk(
  'user/getpatients',
  async data => {
    console.log({data});
    try {
      const response = await axios.post(getpatients, data);
      console.log(response.data);
      const patientData = response.data.data;
      return patientData;
    } catch (error) {
      throw error; // Throw the error to be handled by the rejected action
    }
  },
);

export default addpatientSlice.reducer;
