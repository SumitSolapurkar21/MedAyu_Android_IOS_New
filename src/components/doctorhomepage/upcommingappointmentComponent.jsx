import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState, useMemo } from 'react'
import appointmentcalender from '../../assets/images/appointmentcalender.png'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointmentFunction } from '../../slices/Addappointments';
import UserContext from '../../functions/usercontext';
import { useNavigation } from '@react-navigation/native';

const UpcommingappointmentComponent = () => {
     const dispatch = useDispatch();
     const navigation = useNavigation();

     const [date, setDate] = useState(new Date().toLocaleDateString('en-US', {
          weekday: 'short',
          day: '2-digit',
          month: 'short'
     }));  

     const { userData } = useContext(UserContext);

     // Memoize formattedDate
     const formattedDate = useMemo(() => new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
     }).replace(',', '') + ' (India Standard Time)', [date]);

     // Memoize data object to prevent re-fetching on re-render
     const data = useMemo(() => ({
          depart_id: userData?.depart_id,
          reception_id: userData?._id,
          fromdate: formattedDate,
          todate: formattedDate,
          status: "Confirmed"
     }), [userData, formattedDate]);
     useEffect(() => {
          const _fetchAppointments = () => {
               dispatch(fetchAppointmentFunction(data)).then((result) => {
                    if (result.payload) {
                         return result.payload;
                    }
               });
          };
          _fetchAppointments();
     }, [userData,dispatch, data]);

     const { appointmentdataarray } = useSelector((state) => state.appointments);
     
     return (
          <>
               <View style={styles.head}>
                    <Text style={styles.headText}>UPCOMING APPOINTMENTS</Text>
                    <TouchableOpacity onPress={() => navigation.replace('Upcommingappointments')}>
                         <Text style={styles.headText2}>View All</Text>
                    </TouchableOpacity>
               </View>
               {appointmentdataarray?.length === 0 ? (
                    <View style={styles.card}>
                         <Image source={appointmentcalender} style={styles.logo} />
                         <Text style={styles.appointmentText}>No upcoming appointments</Text>
                    </View>
               ) : (
                    appointmentdataarray.map((item) => (
                         <View style={styles.card2} key={item._id}>
                              <View style={styles.card2Head}>
                                   <View style={styles.card2HeadContent}>
                                        <Text style={styles.card2Text}>{item.firstname}</Text>
                                        <Text style={styles.card2Text}>({item.patientgender})</Text>
                                   </View>
                                   <View style={styles.card2HeadContent2}>
                                        <Text style={styles.card2Text}>{item.mobilenumber}</Text>
                                        <Text style={styles.card2Text}>{item.slot_id}</Text>
                                   </View>
                              </View>
                         </View>
                    ))
               )}
          </>
     )
};

export default UpcommingappointmentComponent;

const styles = StyleSheet.create({
     head: {
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 20
     },
     headText: {
          fontWeight: "600",
          fontSize: 13,
          color: "black"
     },
     headText2: {
          fontSize: 12,
          color: "black"
     },
     logo: {
          width: 50,
          height: 50,
          alignSelf: "center"
     },
     card: {
          borderColor: "#dcdcde",
          borderWidth: 1,
          padding: 20,
          borderRadius: 8,
          margin: 16,
          gap: 12,
          backgroundColor: "#e5e1fa",
     },
     appointmentText: {
          fontSize: 12,
          color: "black",
          textAlign: "center"
     },
     card2: {
          borderColor: "#dcdcde",
          borderWidth: 1,
          padding: 2,
          borderRadius: 4,
          backgroundColor: "#e5e1fa",
          marginHorizontal: 14,
          marginVertical: 8
     },
     card2Head: {
          borderLeftColor: "#826dfc",
          borderLeftWidth: 4,
          borderTopLeftRadius: 4,
          borderBottomLeftRadius: 4
     },
     card2HeadContent: {
          flexDirection: "row",
          paddingHorizontal: 10,
          gap: 12
     },
     card2HeadContent2: {
          flexDirection: "row",
          paddingHorizontal: 10,
          justifyContent: "space-between",
          marginTop: 2
     },
     card2Text: {
          color: "#0a0a0a",
          fontWeight: "400"
     }

})