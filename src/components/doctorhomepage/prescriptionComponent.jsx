import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import prescription from '../../assets/images/prescription.png'
import clinic from '../../assets/images/clinic.png'
import medicalrecord from '../../assets/images/medicalrecord.png'

const PrescriptionComponent = () => {
     return (
          <>
               <ScrollView horizontal style={styles.scrolldiv}>
                    <View style={styles.card}>
                         <View>
                              <Image source={prescription} style={styles.logo} />
                         </View>
                         <View>
                              <Text style={styles.text}>Write your first prescription</Text>
                              <Text style={styles.text2}>Check out how easy it is to create and share prescription with patients.</Text>
                              <TouchableOpacity style={styles.button}>
                                   <Text style={styles.buttonText}>Start</Text>
                              </TouchableOpacity>
                         </View>
                    </View>
                    <View style={styles.card}>
                         <View>
                              <Image source={clinic} style={styles.logo} />
                         </View>
                         <View>
                              <Text style={styles.text}>Setup your clinic</Text>
                              <Text style={styles.text2}>Check out how easy it is to create and share prescription with patients.</Text>
                              <TouchableOpacity style={styles.button}>
                                   <Text style={styles.buttonText}>Setup</Text>
                              </TouchableOpacity>
                         </View>
                    </View>
                    <View style={styles.card}>
                         <View>
                              <Image source={medicalrecord} style={styles.logo} />
                         </View>
                         <View>
                              <Text style={styles.text}>Have you submitted details</Text>
                              <Text style={styles.text2}>Check out how easy it is to create and share prescription with patientsCheck out how easy it is to create and share prescription with patients.</Text>
                         </View>
                    </View>
               </ScrollView>
          </>

     )
}

export default PrescriptionComponent

const styles = StyleSheet.create({
     scrolldiv:{
          width: '100%',
     },
     logo: {
          width: 80,
          height: 80
     },
     card: {
          borderColor: "#dcdcde",
          borderWidth: 1,
          padding: 20,
          borderRadius: 8,
          margin: 16,
          flexDirection: "row",
          gap: 12,
          alignItems: "center",
          backgroundColor: "#e5e1fa",
          // width: '90'
     },
     button: {
          backgroundColor: "#3c2c5e",
          borderRadius: 18,
          width: 60,
          marginTop: 10,
          padding: 4,

     },
     buttonText: {
          color: "white",
          paddingHorizontal: 10,
          fontSize: 12,
          textAlign: "center"
     },
     text: {
          fontWeight: "600"
     },
     text2: {
          fontSize: 10,
          width: 200
     }
})