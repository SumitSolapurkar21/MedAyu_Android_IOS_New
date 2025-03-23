// counterSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { addappointmentapi, getappointmentapi, getappointmenttimeslotapi } from '../api/api';

export const addappointmentSlice = createSlice({
     name: 'appointments',
     initialState: {
          appointmentdata: [],
          appointmentdataarray: [],
          appointmenttimeslotdataarray: [],
     },
     extraReducers: (builder) => {
          builder
               .addCase(addAppointmentFunction.fulfilled, (state, action) => {
                    state.appointmentdata = action.payload; // Update the user state with payload
               })

          builder
               .addCase(fetchAppointmentFunction.fulfilled, (state, action) => {
                    state.appointmentdataarray = action.payload; // Update the user state with payload
               })
          builder
               .addCase(fetchTimeSlotAppointmentFunction.fulfilled, (state, action) => {
                    state.appointmenttimeslotdataarray = action.payload; // Update the user state with payload
               })

     },
});

//add patients function ....
export const addAppointmentFunction = createAsyncThunk(
     "user/addappointment",
     async (data) => {

          try {
               const response = await axios.post(`${addappointmentapi}`, data);
               const _appointmentdata = response.data;
               return _appointmentdata;

          } catch (error) {
               throw error; // Throw the error to be handled by the rejected action
          }
     }
);

export const fetchAppointmentFunction = createAsyncThunk(
     "user/getappointment",
     async (data) => {
          try {
               const response = await axios.post(`${getappointmentapi}`, data);
               const _appointmentdata = response.data.data;
               return _appointmentdata;

          } catch (error) {
               throw error; // Throw the error to be handled by the rejected action
          }
     }
);

export const fetchTimeSlotAppointmentFunction = createAsyncThunk(
     "user/getappointmenttimeslot",
     async (data) => {
          try {
               const response = await axios.post(`${getappointmenttimeslotapi}`, data);
               const _appointmenttimeslotdata = response.data.data;
               return _appointmenttimeslotdata;

          } catch (error) {
               throw error; // Throw the error to be handled by the rejected action
          }
     }
);


export default addappointmentSlice.reducer;