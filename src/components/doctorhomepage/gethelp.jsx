import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import { faCircleQuestion, faComments, faEnvelope } from '@fortawesome/free-regular-svg-icons';

const Gethelp = () => {
     return (
          <View style={styles.card}>
               <Text style={styles.cardText}>GET HELP</Text>
               <View style={styles.cardBody}>
                    <TouchableOpacity style={styles.cardContent}>
                         <View style={styles.contentDiv}>
                              <FontAwesomeIcon icon={faEnvelope} style={styles.icon} />
                         </View>
                         <Text style={styles.cardContentText} >Email</Text>
                         <Text style={styles.cardContentText} >Support</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cardContent}>
                         <View style={styles.contentDiv}>
                              <FontAwesomeIcon icon={faPhoneVolume} style={styles.icon} />
                         </View>
                         <Text style={styles.cardContentText} >Call</Text>
                         <Text style={styles.cardContentText} >Support</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cardContent}>
                         <View style={styles.contentDiv}>
                              <FontAwesomeIcon icon={faCircleQuestion} style={styles.icon} />
                         </View>
                         <Text style={styles.cardContentText} >Feature</Text>
                         <Text style={styles.cardContentText} >Request</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cardContent}>
                         <View style={styles.contentDiv}>
                              <FontAwesomeIcon icon={faComments} style={styles.icon} />
                         </View>
                         <Text style={styles.cardContentText} >Product</Text>
                         <Text style={styles.cardContentText} >Feedback</Text>
                    </TouchableOpacity>
               </View>
          </View>
     )
}

export default Gethelp

const styles = StyleSheet.create({


     card: {
          borderColor: "#dcdcde",
          borderWidth: 1,
          padding: 10,
          borderRadius: 8,
          marginHorizontal: 14,
          marginVertical: 12

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
          justifyContent: "space-between",
          marginTop: 20
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