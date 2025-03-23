import { BackHandler, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowLeft, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons'
import DatePicker from 'react-native-date-picker'
import { useNavigation } from '@react-navigation/native'
// import { useDispatch, useSelector } from 'react-redux'
// import { addAppointmentFunction } from '../../slices/AddappointmentSlice'
import UserContext from '../../functions/usercontext'
// import { fetchTimeSlotAppointmentFunction } from '../../slices/Addappointments'
import axios from 'axios'
import { getappointmenttimeslotapi } from '../../api/api'

const Addappointments = () => {
     const { userData } = useContext(UserContext)
     const navigation = useNavigation();
     const [countApp, setCountApp] = useState(null)
     // const dispatch = useDispatch();

     //backHandler ...
     useEffect(() => {
          const backAction = () => {
               navigation.push('Doctorhomepage');
               return true;
          };

          const backHandler = BackHandler.addEventListener(
               'hardwareBackPress',
               backAction,
          );

          return () => backHandler.remove();
     }, []);

     const [date, setDate] = useState(new Date().toLocaleDateString('en-US', {
          weekday: 'short',
          day: '2-digit',
          month: 'short'
     }));  // Initialize as an empty string
     const [open, setOpen] = useState(false);

     // states ...
     const [selectedMode, setSelectedMode] = useState('In Person');
     const [selectedType, setSelectedType] = useState('Consultation');
     const [selectedTime, setSelectedTime] = useState(null);
     const [timeSlotArray, setTimeSlotArray] = useState(null);

     // date ....
     let currentYear = new Date().getFullYear();
     let fullDateString = `${date} ${currentYear}`;
     // Create a Date object
     let dateObj = new Date(fullDateString);

     // Extract the day, month, and year
     let dd = String(dateObj.getDate()).padStart(2, '0'); // Get day and pad with zero if necessary
     let mm = String(dateObj.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and pad with zero if necessary
     let yyyy = dateObj.getFullYear(); // Get year

     // let formattedDate = `${dd}-${mm}-${yyyy}`;
     let formattedDate = `${yyyy}-${mm}-${dd}`;

     // get time slot ....
     const __data = {
          reception_id: userData?._id,
          hospital_id: userData?.hospital_id,
          doctor_id: userData?._id,
          mydate: formattedDate,
     }
     useEffect(() => {
          try {
               axios.post(`${getappointmenttimeslotapi}`, __data).then((res) => {
                    const { status } = res.data;
                    if (status === true) {
                         setTimeSlotArray(res.data.data)
                         const _filterTimeStatus = res.data.data?.filter((res) => res.timestatus === 'true');
                         setCountApp(_filterTimeStatus.length)
                    } else {
                         return;
                    }
               })
          } catch (error) {

          }
     }, [date])



     // page navigation....
     const Pagenavigation = (slots) => {
          setSelectedTime(slots)
          navigation.navigate('Appointmentpreview', { date: date, timeSlot: slots, mode: selectedMode, type: selectedType })

     }

     return (
          <>
               <StatusBar style={styles.StatusBar} animated={true} backgroundColor="#ffffff" />
               <View style={styles.navbar}>
                    <View style={{ flexDirection: "row", gap: 14, alignItems: "center" }}>
                         <TouchableOpacity onPress={() => navigation.goBack()}>
                              <FontAwesomeIcon icon={faArrowLeft} style={styles.icon} />
                         </TouchableOpacity>
                         <Text style={styles.navbarText}>New Appointment</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                         <FontAwesomeIcon icon={faXmark} style={styles.icon} />
                    </TouchableOpacity>
               </View>
               <View style={styles.body}>
                    <TouchableOpacity style={styles.bodySection1} onPress={() => setOpen(true)}>
                         <DatePicker
                              modal
                              mode='date'
                              open={open}
                              date={new Date()}
                              onConfirm={(selectedDate) => {
                                   setOpen(false);
                                   setDate(selectedDate.toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        day: '2-digit',
                                        month: 'short'
                                   }));
                              }}
                              onCancel={() => {
                                   setOpen(false);
                              }}
                         />
                         <FontAwesomeIcon icon={faCalendarDays} style={styles.icon2} />
                         <Text style={styles.dateText}>{date}</Text>
                    </TouchableOpacity>
                    <View style={styles.days}>
                         <TouchableOpacity style={styles.day} onPress={() => setDate(new Date().toLocaleDateString('en-US', {
                              weekday: 'short',
                              day: '2-digit',
                              month: 'short'
                         }))}>
                              <Text style={styles.dayText}>Today</Text>
                         </TouchableOpacity>
                         <TouchableOpacity style={styles.day} onPress={() => {
                              const tomorrow = new Date();
                              tomorrow.setDate(tomorrow.getDate() + 1);
                              setDate(tomorrow.toLocaleDateString('en-US', {
                                   weekday: 'short',
                                   day: '2-digit',
                                   month: 'short'
                              }));
                         }}>
                              <Text style={styles.dayText}>Tomorrow </Text>
                         </TouchableOpacity>
                    </View>
               </View>
               <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                    <View style={styles.content}>
                         <View style={styles.modes}>
                              <Text style={[styles.modeText, { fontSize: 16 }]}>Mode  </Text>
                              <View style={styles.modeDiv}>
                                   <TouchableOpacity style={selectedMode === 'In Person' ? styles.modeSelected : styles.selectMode} onPress={() => setSelectedMode('In Person')
                                   }>
                                        <Text style={styles.modeText}>In Person</Text>
                                   </TouchableOpacity>
                                   <TouchableOpacity style={selectedMode === 'Tele-Consult' ? styles.modeSelected : styles.selectMode} onPress={() => setSelectedMode('Tele-Consult')
                                   }>
                                        <Text style={styles.modeText}>Tele-Consult</Text>
                                   </TouchableOpacity>
                              </View>
                         </View>
                         <View style={styles.modes}>
                              <Text style={[styles.modeText, { fontSize: 16 }]}>Type  </Text>
                              <View style={styles.modeDiv}>
                                   <TouchableOpacity style={selectedType === 'Consultation' ? styles.modeSelected : styles.selectMode} onPress={() => setSelectedType('Consultation')
                                   }>
                                        <Text style={styles.modeText}>Consultation</Text>
                                   </TouchableOpacity>
                                   <TouchableOpacity style={selectedType === 'Follow-up' ? styles.modeSelected : styles.selectMode} onPress={() => setSelectedType('Follow-up')
                                   }>
                                        <Text style={styles.modeText}>Follow-up</Text>
                                   </TouchableOpacity>
                              </View>
                         </View>
                    </View>
                    <View style={styles.content}>
                         <View style={styles.contentHead}>
                              <Text style={styles.contentText}>My first SPOT clinic</Text>
                              <Text style={styles.contentText}>09:00 AM - 10:00 PM</Text>
                         </View>
                         <View style={styles.contentBody}>
                              {timeSlotArray?.map((time, index) => (
                                   <TouchableOpacity key={index} style={[styles.timeDiv, {
                                        backgroundColor:
                                             time.timestatus === 'true' || time.timeSlot === selectedTime
                                                  ? '#03b1fc'
                                                  : 'white',
                                        borderColor:
                                             time.timestatus === 'true' ? '#03b1fc' : '#03b1fc',
                                   },]} onPress={() => Pagenavigation(time.timeSlot)}>
                                        <Text style={styles.timeDivText}>{time.timeSlot}</Text>
                                   </TouchableOpacity>
                              ))}
                         </View>
                    </View>
               </ScrollView>
          </>
     )
}

export default Addappointments;

const styles = StyleSheet.create({
     navbar: {
          backgroundColor: "#ffffff",
          padding: 10,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
          justifyContent: "space-between",
          paddingVertical: 20
     },
     body: {
          backgroundColor: "#ffffff",
          paddingHorizontal: 10,
          borderBottomColor: "#dcdcde",
          borderBottomWidth: 1,
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between"
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
     container: {
          flex: 1,
     },
     content: {
          marginTop: 4,
          backgroundColor: "#ffffff",
     },
     icon2: {
          padding: 2,
     },
     dateText: {
          color: "black",
          letterSpacing: 0.5
     },
     bodySection1: {
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
     },
     days: {
          flexDirection: "row",
          gap: 6
     },
     day: {
          // borderColor: "#dcdcde",
          // borderWidth: 1,
          backgroundColor: "#efebf0",
          padding: 3,
          borderRadius: 2
     },
     dayText: {
          paddingHorizontal: 6,
          fontSize: 12,
          color: "black",
          letterSpacing: 0.5
     },
     modes: {
          flexDirection: "row",
          padding: 8,
          alignItems: "center",
          paddingHorizontal: 20,
          justifyContent: "space-between"
     },
     modeDiv: {
          flexDirection: "row",
          alignItems: "center",
          gap: 10,



     },
     selectMode: {
          borderColor: "#dcdcde",
          borderWidth: 1,
          backgroundColor: "#efebf0",
          padding: 10,
          borderRadius: 2,
          paddingHorizontal: 10,
          width: 100

     },
     modeText: {
          fontSize: 12,
          color: "black",
          letterSpacing: 0.5,
          textAlign: "center"
     },
     contentHead: {
          letterSpacing: 0.5,
          flexDirection: "row",
          padding: 8,
          alignItems: "center",
          paddingHorizontal: 20,
          justifyContent: "space-between"
     },
     contentText: {
          fontSize: 14,
          color: "black",
          letterSpacing: 0.5,
     },
     timeDiv: {
          borderColor: "#dcdcde",
          borderWidth: 1,
          // backgroundColor: "#efebf0",
          padding: 6,
          borderRadius: 2,
          paddingHorizontal: 10,
          width: 100
     },
     contentBody: {
          flexDirection: "row",
          padding: 5,
          gap: 10,
          justifyContent: "space-around",
          flexWrap: "wrap",
          paddingHorizontal: 15
     },
     timeDivText: {
          textAlign: "center"
     },
     modeSelected: {
          borderColor: "#c096ff",
          borderWidth: 1,
          backgroundColor: "#cfb1fc",
          padding: 10,
          borderRadius: 2,
          paddingHorizontal: 10,
          width: 100
     }
})