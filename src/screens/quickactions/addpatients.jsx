

import { BackHandler, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCalendar, faCalendarDays, faCamera, faScroll, faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-native-date-picker'
import { Dropdown } from 'react-native-element-dropdown';
import { cityFunction, countryFunction, stateFunction } from '../../slices/BoundariesSlices';
import { addPatientFunction } from '../../slices/AddpatientSlice';
import UserContext from '../../functions/usercontext';
import { getDepartment, getDoctor, getRooms } from '../../slices/DoctorDetailsSlice';
import CustomAlert from '../../components/Alert/CustomAlert';

const Addpatients = () => {

     const { userData } = useContext(UserContext)
     const navigation = useNavigation();
     const dispatch = useDispatch();
     const [date, setDate] = useState(new Date())
     const [open, setOpen] = useState(false)
     const [selectedCountry, setSelectedCountry] = useState(null)
     const [selectedState, setSelectedState] = useState(null)

     const [successPopup, setSuccessPopup] = useState(
          false,
     );
     const [errorPopup, setErrorPopup] = useState(
          false,
     );
     // const _date = date?.toISOString().split('T')[0];


     const data = [
          { label: 'Male', value: 'Male' },
          { label: 'Female', value: 'Female' },
          { label: 'Other', value: 'Other' },
     ];

     const languages = [
          { label: 'English', value: 'English' },
          { label: 'Hindi', value: 'Hindi' },
          { label: 'Marathi', value: 'Marathi' },
          { label: 'Telugu', value: 'Telugu' },
          { label: 'Malayalam', value: 'Malayalam' },
          { label: 'Kannada', value: 'Kannada' },
          { label: 'Gujarathi', value: 'Gujarathi' },
          { label: 'Bengali', value: 'Bengali' },
          { label: 'Tamil', value: 'Tamil' },
          { label: 'Urdu', value: 'Urdu' },
          { label: 'Punjabi', value: 'Punjabi' },
          { label: 'Arabic', value: 'Arabic' },
          { label: 'Assamese', value: 'Assamese' },
     ]



     //backHandler ...
     useEffect(() => {
          const backAction = () => {
               navigation.goBack();
               return true;
          };

          const backHandler = BackHandler.addEventListener(
               'hardwareBackPress',
               backAction,
          );

          return () => backHandler.remove();
     }, []);

     // get country ...
     useEffect(() => {
          dispatch(countryFunction()).then((result) => {
               if (result.payload) {
                    return result.payload;
               } else {
                    setErrorPopup(true)
               }
          });
     }, [dispatch])

     // get state ....
     useEffect(() => {
          if (selectedCountry !== null) {
               dispatch(stateFunction(selectedCountry)).then((result) => {
                    if (result.payload) {
                         return result.payload;
                    } else {
                         setErrorPopup(true)
                    }
               });
          }
     }, [selectedCountry])

     //  get city ...
     useEffect(() => {
          if (selectedState !== null) {
               dispatch(cityFunction(selectedState)).then((result) => {
                    if (result.payload) {
                         return result.payload;
                    } else {
                         setErrorPopup(true)
                    }
               });
          }
     }, [selectedState])



     const { countryarray } = useSelector((state) => state.boundaries); // state.{storename}
     const { statearray } = useSelector((state) => state.boundaries); // state.{storename}
     const { cityarray } = useSelector((state) => state.boundaries); // state.{storename}


     return (
          <>
               <CustomAlert
                    displayMode={'success'}
                    displayMsg={'Patient Registered Successfull'}
                    visibility={successPopup}
                    dismissAlert={setSuccessPopup}
               />

               <CustomAlert
                    displayMode={'error'}
                    displayMsg={'Something went wrong !!'}
                    visibility={errorPopup}
                    dismissAlert={setErrorPopup}
               />
               {/* Status Bar */}
               <StatusBar style={styles.StatusBar} animated={true}
                    backgroundColor="#ffffff"
               />
               <View style={styles.navbar}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                         <FontAwesomeIcon icon={faArrowLeft} style={styles.icon} />
                    </TouchableOpacity>
                    <Text style={styles.navbarText}>Add Patient</Text>
               </View>
               <ScrollView style={styles.container}>
                    <View style={styles.imgGroup}>
                         <FontAwesomeIcon icon={faUser} style={styles.icon1} />
                    </View>
                    <TouchableOpacity style={styles.imgGroup2}>
                         <FontAwesomeIcon icon={faCamera} style={styles.icon2} />
                    </TouchableOpacity>
                    {/* login form.. */}
                    <View style={styles.loginBody}>
                         <Formik
                              initialValues={{
                                   reception_id: userData?._id,
                                   patientcategory: 'New',
                                   firstname: '',
                                   patientgender: '',
                                   mobilenumber: '',
                                   patientdob: '',
                                   patientage: '',
                                   country: '',
                                   state: '',
                                   city: '',
                                   patientlanguage: '',
                                   depart_id: userData?.depart_id,
                                   doctor_id: userData?._id,
                                   app_date: '',
                                   slot_id: '',
                                   roomno: '',
                                   patientnationality: '',
                                   patientaddress: '',
                                   patientmartial: 'Single',


                              }}
                              validate={values => {
                                   const errors = {};
                                   if (!values.firstname) {
                                        errors.firstname = 'Patient Name is Required';
                                   }
                                   if (!values.mobilenumber) {
                                        errors.mobilenumber = 'Mobile Number is Required';
                                   }
                                   return errors;
                              }}
                              onSubmit={(values, { resetForm }) => {
                                   dispatch(addPatientFunction(values)).then((result) => {
                                        if (result.payload) {
                                             resetForm();
                                             setSuccessPopup(true)
                                             setTimeout(() => {
                                                  navigation.navigate('Doctorhomepage')
                                             }, 3100);


                                        } else {
                                             Alert.alert('Error !!', "Something went wrong")
                                        }
                                   });
                              }}
                         >
                              {({ handleChange, handleBlur, handleSubmit, values, errors,
                                   touched, setFieldValue }) => (
                                   <>
                                        <View style={styles.formContainer}>
                                             <Text style={styles.label}>Name *</Text>
                                             <TextInput
                                                  name="firstname"
                                                  placeholder="Name"
                                                  style={styles.textInput}
                                                  onChangeText={handleChange('firstname')}
                                                  onBlur={handleBlur('firstname')}
                                                  value={values.firstname}
                                             />
                                        </View>
                                        {errors.firstname && touched.firstname && <Text style={styles.errorText}>{errors.firstname}</Text>}
                                        <View style={styles.formContainer}>
                                             <Text style={styles.label}>Mobile Number *</Text>
                                             <TextInput
                                                  name="mobilenumber"
                                                  keyboardType='numeric'
                                                  maxLength={10}
                                                  placeholder="Mobile Number"
                                                  style={styles.textInput}
                                                  onChangeText={handleChange('mobilenumber')}
                                                  onBlur={handleBlur('mobilenumber')}
                                                  value={values.mobilenumber}
                                             />
                                        </View>
                                        {errors.mobilenumber && touched.mobilenumber && <Text style={styles.errorText}>{errors.mobilenumber}</Text>}
                                        <View style={styles.formContainer}>
                                             <Text style={styles.label}>Date of Birth</Text>
                                             <TouchableOpacity style={styles.textIcon} onPress={() => setOpen(true)}>
                                                  <TextInput
                                                       name="patientdob"
                                                       placeholder="Date of Birth"
                                                       style={styles.textInput}
                                                       onChangeText={handleChange('patientdob')}
                                                       onBlur={handleBlur('patientdob')}
                                                       value={values.patientdob}
                                                       editable={false}
                                                  />
                                                  <FontAwesomeIcon icon={faCalendarDays} style={styles.dateIcon} />
                                             </TouchableOpacity>
                                             <DatePicker
                                                  modal
                                                  mode='date'
                                                  open={open}
                                                  date={date}
                                                  onConfirm={(selectedDate) => {
                                                       setOpen(false)
                                                       setDate(selectedDate)
                                                       setFieldValue('patientdob', selectedDate.toISOString().split('T')[0]);
                                                  }}
                                                  onCancel={() => {
                                                       setOpen(false)
                                                  }}
                                             />
                                        </View>
                                        <View style={styles.formContainer}>
                                             <Text style={styles.label}>Age</Text>
                                             <TextInput
                                                  name="patientage"
                                                  keyboardType='numeric'
                                                  maxLength={10}
                                                  placeholder="Age"
                                                  style={styles.textInput}
                                                  onChangeText={handleChange('patientage')}
                                                  onBlur={handleBlur('patientage')}
                                                  value={values.patientage}
                                             />
                                        </View>
                                        <View style={styles.formContainer}>
                                             <Text style={styles.label}>Gender</Text>

                                             <Dropdown
                                                  style={[styles.dropdown]}
                                                  placeholderStyle={styles.placeholderStyle}
                                                  selectedTextStyle={styles.selectedTextStyle}
                                                  inputSearchStyle={styles.inputSearchStyle}
                                                  iconStyle={styles.iconStyle}
                                                  data={data}
                                                  search
                                                  maxHeight={300}
                                                  labelField="label"
                                                  valueField="value"
                                                  placeholder='Select'
                                                  searchPlaceholder="Search..."
                                                  value={values.patientgender}
                                                  onChange={item => {
                                                       setFieldValue('patientgender', item.value);
                                                  }}

                                             />
                                        </View>
                                        <View style={styles.formContainer}>
                                             <Text style={styles.label}>Country</Text>

                                             <Dropdown
                                                  style={[styles.dropdown]}
                                                  placeholderStyle={styles.placeholderStyle}
                                                  selectedTextStyle={styles.selectedTextStyle}
                                                  inputSearchStyle={styles.inputSearchStyle}
                                                  iconStyle={styles.iconStyle}
                                                  data={countryarray} // Ensure this is the array from your state
                                                  search
                                                  maxHeight={300}
                                                  labelField="name" // The field in your data that will be displayed in the dropdown
                                                  valueField="name" // The field in your data that will be used as the value
                                                  placeholder='Select'
                                                  searchPlaceholder="Search..."
                                                  value={values.country} // Ensure this matches the value field in your form
                                                  onChange={item => {
                                                       setFieldValue('country', item.name); // Update form field with selected value
                                                       setSelectedCountry(item.code)
                                                  }}
                                             />
                                        </View>

                                        <View style={styles.formContainer}>
                                             <Text style={styles.label}>State</Text>
                                             <Dropdown
                                                  style={[styles.dropdown]}
                                                  placeholderStyle={styles.placeholderStyle}
                                                  selectedTextStyle={styles.selectedTextStyle}
                                                  inputSearchStyle={styles.inputSearchStyle}
                                                  iconStyle={styles.iconStyle}
                                                  data={statearray}
                                                  search
                                                  maxHeight={300}
                                                  labelField="statename"
                                                  valueField="statename"
                                                  placeholder='Select'
                                                  searchPlaceholder="Search..."
                                                  value={values.state}
                                                  onChange={item => {
                                                       setFieldValue('state', item.statename);
                                                       setSelectedState([item.iso, item.countryCode])
                                                  }}

                                             />
                                        </View>
                                        <View style={styles.formContainer}>
                                             <Text style={styles.label}>City</Text>
                                             <Dropdown
                                                  style={[styles.dropdown]}
                                                  placeholderStyle={styles.placeholderStyle}
                                                  selectedTextStyle={styles.selectedTextStyle}
                                                  inputSearchStyle={styles.inputSearchStyle}
                                                  iconStyle={styles.iconStyle}
                                                  data={cityarray}
                                                  search
                                                  maxHeight={300}
                                                  labelField="cityname"
                                                  valueField="cityname"
                                                  placeholder='Select'
                                                  searchPlaceholder="Search..."
                                                  value={values.city}
                                                  onChange={item => {
                                                       setFieldValue('city', item.cityname);
                                                  }}

                                             />
                                        </View>
                                        <View style={styles.formContainer}>
                                             <Text style={styles.label}>Preferred Language</Text>
                                             <Dropdown
                                                  style={[styles.dropdown]}
                                                  placeholderStyle={styles.placeholderStyle}
                                                  selectedTextStyle={styles.selectedTextStyle}
                                                  inputSearchStyle={styles.inputSearchStyle}
                                                  iconStyle={styles.iconStyle}
                                                  data={languages}
                                                  search
                                                  maxHeight={300}
                                                  labelField="label"
                                                  valueField="value"
                                                  placeholder='Select'
                                                  searchPlaceholder="Search..."
                                                  value={values.patientlanguage}
                                                  onChange={item => {

                                                       setFieldValue('patientlanguage', item.value);
                                                  }}

                                             />
                                        </View>
                                        {/* <View style={styles.formContainer}>
                                             <Text style={styles.label}>Department</Text>
                                             <Dropdown
                                                  style={[styles.dropdown]}
                                                  placeholderStyle={styles.placeholderStyle}
                                                  selectedTextStyle={styles.selectedTextStyle}
                                                  inputSearchStyle={styles.inputSearchStyle}
                                                  iconStyle={styles.iconStyle}
                                                  data={departmentarray}
                                                  search
                                                  maxHeight={300}
                                                  labelField="deptname"
                                                  valueField="depart_id"
                                                  placeholder='Select'
                                                  searchPlaceholder="Search..."
                                                  value={values.depart_id}
                                                  onChange={item => {
                                                       setFieldValue('depart_id', item.depart_id);
                                                       setSelectedDepartment(item.depart_id)
                                                  }}

                                             />
                                        </View> */}
                                        {/* <View style={styles.formContainer}>
                                             <Text style={styles.label}>Doctor</Text>
                                             <Dropdown
                                                  style={[styles.dropdown]}
                                                  placeholderStyle={styles.placeholderStyle}
                                                  selectedTextStyle={styles.selectedTextStyle}
                                                  inputSearchStyle={styles.inputSearchStyle}
                                                  iconStyle={styles.iconStyle}
                                                  data={doctorarray}
                                                  search
                                                  maxHeight={300}
                                                  labelField="name"
                                                  valueField="_id"
                                                  placeholder='Select'
                                                  searchPlaceholder="Search..."
                                                  value={values.doctor_id}
                                                  onChange={item => {
                                                       setFieldValue('doctor_id', item._id);
                                                       setSelectedDoctor(item._id)
                                                  }}

                                             />
                                        </View> */}
                                        {/* <View style={[styles.formContainer, { marginBottom: 150 }]}>
                                             <Text style={styles.label}>Room No</Text>
                                             <TextInput
                                                  name="roomno"
                                                  keyboardType='numeric'
                                                  maxLength={10}
                                                  placeholder="Room Number"
                                                  style={styles.textInput}
                                                  onChangeText={handleChange('roomno')}
                                                  onBlur={handleBlur('roomno')}
                                                  value={values.roomno}
                                                  editable={false}
                                             />
                                        </View> */}
                                        <TouchableOpacity style={styles.loginButton} onPress={handleSubmit} >
                                             <Text style={styles.loginButtonText} >Add Patient</Text>
                                        </TouchableOpacity>
                                   </>
                              )}
                         </Formik>
                    </View>
               </ScrollView>
          </>
     )
}

export default Addpatients

const styles = StyleSheet.create({
     navbar: {
          backgroundColor: "#ffffff",
          padding: 20,
          borderBottomColor: "#dcdcde",
          borderBottomWidth: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 16
     },
     icon: {
          padding: 10
     },
     navbarText: {
          fontSize: 18,
          color: "black",
          fontWeight: "600"
     },
     container: {
          flex: 1,
          backgroundColor: "#ffffff"
     },
     imgGroup: {
          borderColor: "#dcdcde",
          borderWidth: 1,
          backgroundColor: "#b679fc",
          padding: 12,
          margin: 20,
          borderRadius: 20,
          height: 100,
          width: 100,
          alignSelf: "center"

     },
     icon1: {
          color: "#ffffff",
          padding: 20,
          alignSelf: "center",
          marginTop: 15
     },
     imgGroup2: {
          borderColor: "#dcdcde",
          borderWidth: 1,
          backgroundColor: "#efebf0",
          padding: 8,
          borderRadius: 100,
          height: 35,
          width: 35,
          alignSelf: "center",
          marginLeft: 80,
          marginTop: -45

     },
     icon2: {
          color: "black",
          alignSelf: "center",
     },

     errorText: {
          color: "red",
          fontWeight: "600"
     },
     textInput: {
          borderWidth: 0.5,
          borderRadius: 4,
          marginVertical: 10,
          padding: 10,
          width: "100%",
          backgroundColor: "#f7fbff",
          borderColor: "#dcdcde",
          color: "black"

     },
     loginButton: {
          backgroundColor: "#c096ff",
          width: "90%",
          padding: 14,
          borderRadius: 6,
          marginVertical: 10,
          alignSelf: "center",

     },
     formContainer: {
          flexDirection: "column",
          marginTop: 10,
          paddingHorizontal: 20

     },
     label: {
          fontWeight: "600",
          letterSpacing: 1,
          color: "black"
     },
     textIcon: {
          flexDirection: "row",
          alignItems: "center"
     },
     dateIcon: {
          marginLeft: -30,
          color: "lightgrey"
     },
     placeholderStyle: {
          fontSize: 16,
     },
     selectedTextStyle: {
          fontSize: 16,
          color: "black"
     },
     dropdown: {
          height: 50,
          backgroundColor: "#f7fbff",
          borderColor: "#dcdcde",
          borderWidth: 0.5,
          borderRadius: 4,
          paddingHorizontal: 8,
          marginVertical: 10,
     },
     errorText: {
          color: "red",
          paddingHorizontal: 20,
          marginTop: -10
     },
     loginButtonText: {
          textAlign: "center",
          fontWeight: "600",
          color: "#ffffff"
     },
})