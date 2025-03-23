import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { faCalendarDays, faHospital, faHouse, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { useNavigation } from '@react-navigation/native'





const Bottomtabsnavigation = ({ colors, tabs }) => {
     const navigation = useNavigation();
     return (
          <>
               <View style={styles.tabDiv}>
                    <TouchableOpacity style={styles.tabs} onPress={() => navigation.navigate('Doctorhomepage')}>
                         <FontAwesomeIcon icon={faHouse} style={[styles.icon, { color: tabs === 'home' ? colors : 'lightgrey' }]} />
                         <Text style={[styles.text, { color: tabs === 'home' ? colors : 'lightgrey' }]}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabs} onPress={() => navigation.navigate('Upcommingappointments')}>
                         <FontAwesomeIcon icon={faCalendarDays} style={[styles.icon, { color: tabs === 'calendar' ? colors : 'lightgrey' }]} />
                         <Text style={[styles.text, { color: tabs === 'calendar' ? colors : 'lightgrey' }]}>Calendar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabs} onPress={() => navigation.navigate('Patientslist')}>
                         <FontAwesomeIcon icon={faUser} style={[styles.icon, { color: tabs === 'patients' ? colors : 'lightgrey' }]} />
                         <Text style={[styles.text, { color: tabs === 'patients' ? colors : 'lightgrey' }]}>Patients</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabs}>
                         <FontAwesomeIcon icon={faHospital} style={[styles.icon, { color: tabs === 'clinic' ? colors : 'lightgrey' }]} />
                         <Text style={[styles.text, { color: tabs === 'clinic' ? colors : 'lightgrey' }]}>Clinic</Text>
                    </TouchableOpacity>
               </View>
          </>
     )
}

export default Bottomtabsnavigation

const styles = StyleSheet.create({
     tabDiv: {
          backgroundColor: "#ffffff",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          paddingHorizontal: 20,
          borderTopWidth: 1,
          borderTopColor: "#dcdcde"
     },
     icon: {

          padding: 10,
          alignSelf: "center"
     },
     text: {

          fontSize: 11,
          textAlign: "center",
          fontWeight: "500",
     }
})