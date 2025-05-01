import { Alert, FlatList, Modal, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCommentDots, faFilePrescription, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchPatientFunction } from '../../slices/AddpatientSlice';
import UserContext from '../../functions/usercontext';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { addAppointmentFunction } from '../../slices/Addappointments';
import CustomAlert from '../../components/Alert/CustomAlert';

const Appointmentpreview = ({ route }) => {
     const navigation = useNavigation();
     const dispatch = useDispatch();
     const { userData } = useContext(UserContext)
     const [searchQuery, setSearchQuery] = useState('');

     const { date, timeSlot, mode, type } = route.params;

     const _data = {
          hospital_id: userData?.hospital_id,
          doctor_id: userData?._id,
     }


     const [selectedpatientArray, setSelectedPatientArray] = useState(null)

     // get patients list ....
     useEffect(() => {
          const timeoutId = setTimeout(() => {
               dispatch(fetchPatientFunction(_data)).then((result) => {
                    if (result.payload) {
                         return result.payload;
                    } else {
                         Alert.alert('Error !!', 'Something went wrong');
                    }
               });
          }, 2000);

          // Cleanup function to clear the timeout
          return () => clearTimeout(timeoutId);
     }, []);


     const { patientdataarray } = useSelector((state) => state.addpatient);


     // Filtering patients based on search query
     const filteredPatients = patientdataarray?.filter(patient => {
          const query = searchQuery.toLowerCase();
          return (
               patient.firstname.toLowerCase().includes(query) ||
               patient.mobilenumber.toLowerCase().includes(query)
          );
     });



     const selectPatientsFunction = (data) => {
          setSelectedPatientArray(data)
     }


     const dateString = date;
     const currentYear = new Date().getFullYear(); // Get the current year

     const fullDateString = `${dateString} ${currentYear}`;
     const dateObj = new Date(fullDateString); // Convert to Date object

     const dd = String(dateObj.getDate()).padStart(2, '0'); // Get day and pad if necessary
     const mm = String(dateObj.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed)
     const yyyy = dateObj.getFullYear(); // Get year
     const formattedDate = `${yyyy}-${mm}-${dd}`;


     const data = {
          patientcategory: 'Review',
          reception_id: userData?._id,
          patient_id: selectedpatientArray?.patient_id,
          depart_id: userData?.depart_id,
          doctor_id: userData?._id,
          app_date: formattedDate,
          slot_id: timeSlot.replace(/AM|PM/, '').trim().replace(":", "."),
          hospital_id: userData?.hospital_id,
     }

     // submit handler ....
     const AddAppointments = () => {

          dispatch(addAppointmentFunction(data)).then((result) => {
               if (result.payload) {
                    Alert.alert('Success !!', 'Appointment Added Successfull')
                    setSelectedPatientArray(null);
                    setTimeout(() => {
                         navigation.replace('Upcommingappointments')
                    }, 3100);

               } else {
                    Alert.alert('Error !!', 'Appointment Not Added')
                    setErrorPopup(true)
               }
          })
     }

     const [successPopup, setSuccessPopup] = useState(false);
     const [errorPopup, setErrorPopup] = useState(false);

     return (
          <>
               <CustomAlert
                    displayMode={'success'}
                    displayMsg={'Appointment Added Successfull'}
                    visibility={successPopup}
                    dismissAlert={setSuccessPopup}
               />

               <CustomAlert
                    displayMode={'error'}
                    displayMsg={'Appointment Not Added'}
                    visibility={errorPopup}
                    dismissAlert={setErrorPopup}
               />
               <StatusBar style={styles.StatusBar} backgroundColor="#ffffff" />
               <View style={styles.navbar}>
                    <View style={{ flexDirection: "row", gap: 14, alignItems: "center" }}>
                         <TouchableOpacity onPress={() => navigation.goBack()}>
                              <FontAwesomeIcon icon={faArrowLeft} style={styles.icon} />
                         </TouchableOpacity>
                         <Text style={styles.navbarText}>New Appointment</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Upcommingappointments')}>
                         <FontAwesomeIcon icon={faXmark} style={styles.icon} />
                    </TouchableOpacity>
               </View>
               <View style={styles.body}>
                    <View style={styles.datetime}>
                         <Text style={styles.bodyText}>Date & Time</Text>
                         <Text style={styles.bodyText1}>{date}  -  {timeSlot}</Text>
                    </View>
                    <View style={styles.bodyContent}>
                         <View>
                              <Text style={styles.bodyText}>Mode</Text>
                              <Text style={styles.bodyText1}>{mode}</Text>
                         </View>
                         <View>
                              <Text style={styles.bodyText}>Type</Text>
                              <Text style={styles.bodyText1}>{type}</Text>
                         </View>
                    </View>
                    <View style={styles.bodyContent}>
                         <View>
                              <Text style={styles.bodyText}>Doctor</Text>
                              <Text style={styles.bodyText1}>{userData?.name}</Text>
                         </View>
                    </View>

                    {selectedpatientArray !== null && (
                         <>
                              <View style={styles.sectionContent}>
                                   <View style={styles.sectionbody}>
                                        <View style={styles.content1}>
                                             <TouchableOpacity style={styles.avtar}>
                                                  <FontAwesomeIcon icon={faUser} style={styles.icon3} />
                                             </TouchableOpacity>
                                             <View>
                                                  <View style={styles.p_details}>
                                                       <Text style={styles.p_name}>{selectedpatientArray?.firstname} </Text>
                                                  </View>
                                                  <Text>{selectedpatientArray?.mobilenumber}</Text>
                                             </View>
                                        </View>
                                        <View style={styles.content1}>
                                             <TouchableOpacity onPress={() => setSelectedPatientArray(null)}>
                                                  <FontAwesomeIcon icon={faTrash} style={styles.icon4} />
                                             </TouchableOpacity>

                                        </View>
                                   </View>
                              </View>

                              <View style={styles.grpButtons}>
                                   <TouchableOpacity style={[styles.buttonDiv, { backgroundColor: "#e9f7ea" }]} onPress={() => navigation.push('Upcommingappointments')}>
                                        <Text style={styles.buttonText}>Cancle</Text>
                                   </TouchableOpacity>
                                   <TouchableOpacity style={[styles.buttonDiv, { backgroundColor: "#2be040" }]} onPress={AddAppointments}>
                                        <Text style={[styles.buttonText, { color: "#ffffff" }]}>Add Appointment</Text>
                                   </TouchableOpacity>
                              </View>
                         </>
                    )}
                    {selectedpatientArray === null && (
                         <>
                              <View style={styles.searchDiv}>
                                   <TextInput
                                        placeholder="Search Name or Phone No"
                                        style={styles.textInput}
                                        value={searchQuery}
                                        onChangeText={text => setSearchQuery(text)}
                                   />
                                   <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Addpatients')}>
                                        <Text style={styles.buttonText}>New</Text>
                                   </TouchableOpacity>
                              </View>
                              <FlatList
                                   data={filteredPatients}
                                   renderItem={({ item }) => (
                                        <TouchableOpacity style={styles.section} key={item.mobilenumber} onPress={() => { selectPatientsFunction(item) }}>
                                             <View style={styles.sectionbody}>
                                                  <View style={styles.content}>
                                                       <View style={styles.content1}>
                                                            <TouchableOpacity style={styles.avtar}>
                                                                 <FontAwesomeIcon icon={faUser} style={styles.icon3} />
                                                            </TouchableOpacity>
                                                            <View>
                                                                 <View style={styles.p_details}>
                                                                      <Text style={styles.p_name}>{item.firstname} </Text>
                                                                 </View>
                                                                 <Text>{item.mobilenumber}</Text>
                                                            </View>
                                                       </View>
                                                  </View>

                                             </View>
                                        </TouchableOpacity>
                                   )}

                              />
                         </>
                    )}
               </View>
          </>
     )
}

export default Appointmentpreview

const styles = StyleSheet.create({
     navbar: {
          backgroundColor: "#ffffff",
          padding: 10,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
          justifyContent: "space-between",
          paddingVertical: 20,
          borderBottomWidth: 1,
          borderBottomColor: "lightgrey"
     },
     body: {
          padding: 20,
          backgroundColor: "#ffffff",
          flex: 1
     },
     icon: {
          padding: 10
     },
     navbarText: {
          fontSize: 18,
          color: "black",
          fontWeight: "600",
          letterSpacing: 0.5
     },
     datetime: {
          marginBottom: 20
     },
     bodyText: {
          fontWeight: "500", letterSpacing: 0.5, fontSize: 12
     },
     bodyText1: {
          fontWeight: "500", letterSpacing: 0.5, color: "black"
     },
     bodyContent: {
          flexDirection: "row",
          gap: 100,
          marginBottom: 20
     },
     section: {
          padding: 10,
     },
     icon3: {
          color: "#ffffff",
          padding: 6,
     },
     icon4: {
          color: "red",
          padding: 6,
     },
     sectionbody: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
     },
     content1: {
          flexDirection: "row",
          gap: 14,
          alignItems: "center",
     },
     p_details: {
          flexDirection: "row", gap: 10, marginBottom: 2
     },
     p_name: {
          letterSpacing: 1,
          fontWeight: "500"
     },
     avtar: {
          backgroundColor: "#ba8dfc",
          padding: 12,
          borderRadius: 30
     },
     textInput: {
          borderWidth: 0.5,
          borderRadius: 4,
          marginVertical: 10,
          padding: 6,
          backgroundColor: "#f7fbff",
          borderColor: "#f7fbff",
          color: "black",
          width: '80%'
     },
     button: {
          backgroundColor: "#8dfcb4",
          padding: 10, borderRadius: 4,
     },
     buttonText: {
          textAlign: "center",
          color: "black"
     },
     searchDiv: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
     },
     grpButtons: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          alignSelf: "center",
          bottom: 10,
          gap: 20
     },
     buttonDiv: {
          padding: 10,
          borderColor: "#dcdcde",
          borderWidth: 0.5,
          borderRadius: 6,
          paddingHorizontal: 20,
     },
     sectionContent: {
          backgroundColor: "#edccfc",
          padding: 6,
          paddingHorizontal: 20,
          borderRadius: 6,
          borderColor: "#dcdcde",
          borderWidth: 0.5,
     }
})