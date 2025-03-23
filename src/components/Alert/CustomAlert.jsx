import React, { useEffect } from 'react';

import { Modal, Text, View,  StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faCheckDouble, faXmark } from '@fortawesome/free-solid-svg-icons';



export default function CustomAlert({
     displayMode,
     displayMsg,
     visibility,
     dismissAlert,
}) {

     useEffect(() => {
          setTimeout(() => {
               dismissAlert(false)
          }, 3000);
     }, [])
     return (
          <View>
               <Modal
                    visible={visibility}
                    animationType={'fade'}
                    transparent={true}
               >
                    <View
                         style={{
                              flex: 1,
                              backgroundColor: 'rgba(52, 52, 52, 0.8)',
                              alignItems: 'center',
                              justifyContent: 'center',
                         }}>
                         <View
                              style={{
                                   alignItems: 'center',
                                   backgroundColor: 'white',
                                   height: 'auto',
                                   width: '90%',
                                   borderWidth: 1,
                                   borderColor: '#fff',
                                   borderRadius: 7,
                                   elevation: 10,
                              }}>
                              <View style={{ alignItems: 'center', margin: 10 }}>
                                   {displayMode == 'success' ? (
                                        <>
                                             <View style={[styles.alertDiv, { borderColor: "green" }]}>
                                                  <FontAwesomeIcon icon={faCheckDouble} style={[styles.icon1, { color: "green" }]} />
                                             </View>
                                        </>
                                   ) : (
                                        <>
                                             <View style={[styles.alertDiv, { borderColor: "red" }]}>
                                                  <FontAwesomeIcon icon={faXmark} style={[styles.icon1, { color: "red" }]} />
                                             </View>
                                        </>
                                   )}
                                   <Text style={{ fontSize: 18, marginTop: 5, fontWeight: "500", color: 'black' }}>{displayMsg}</Text>
                              </View>

                              {/* <TouchableOpacity
                                   activeOpacity={0.9}
                                   onPress={() => dismissAlert(false)}
                                   style={{
                                        // width: '95%',
                                        backgroundColor: 'blue',
                                        borderColor: '#ddd',
                                        borderBottomWidth: 0,
                                        borderRadius: 5,
                                        marginBottom: 10,
                                        padding: 8,
                                        paddingHorizontal: 20
                                   }}>
                                   <Text style={{ color: 'white', fontWeight: "500" }}>OK</Text>
                              </TouchableOpacity> */}
                         </View>
                    </View>
               </Modal>
          </View>
     );
}

const styles = StyleSheet.create({


     icon1: {
          padding: 20,
          alignSelf: "center",
          // marginTop: 15,
     },
     alertDiv: {
          borderWidth: 3,
          padding: 10,
          borderRadius: 40

     }

});