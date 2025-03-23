import {
  Alert,
  BackHandler,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faCalendarDays,
  faPlus,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import UserContext from '../../functions/usercontext';
import axios from 'axios';
import {addopdassessment, fetchdiseases, fetchmedicines} from '../../api/api';
import {Formik} from 'formik';
import {Modal} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';

const Procedure = () => {
  const navigation = useNavigation();
  const formikRef = useRef(null);
  const {userData, selectedPatient} = useContext(UserContext);

  // input state ...
  const [medicineSearchInput, setMedicineSearchInput] = useState('');

  // array state ...
  const [medicineArray, setmedicineArray] = useState([]);
  const [medicineFilteredArray, setmedicineFilteredArray] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState('');
  const [patientAssessmentArray, setPatientAssessmentArray] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [manualDateSelected, setManualDateSelected] = useState(false);

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

  // fetch diseases handler ....
  useEffect(() => {
    if (medicineSearchInput) {
      fetchDiseasesHandler();
    }
  }, [medicineSearchInput]);

  const fetchDiseasesHandler = async () => {
    try {
      const __data = {
        hospital_id: userData?.hospital_id,
        // patient_id: patient_id,
        reception_id: userData?._id,
        text: medicineSearchInput,
      };

      await axios.post(fetchmedicines, __data).then(res => {
        const {data, message} = res.data;
        if (data.length > 0) {
          setmedicineArray(data);
        } else {
          Alert.alert('Error !!', message);
        }
      });
    } catch (error) {
      Alert.alert('Error !!', error);
    }
  };

  const diseasesHandler = __data => {
    toggleModal();
    setSelectedDiseases(__data);
  };

  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  // Function to remove a symptom by index
  const removeSymptom = indexToRemove => {
    setPatientAssessmentArray(prevArray =>
      prevArray.filter((_, index) => index !== indexToRemove),
    );
  };

  // submit complaints patient data ...
  const savePatientSymptoms = async () => {
    // Format the from_date
    const data = {
      hospital_id: userData?.hospital_id,
      reception_id: userData?._id,
      opdprocedurehistoryarray: patientAssessmentArray,
      api_type: 'OPD-MEDICINE-HISTORY',

      // patient details below ...
      uhid: selectedPatient?.patientuniqueno,
      mobilenumber: selectedPatient?.mobilenumber,
      patient_id: selectedPatient?.patient_id,
      appoint_id: selectedPatient?.appoint_id
    };
    if (patientAssessmentArray?.length > 0) {
      try {
        await axios.post(addopdassessment, data).then(res => {
          if (res.data.status === true)
            return Alert.alert(
              'Success !!',
              'Procedure Added Successfully',
            );
          else Alert.alert('Error !!', 'Procedure Not Added');
        });
      } catch (error) {
        Alert.alert('Error !!', error);
      }
      navigation.replace('CreateRx');
    } else {
      Alert.alert('Warning !!', 'Add Procedure first');
    }
  };

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
          <Text style={styles.navbarText}>Procedure History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <ScrollView
          style={{marginBottom: 70}}
          vertical
          showsVerticalScrollIndicator={false}>
          {/* Symptoms Section */}
          <View style={styles.categoryDiv}>
            <Text style={styles.categoryText}>Procedure Details</Text>
            {patientAssessmentArray?.length > 0 ? (
              patientAssessmentArray?.map((item, index) => {
                return (
                  <View style={styles.sympDiv} key={index + 1}>
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
                        #{index + 1} Procedure
                      </Text>
                      <TouchableOpacity onPress={() => removeSymptom(index)}>
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          color="#FF3B30"
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.sympDivOuter} key={index + 1}>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Procedure</Text>
                        <Text>{item.procedurename} </Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Amount </Text>
                        <Text>{item.procedureamount}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Time </Text>
                        <Text>{item.proceduretime}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Kit </Text>
                        <Text>{item.procedurekit}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Instruction </Text>
                        <Text>{item.procedureinstruction}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Procedure Type </Text>
                        <Text>{item.proceduretype}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Date / Time </Text>
                        <Text>
                          {row.opd_date} / {row.opd_time}
                        </Text>
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
        <View style={styles.addButton}>
          <TouchableOpacity
            style={[styles.addbuttonDiv]}
            onPress={() => diseasesHandler()}>
            <FontAwesomeIcon
              icon={faPlus}
              color={'white'}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.loginButton}>
          <TouchableOpacity
            style={[styles.buttonDiv, {backgroundColor: '#1b55f5'}]}
            onPress={() => savePatientSymptoms()}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* add symptoms Modal */}
        <Modal
          visible={isModalVisible}
          onDismiss={toggleModal}
          contentContainerStyle={styles.bottomModalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalContentHeader}>
              <Text style={[styles.modalText, {marginBottom: 0, fontSize: 18}]}>
                Add Procedure
              </Text>
              <TouchableOpacity
                onPress={toggleModal}
                style={styles.closeButton}>
                <FontAwesomeIcon
                  icon={faXmark}
                  color="#FF3B30"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            <Formik
              innerRef={formikRef}
              initialValues={{
                procedurename: '',
                procedureamount: '',
                proceduretime: '',
                procedurekit: '',
                procedureinstruction: '',
                proceduredays: '',
                proceduretype: '',
                from_date: '',
              }}
              onSubmit={(values, {resetForm}) => {
                toggleModal();
                setPatientAssessmentArray(prevData => [...prevData, values]);
                resetForm();
              }}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
              }) => {
                return (
                  <>
                    <View style={styles.modalDiv}>
                      {/* Dose Field */}
                      <View>
                        <Text style={styles.modalText}>Procedure Name</Text>
                        <TextInput
                          style={styles.filterinput}
                          placeholder="Name"
                          value={values.procedurename}
                          onChangeText={text => {
                            setFieldValue('procedurename', text);
                          }}
                          onBlur={handleBlur('procedurename')}
                        />
                      </View>
                      <View>
                        <Text style={styles.modalText}> Procedure Type</Text>
                        <TextInput
                          style={styles.filterinput}
                          placeholder="Procedure Type"
                          value={values.proceduretype}
                          onChangeText={text => {
                            setFieldValue('proceduretype', text);
                          }}
                          onBlur={handleBlur('proceduretype')}
                        />
                      </View>

                      {/* Route Field */}
                      <View>
                        <Text style={styles.modalText}>Amount</Text>
                        <TextInput
                          style={styles.filterinput}
                          placeholder="Amount"
                          value={values.procedureamount}
                          onChangeText={text => {
                            setFieldValue('procedureamount', text);
                          }}
                          onBlur={handleBlur('procedureamount')}
                        />
                      </View>

                      {/* Schedule Field */}
                      <View>
                        <Text style={styles.modalText}>Time</Text>
                        <TextInput
                          style={styles.filterinput}
                          placeholder="Time"
                          value={values.proceduretime}
                          onChangeText={text => {
                            setFieldValue('proceduretime', text);
                          }}
                          onBlur={handleBlur('proceduretime')}
                        />
                      </View>

                      {/* Years Field */}
                      <View>
                        <Text style={styles.modalText}>KIT </Text>
                        <TextInput
                          style={styles.filterinput}
                          placeholder="KIT "
                          value={values.procedurekit}
                          onChangeText={text => {
                            setFieldValue('procedurekit', text);
                          }}
                          onBlur={handleBlur('procedurekit')}
                        />
                      </View>

                      {/* Months Field */}
                      <View>
                        <Text style={styles.modalText}>Instruction</Text>
                        <TextInput
                          style={styles.filterinput}
                          placeholder="Instruction"
                          value={values.procedureinstruction}
                          onChangeText={text => {
                            setFieldValue('procedureinstruction', text);
                          }}
                          onBlur={handleBlur('procedureinstruction')}
                        />
                      </View>
                      <View>
                        <Text style={styles.modalText}>Days</Text>
                        <TextInput
                          style={styles.filterinput}
                          placeholder="Days"
                          value={values.proceduredays}
                          onChangeText={text => {
                            setFieldValue('proceduredays', text);
                          }}
                          onBlur={handleBlur('proceduredays')}
                        />
                      </View>

                      <View>
                        <Text style={styles.modalText}>From Date</Text>
                        <TouchableOpacity
                          style={[
                            styles.segButton,
                            {flexDirection: 'row', gap: 20},
                          ]}
                          onPress={() => setOpen(true)}>
                          <Text style={styles.segText}>
                            {values.from_date || 'Select Date'}
                          </Text>
                          <DatePicker
                            modal
                            mode="date"
                            open={open}
                            date={new Date()}
                            onConfirm={selectedDate => {
                              setOpen(false);
                              const formattedDate =
                                selectedDate.toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                });
                              setFieldValue('from_date', formattedDate);
                            }}
                            onCancel={() => {
                              setOpen(false);
                            }}
                          />
                          <FontAwesomeIcon
                            icon={faCalendarDays}
                            style={styles.icon}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={handleSubmit}
                      style={[
                        styles.closeButton1,
                        {backgroundColor: '#5cd65c'},
                      ]}>
                      <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>
                  </>
                );
              }}
            </Formik>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default Procedure;

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
    padding: 4,
    paddingHorizontal: 16,
    borderColor: '#e6e6e6',
    borderWidth: 1.4,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    marginBottom: 6,
  },
  segButton: {
    padding: 4,
    paddingHorizontal: 16,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
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
  addButton: {
    padding: 10,
    position: 'absolute',
    bottom: 80,
    right: 0,
  },
  buttonDiv: {
    padding: 12,
    backgroundColor: '#f2f2f2',
    width: '100%',
    borderRadius: 4,
  },
  addbuttonDiv: {
    padding: 12,
    backgroundColor: '#f4adff',
    borderColor: '#e6e6e6',
    borderWidth: 1.5,
    width: '100%',
    borderRadius: 22,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '500',
    letterSpacing: 1,
    textAlign: 'center',
  },
});
