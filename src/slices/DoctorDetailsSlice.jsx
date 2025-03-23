// counterSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getdepartment, getdoctor, getrooms } from '../api/api';

export const doctordetailSlice = createSlice({
     name: 'doctordetails',
     initialState: {
          departmentarray: [],
          doctorarray: [],
          roomsarray: [],
     },
     extraReducers: (builder) => {
          builder
               .addCase(getDepartment.fulfilled, (state, action) => {
                    state.departmentarray = action.payload; // Update the user state with payload
               })
          builder
               .addCase(getDoctor.fulfilled, (state, action) => {
                    state.doctorarray = action.payload; // Update the user state with payload
               })
          builder
               .addCase(getRooms.fulfilled, (state, action) => {
                    state.roomsarray = action.payload; // Update the user state with payload
               })

     },
});

export const getDepartment = createAsyncThunk(
     "user/getdepartment",
     async (id) => {
          try {
               const response = await axios.post(`${getdepartment}`, { reception_id: id });
               const departmentdata = response.data.data;
               return departmentdata;

          } catch (error) {
               throw error; // Throw the error to be handled by the rejected action
          }
     }
);

export const getDoctor = createAsyncThunk(
     "user/getdoctor",
     async (id) => {
          try {
               const response = await axios.post(`${getdoctor}`, { depart_id: id });
               const doctordata = response.data.data;
               return doctordata;

          } catch (error) {
               throw error; // Throw the error to be handled by the rejected action
          }
     }
);

export const getRooms = createAsyncThunk(
     "user/getrooms",
     async (id) => {
          try {
               const response = await axios.post(`${getrooms}`, { doctor_id: id });
               const roomsdata = response.data.data;
               return roomsdata;

          } catch (error) {
               throw error; // Throw the error to be handled by the rejected action
          }
     }
);


export default doctordetailSlice.reducer;