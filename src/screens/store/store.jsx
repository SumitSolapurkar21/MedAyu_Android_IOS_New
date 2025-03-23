import { configureStore } from '@reduxjs/toolkit';
import LoginSlices from '../../slices/LoginSlices';
import BoundariesSlice from '../../slices/BoundariesSlices';
import AddpatientSlice from '../../slices/AddpatientSlice';
import DoctorDetailsSlice from '../../slices/DoctorDetailsSlice';
import AddappointmentSlice from '../../slices/Addappointments';

export const store = configureStore({
     reducer: {
          loginuser: LoginSlices,
          boundaries: BoundariesSlice,
          addpatient: AddpatientSlice,
          doctordetails : DoctorDetailsSlice,
          appointments : AddappointmentSlice
     },
});