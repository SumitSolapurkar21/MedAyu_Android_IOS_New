import { Image, StyleSheet, Text, View, TextInput, Platform, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import loginImage1 from '../../assets/images/loginImage1.png'
import { Formik } from 'formik'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { userLogin } from '../../slices/LoginSlices';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {

     const dispatch = useDispatch();

     useEffect(() => {
          const checkUserSignIn = async () => {
               const userToken = await AsyncStorage?.getItem('user');
               if (userToken !== null) {
                    const userData = JSON.parse(userToken);
                    if (userData) {
                         navigation.push('Doctorhomepage')
                    }
               }
          };

          checkUserSignIn();
     }, []);

     return (
          <View behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
               <ScrollView showsVerticalScrollIndicator={false} >
                    <View style={styles.loginHead}>
                         <Image
                              style={styles.tinyLogo}
                              source={loginImage1}
                         />
                         <Text style={styles.loginHeadText}>LOGIN</Text>
                    </View>
                    <View style={styles.loginBody}>
                         <Formik
                              initialValues={{ username: '', password: '' }}
                              validate={values => {
                                   const errors = {};
                                   if (!values.username) {
                                        errors.username = 'Mobile Number should be 10 Digit';
                                   }
                                   if (!values.password) {
                                        errors.password = 'Password is Required';
                                   }
                                   return errors;
                              }}
                              onSubmit={(values, { resetForm }) => {
                                   dispatch(userLogin(values)).then((result) => {
                                        if (result.payload) {
                                             resetForm();
                                             navigation.push('Doctorhomepage')
                                        } else {
                                             Alert.alert('Error !!', "Invalid Username or Password")
                                        }
                                   });
                              }}
                         >
                              {({ handleChange, handleBlur, handleSubmit, values, errors,
                                   touched, }) => (
                                   <>
                                        <View style={styles.formContainer}>
                                             <FontAwesomeIcon icon={faUser} style={styles.icon} />
                                             <TextInput
                                                  name="username"
                                                  keyboardType='numeric'
                                                  maxLength={10}
                                                  placeholder="Username"
                                                  style={styles.textInput}
                                                  onChangeText={handleChange('username')}
                                                  onBlur={handleBlur('username')}
                                                  value={values.username}
                                             />
                                        </View>
                                        {errors.username && touched.username && <Text style={styles.errorText}>{errors.username}</Text>}

                                        <View style={styles.formContainer}>
                                             <FontAwesomeIcon icon={faUnlock} style={styles.icon} />
                                             <TextInput
                                                  name="password"
                                                  placeholder="Password"
                                                  style={styles.textInput}
                                                  onChangeText={handleChange('password')}
                                                  onBlur={handleBlur('password')}
                                                  value={values.password}
                                                  secureTextEntry
                                             />
                                        </View>
                                        {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}

                                        
                                        <TouchableOpacity style={styles.loginButton} onPress={handleSubmit} >
                                             <Text style={styles.loginButtonText} >SIGN UP</Text>
                                        </TouchableOpacity>
                                   </>
                              )}
                         </Formik>
                    </View>
               </ScrollView>
          </View>
     )
}

export default Login

const styles = StyleSheet.create({
     container: {
          flex: 1,
          alignItems: "center",
          padding: 50,

     },
     tinyLogo: {
          width: 250,
          height: 250,
          resizeMode: 'cover',
     },
     loginHeadText: {
          padding: 10,
          marginVertical: 10,
          alignSelf: "center",
          textAlign: "center",
          fontWeight: "bold",
          color: "#c096ff",
          fontSize: 24
     },
     textInput: {
          borderWidth: 1,
          width: 250,
          borderRadius: 4,
          marginVertical: 10,
          padding: 10,
          paddingHorizontal: 40

     },
     loginButton: {
          backgroundColor: "#c096ff",
          width: 100,
          padding: 10,
          borderRadius: 6,
          marginVertical: 10,
          alignSelf: "center",

     },
     loginButtonText: {
          textAlign: "center",
          fontWeight: "600",
          color: "#ffffff"
     },
     icon: {
          color: "grey",
          position: "absolute",
          marginHorizontal: 10
     },
     formContainer: {
          flexDirection: 'row',
          alignItems: 'center',
     },
     errorText: {
          color: "red",
          fontWeight: "600"
     }
})