import { BackHandler, FlatList, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import UserContext from '../../functions/usercontext';
import { fetchPatientFunction } from '../../slices/AddpatientSlice';

const Patientslist = () => {
     const navigation = useNavigation();
     const dispatch = useDispatch();
     const { userData, setSelectedPatient } = useContext(UserContext);
     const [searchQuery, setSearchQuery] = useState('');

     const selectionHandler = (item) => {
          setSelectedPatient(item);
          navigation.replace('CreateRx')
     }

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

     // Memoize _data to prevent unnecessary re-renders
     const _data = useMemo(() => ({
          hospital_id: userData?.hospital_id,
          doctor_id: userData?._id,
     }), [userData]);

     // get patients list ....
     useEffect(() => {
          dispatch(fetchPatientFunction(_data)).then((result) => {
               if (result.payload) {
                    return result.payload;
               } else {
                    Alert.alert('Error !!', 'Something went wrong')
               }
          })
     }, [dispatch, _data]);

     const { patientdataarray } = useSelector((state) => state.addpatient);

     // Filtering patients based on search query
     const filteredPatients = useMemo(() => {
          return patientdataarray?.filter(patient => {
               const query = searchQuery.toLowerCase();
               return (
                    patient.firstname.toLowerCase().includes(query) ||
                    patient.mobilenumber.toLowerCase().includes(query)
               );
          });
     }, [patientdataarray, searchQuery]);


     return (
          <>
               {/* Status Bar */}
               <StatusBar style={styles.StatusBar} animated={false}
                    backgroundColor="#ffffff"
               />
               <View style={styles.navbar}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                         <FontAwesomeIcon icon={faArrowLeft} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navbarGrp}>
                         <Text style={styles.navbarText}>Select Patient</Text>
                    </TouchableOpacity>
               </View>
               <View style={styles.container}>
                    <TextInput
                         name="serach"
                         placeholder="Search Name or Phone No"
                         style={styles.textInput}
                         value={searchQuery}
                         onChangeText={text => setSearchQuery(text)}
                    />

                    <FlatList data={filteredPatients} renderItem={({ item }) => (
                         <TouchableOpacity style={styles.bodyContentDiv} key={item._id} onPress={() => selectionHandler(item)}>
                              <View style={styles.section}>
                                   <Text style={[styles.sectionText, { fontWeight: "500", color: "black" }]}>{item.firstname}</Text>
                                   {/* <Text style={[styles.sectionText, { fontWeight: "500", color: "black" }]}>({item.patientgender})</Text> */}

                              </View>
                              <View style={[styles.section, { justifyContent: "space-between" }]}>
                                   <Text style={styles.sectionText}>{item.mobilenumber}</Text>

                              </View>
                         </TouchableOpacity>

                    )} />
               </View>
          </>
     )
}

export default Patientslist

const styles = StyleSheet.create({
     icon: {
          padding: 9,
          fontWeight: "400"
     },
     navbarText: {
          fontSize: 18,
          color: "black",
          fontWeight: "400"
     },
     navbar: {
          backgroundColor: "#ffffff",
          padding: 20,
          borderBottomColor: "#dcdcde",
          borderBottomWidth: 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 16
     },
     container: {
          flex: 1,
          backgroundColor: "#ffffff",
     },
     textInput: {
          borderWidth: 0.5,
          borderRadius: 4,
          marginVertical: 10,
          padding: 6,
          backgroundColor: "#f7fbff",
          borderColor: "#f7fbff",
          color: "black",
          marginHorizontal: 14
     },
     section: {
          padding: 10,
          paddingHorizontal: 20
     },
     body: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
     },
     p_details: {
          flexDirection: "row", gap: 10, marginBottom: 6
     },
     p_name: {
          letterSpacing: 0.5,
          fontWeight: "500"
     },
     bodyContentDiv: {
          backgroundColor: '#acfabd',
          marginTop: 10,
          borderRadius: 6,
          padding: 6,
          marginHorizontal: 16,
          borderLeftWidth: 3,
          borderLeftColor: "#059925"
     },
     section: {
          flexDirection: "row",
          gap: 20,
          marginBottom: 3
     },
     sectionText: {
          fontSize: 14,
          color: "grey",
          letterSpacing: 0.5,
          fontWeight: "500"

     }
})