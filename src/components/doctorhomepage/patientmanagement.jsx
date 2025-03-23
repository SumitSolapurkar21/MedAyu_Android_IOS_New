import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarPlus, faHeartCircleCheck, faScroll, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faMessage } from '@fortawesome/free-regular-svg-icons';

const Patientmanagement = () => {
     return (
          <View style={styles.card}>
               <Text style={styles.cardText}>PATIENT MANAGEMENT</Text>
               <View style={styles.cardBody}>
                    <TouchableOpacity style={styles.cardContent}>
                         <View style={styles.contentDiv}>
                              <FontAwesomeIcon icon={faMessage} style={styles.icon} />
                         </View>
                         <Text style={styles.cardContentText} >Message</Text>
                         <Text style={styles.cardContentText} >Presets</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cardContent}>
                         <View style={styles.contentDiv}>
                              <FontAwesomeIcon icon={faHeartCircleCheck} style={styles.icon} />
                         </View>
                         <Text style={styles.cardContentText} >Checkup</Text>
                         <Text style={styles.cardContentText} >Reminders</Text>
                    </TouchableOpacity>


               </View>
          </View>
     )
}

export default Patientmanagement

const styles = StyleSheet.create({


     card: {
          borderColor: "#dcdcde",
          borderWidth: 1,
          padding: 10,
          borderRadius: 8,
          marginHorizontal: 14,
          marginTop: 12
     },
     cardText: {
          fontWeight: "600",
          fontSize: 12,
          color: "black"
     },
     icon: {
          color: "#07255a",
          padding: 12,
          textAlign: "center"
     },
     cardBody: {
          flexDirection: "row",
          justifyContent: "flex-start",
          marginTop: 20,
          gap: 40
     },

     cardContentText: {
          color: "#07255a",
          fontSize: 11,
          textAlign: "center",
          fontWeight: "500",

     },
     contentDiv: {
          backgroundColor: "#dce0e6",
          padding: 10,
          borderRadius: 10,
          width: 45,
          alignSelf: "center",
          marginBottom: 6
     }

})