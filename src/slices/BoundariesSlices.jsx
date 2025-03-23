// counterSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { cityapi, countryapi, stateapi } from '../api/api';

export const boundariesSlice = createSlice({
     name: 'boundary',
     initialState: {
          countryarray: [],
          statearray: [],
          cityarray: [],
     },
     extraReducers: (builder) => {
          builder
               .addCase(countryFunction.fulfilled, (state, action) => {
                    state.countryarray = action.payload; // Update the user state with payload
               })
          builder
               .addCase(stateFunction.fulfilled, (state, action) => {
                    state.statearray = action.payload; // Update the user state with payload
               })
          builder
               .addCase(cityFunction.fulfilled, (state, action) => {
                    state.cityarray = action.payload; // Update the user state with payload
               })
     },
});

//login function ....
export const countryFunction = createAsyncThunk(
     "user/country",
     async () => {
          try {
               const response = await axios.post(`${countryapi}`);
               const countryData = response.data.data;
               let c_array = countryData.map(res => {
                    return { name: res.name, code: res.code };
               });
               return c_array;
          } catch (error) {
               throw error; // Throw the error to be handled by the rejected action
          }
     }
);

// state api ...
export const stateFunction = createAsyncThunk(
     "user/state",
     async (id) => {
          try {
               const response = await axios.post(`${stateapi}`, { code: id });
               const stateData = response.data.data;
               return stateData;
          } catch (error) {
               throw error; // Throw the error to be handled by the rejected action
          }
     }
);

// city api ...
export const cityFunction = createAsyncThunk(
     "user/city",
     async (id) => {
          try {
               const response = await axios.post(`${cityapi}`, {
                    countryCode: id[1],
                    iso: id[0],
               });
               const cityData = response.data.data;
               return cityData;
          } catch (error) {
               throw error; // Throw the error to be handled by the rejected action
          }
     }
);

export default boundariesSlice.reducer;