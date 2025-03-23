import {
  Alert,
  BackHandler,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft, faPencilSquare} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import UserContext from '../../functions/usercontext';
import axios from 'axios';
import {
  addopdassessment,
  FetchMobileOpdAssessmentForEditapi,
} from '../../api/api';
import {Formik} from 'formik';

const Personalhistory = () => {
  const navigation = useNavigation();
  const formikRef = useRef(null);
  const {userData, selectedPatient} = useContext(UserContext);

  const [patientSympyomsArrayEdit, setPatientSympyomsArrayEdit] = useState([]);

  // System back button handling
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

  // submit complaints patient data ...
  const savePatientSymptoms = async values => {
    // Format the from_date
    const data = {
      hospital_id: userData?.hospital_id,
      reception_id: userData?._id,
      opdpersonalhistoryarray: [values],
      api_type: 'OPD-PERSONAL-HISTORY',

      // patient details below ...
      uhid: selectedPatient?.patientuniqueno,
      mobilenumber: selectedPatient?.mobilenumber,
      patient_id: selectedPatient?.patient_id,
      appoint_id: selectedPatient?.appoint_id,
    };
    if (data) {
      try {
        await axios.post(addopdassessment, data).then(res => {
          if (res.data.status === true)
            return Alert.alert(
              'Success !!',
              'Personal History Added Successfully',
            );
          else Alert.alert('Error !!', 'Complaints Not Added');
        });
      } catch (error) {
        Alert.alert('Error !!', error);
      }
      navigation.replace('CreateRx');
    } else {
      Alert.alert('Warning !!', 'Add symptoms first');
    }
  };

  useEffect(() => {
    const fetchmobileAssessment = async () => {
      try {
        await axios
          .post(FetchMobileOpdAssessmentForEditapi, {
            hospital_id: userData?.hospital_id,
            reception_id: userData?._id,
            patient_id: selectedPatient?._id,
            api_type: 'OPD-PERSONAL-HISTORY',
            uhid: selectedPatient?.patientuniqueno,
            mobilenumber: selectedPatient?.mobilenumber,
            appoint_id: selectedPatient?.appoint_id,
          })
          .then(res => {
            console.log('res : ', res.data);
            setPatientSympyomsArrayEdit(res.data.opdpersonalhistoryarray);
          });
      } catch (error) {
        console.error(error);
      }
    };

    fetchmobileAssessment();
  }, []);

  return (
    <>
      <StatusBar
        style={styles.StatusBar}
        animated={false}
        backgroundColor="#ffffff"
      />

      {/* Header */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.navbarText}>Personal History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <ScrollView
          style={{marginBottom: 70}}
          vertical
          showsVerticalScrollIndicator={false}>
          {/* Category Section */}
          <View style={styles.categoryDiv}>
            <Text style={styles.categoryText}>Habits</Text>
            <Formik
              innerRef={formikRef}
              initialValues={{
                Tea: '',
                Coffee: '',
                Tobacco: '',
                Smoking: '',
                Alcohol: '',
                Drugs: '',
                Exercise: '',
                Softdrink: '',
                Saltyfood: '',
              }}
              onSubmit={(values, {resetForm}) => {
                savePatientSymptoms(values);
                resetForm();
              }}>
              {({values, setFieldValue}) => {
                // Generate buttons dynamically for a habit
                const habitLevel = field => {
                  const levels = ['None', 'Light', 'Moderate', 'Heavy'];
                  return levels.map(level => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.segButton,
                        values[field] === level && styles.selectedButton, // Highlight selected button
                      ]}
                      onPress={() => setFieldValue(field, level)} // Update the field value
                    >
                      <Text style={styles.segText}>{level}</Text>
                    </TouchableOpacity>
                  ));
                };
                // Render a habit row dynamically
                const renderHabit = (label, field) => (
                  <View style={styles.modalDiv}>
                    <Text style={styles.modalText}>{label}</Text>
                    <View style={styles.modalDivCategory}>
                      {habitLevel(field)}
                    </View>
                  </View>
                );
                return (
                  <>
                    {renderHabit('Tea', 'Tea')}
                    {renderHabit('Coffee', 'Coffee')}
                    {renderHabit('Tobacco', 'Tobacco')}
                    {renderHabit('Smoking', 'Smoking')}
                    {renderHabit('Alcohol', 'Alcohol')}
                    {renderHabit('Drugs', 'Drugs')}
                    {renderHabit('Exercise', 'Exercise')}
                    {renderHabit('Soft Drinks', 'Softdrink')}
                    {renderHabit('Salty Food', 'Saltyfood')}
                  </>
                );
              }}
            </Formik>
          </View>

          {/* Symptoms Section */}
          <View style={styles.categoryDiv}>
            <Text style={styles.categoryText}>Previous Personal History</Text>
            {patientSympyomsArrayEdit?.length > 0 ? (
              patientSympyomsArrayEdit?.map((item, index) => {
                return (
                  <View style={styles.sympDiv} key={index}>
                    <View
                      style={[
                        styles.modalContentHeader,
                        {
                          borderBottomWidth: 1,
                          paddingBottom: 6,
                          borderColor: '#e6e6e6',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.modalText,
                          {marginBottom: 0, fontSize: 13},
                        ]}>
                        #{index + 1} Symptom
                      </Text>
                      <TouchableOpacity
                        onPress={() => removeSymptom(index)}
                        style={styles.deleteButton}>
                        <FontAwesomeIcon
                          icon={faPencilSquare}
                          color="#05b508"
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.sympDivOuter} key={index + 1}>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Tea</Text>
                        <Text>{item.Tea}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Coffee</Text>
                        <Text>{item.Coffee}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Tobacco</Text>
                        <Text>{item.Tobacco}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Smoking</Text>
                        <Text>{item.Smoking}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Alcohol</Text>
                        <Text>{item.Alcohol}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Drugs</Text>
                        <Text>{item.Drugs}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Exercise</Text>
                        <Text>{item.Exercise}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Soft Drink</Text>
                        <Text>{item.Softdrink}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Salty Food</Text>
                        <Text>{item.Saltyfood}</Text>
                      </View>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.sympDiv}>
                <View style={{padding: 20}}>
                  <Text style={{textAlign: 'center', fontWeight: '500'}}>
                    No Data Available
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
        <View style={styles.loginButton}>
          <TouchableOpacity
            style={[styles.buttonDiv, {backgroundColor: '#1b55f5'}]}
            onPress={() => formikRef.current?.handleSubmit()}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default Personalhistory;

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomColor: '#dcdcde',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  icon: {
    padding: 9,
    fontWeight: '400',
  },
  navbarText: {
    fontSize: 18,
    color: 'black',
    fontWeight: '400',
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f7fc',
  },
  categoryDiv: {
    padding: 10,
  },
  categoryText: {
    fontWeight: '500',
    letterSpacing: 0.5,
    fontSize: 16,
    color: '#000000',
    marginBottom: 6,
  },

  filterDiv: {
    marginBottom: 2,
  },
  filterinput: {
    padding: 0,
    paddingHorizontal: 16,
    borderColor: '#e6e6e6',
    borderWidth: 1.4,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    marginBottom: 6,
  },
  segButton: {
    padding: 4,
    paddingHorizontal: 12,
    borderColor: '#e6e6e6',
    borderWidth: 1.4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
  selectedButton: {
    backgroundColor: '#f2e6ff',
  },
  segText: {
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  bottomModalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 16,
    position: 'absolute',
    bottom: 0.5,
    width: '100%',
  },

  modalText: {
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 10,
    color: '#000000',
  },
  closeButton1: {
    backgroundColor: '#FF3B30',
    padding: 6,
    borderRadius: 6,
    marginTop: 20,
    width: 80,
    alignSelf: 'flex-end',
    borderColor: '#e6e6e6',
    borderWidth: 1,
  },
  closeButton: {
    padding: 4,
    borderRadius: 20,
    borderColor: '#FF3B30',
    borderWidth: 1.4,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '500',
    letterSpacing: 1,
    textAlign: 'center',
  },
  modalContentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalDiv: {
    // flexDirection: "row",
    // flexWrap: "wrap",
    // gap: 10
    padding: 10,
  },
  categoryDiv: {
    padding: 10,
  },
  categoryText: {
    fontWeight: '500',
    letterSpacing: 0.5,
    fontSize: 16,
    color: '#000000',
    marginBottom: 6,
  },
  catDiv: {
    flexDirection: 'row',
    alignContent: 'center',
    gap: 10,
    flexWrap: 'wrap',
    // marginVertical: 10
  },
  sympDiv: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 4,
    borderColor: '#e6e6e6',
    borderWidth: 1.5,
    marginBottom: 10,
  },
  label: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
  },
  sympDivOuter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  loginButton: {
    backgroundColor: '#ffffff',
    padding: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#e6e6e6',
  },
  buttonDiv: {
    padding: 12,
    backgroundColor: '#f2f2f2',
    width: '100%',
    borderRadius: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '500',
    letterSpacing: 1,
    textAlign: 'center',
  },
  modalDivCategory: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
});
