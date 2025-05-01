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
  Platform,
} from 'react-native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faCalendarDays,
  faPencilSquare,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import UserContext from '../../functions/usercontext';
import axios from 'axios';
import {
  addopdassessment,
  FetchMobileOpdAssessmentForEditapi,
  searchdiagnosisdata,
} from '../../api/api';
import {Formik} from 'formik';
import {Modal} from 'react-native-paper';
import DateTimePicker from 'react-native-date-picker';
import DatePicker from 'react-native-date-picker';

const Diagnosis = () => {
  const navigation = useNavigation();
  const formikRef = useRef(null);
  const {userData, selectedPatient} = useContext(UserContext);

  // input state ...
  const [diagnosisSearchInput, setDiagnosisSearchInput] = useState('');
  const [value, setValue] = useState('Medical');

  // array state ...
  const [diagnosisArray, setDiagnosisArray] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState('');
  const [patientAssessmentArray, setPatientAssessmentArray] = useState([]);
  const [diagnosisFilterArray, setDiagnosisFilterArray] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [patientSympyomsArrayEdit, setPatientSympyomsArrayEdit] = useState([]);
  const [open, setOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

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
    if (diagnosisSearchInput) {
      fetchDiagnosisHandler();
    }
  }, [diagnosisSearchInput, value]);

  const fetchDiagnosisHandler = async () => {
    try {
      const __data = {
        ospital_id: userData?.hospital_id,
        reception_id: userData?._id,
        text: diagnosisSearchInput,
        type: value,
      };

      await axios.post(searchdiagnosisdata, __data).then(res => {
        const {data, message} = res.data;
        if (data.length > 0) {
          setDiagnosisArray(data);
        } else {
          Alert.alert('Error !!', message);
        }
      });
    } catch (error) {
      Alert.alert('Error !!', error);
    }
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
      opddiagnosishistoryarray: patientAssessmentArray,
      api_type: 'OPD-DIAGNOSIS',

      // patient details below ...
      uhid: selectedPatient?.patientuniqueno,
      mobilenumber: selectedPatient?.mobilenumber,
      patient_id: selectedPatient?.patient_id,
      appoint_id: selectedPatient?.appoint_id,
    };
    if (patientAssessmentArray?.length > 0) {
      try {
        await axios.post(addopdassessment, data).then(res => {
          if (res.data.status === true)
            return Alert.alert(
              'Success !!',
              'Diagnosis History Added Successfully',
            );
          else Alert.alert('Error !!', 'Diagnosis History Not Added');
        });
      } catch (error) {
        Alert.alert('Error !!', error);
      }
      navigation.replace('CreateRx');
    } else {
      Alert.alert('Warning !!', 'Add symptoms first');
    }
  };

  const diseasesHandler = res => {
    setSelectedDiseases(res.illnessname);
    setDiagnosisFilterArray(res);
    toggleModal();
  };

  useFocusEffect(
    useCallback(() => {
      const fetchmobileAssessment = async () => {
        try {
          await axios
            .post(FetchMobileOpdAssessmentForEditapi, {
              hospital_id: userData?.hospital_id,
              reception_id: userData?._id,
              patient_id: selectedPatient?._id,
              api_type: 'OPD-DIAGNOSIS',
              uhid: selectedPatient?.patientuniqueno,
              mobilenumber: selectedPatient?.mobilenumber,
              appoint_id: selectedPatient?.appoint_id,
            })
            .then(res => {
              console.log('res : ', res.data);
              setPatientSympyomsArrayEdit(
                res.data.opddiagnosisayurvedichistoryarray,
              );
            });
        } catch (error) {
          console.error(error);
        }
      };

      fetchmobileAssessment();
    }, []),
  );

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
          <Text style={styles.navbarText}>Diagnosis</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <ScrollView
          style={{marginBottom: 70}}
          vertical
          showsVerticalScrollIndicator={false}>
          {/* Segmented Buttons */}
          <View style={styles.segDiv}>
            <TouchableOpacity
              style={[
                styles.segButton,
                value === 'Medical' && styles.selectedButton,
              ]}
              onPress={() => setValue('Medical')}>
              <Text style={styles.segText}>Medical</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.segButton,
                value === 'Ayurvedic' && styles.selectedButton,
              ]}
              onPress={() => setValue('Ayurvedic')}>
              <Text style={styles.segText}>Ayurvedic</Text>
            </TouchableOpacity>
          </View>
          {/* Category Section */}
          <View style={styles.categoryDiv}>
            <Text style={styles.categoryText}>Diagnosis</Text>
            <View style={styles.filterDiv}>
              <TextInput
                style={[styles.filterinput, {padding: 4}]}
                placeholder="Search Diagnosis"
                value={diagnosisSearchInput}
                onChangeText={text => setDiagnosisSearchInput(text)}
              />
            </View>
            <View style={styles.catDiv}>
              {diagnosisArray?.length > 0 &&
                diagnosisArray.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => diseasesHandler(item)}
                    key={index + 1}
                    style={[
                      styles.segButton,
                      selectedDiseases === item.illnessname &&
                        styles.selectedButton,
                    ]}>
                    <Text style={styles.segText}>{item.illnessname}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
          {/* Symptoms Section */}
          <View style={styles.categoryDiv}>
            <Text style={styles.categoryText}>Previous Diagnosis History</Text>
            {patientSympyomsArrayEdit?.length > 0 ? (
              patientSympyomsArrayEdit?.map((item, index) => {
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
                        #{index + 1} Diagnosis
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('Editdiagnosis', {
                            data: item,
                            userData: userData,
                            selectedPatient: selectedPatient,
                          })
                        }
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
                        <Text style={styles.label}>ICD Code</Text>
                        <Text>{item.icdcode}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Diagnosis</Text>
                        <Text>{item.illnessname}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Diagnosis Type</Text>
                        <Text>{item.diagnosis_type}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Date / Time</Text>
                        <Text>
                          {item.adddate} / {item.addtime}
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
          {/* Symptoms Section */}
          <View style={styles.categoryDiv}>
            <Text style={styles.categoryText}>Diagnosis History</Text>
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
                        #{index + 1} Diagnosis
                      </Text>
                      <TouchableOpacity
                        onPress={() => removeSymptom(index)}
                        style={styles.deleteButton}>
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          color="#FF3B30"
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.sympDivOuter} key={index + 1}>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>ICD Code</Text>
                        <Text>{item.icdcode}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Diagnosis</Text>
                        <Text>{item.illnessname}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Diagnosis Type</Text>
                        <Text>{item.diagnosis_type}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Date / Time</Text>
                        <Text>
                          {item.adddate} / {item.addtime}
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
                Add Diagnosis
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
                adddate: '',
                addtime: '',
                icdcode: diagnosisFilterArray?.icdcode || '',
                diagnosis_type: '',
                illnessname: selectedDiseases,
                illness_id: diagnosisFilterArray?.illness_id || '',
              }}
              validate={values => {
                const errors = {};
                return errors;
              }}
              onSubmit={(values, {resetForm}) => {
                toggleModal();
                setPatientAssessmentArray(prevData => [...prevData, values]);
                resetForm();
              }}>
              {({handleSubmit, values, setFieldValue}) => {
                const [showDatePicker, setShowDatePicker] = useState(false);
                const [showTimePicker, setShowTimePicker] = useState(false);
                return (
                  <>
                    <View style={styles.modalDiv}>
                      <View>
                        <Text style={styles.modalText}>Illness</Text>
                        <TouchableOpacity
                          style={[
                            styles.segButton,
                            selectedDiseases && styles.selectedButton,
                          ]}>
                          <Text style={styles.segText}>
                            {
                              // Find the illness that matches selectedDiseases
                              diagnosisArray.find(
                                item => item.illnessname === selectedDiseases,
                              )?.illnessname || '-'
                            }
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{marginBottom: 10}}>
                        <Text style={styles.modalText}>Diagnosis Type</Text>

                        <View style={{flexDirection: 'row', gap: 8}}>
                          <TouchableOpacity
                            key={'Provisional'}
                            onPress={() =>
                              setFieldValue('diagnosis_type', 'Provisional')
                            }
                            style={[
                              styles.segButton,
                              values.diagnosis_type === 'Provisional' &&
                                styles.selectedButton,
                            ]}>
                            <Text style={styles.segText}>Provisional</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            key={'Final'}
                            onPress={() =>
                              setFieldValue('diagnosis_type', 'Final')
                            }
                            style={[
                              styles.segButton,
                              values.diagnosis_type === 'Final' &&
                                styles.selectedButton,
                            ]}>
                            <Text style={styles.segText}>Final</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View>
                        <Text style={styles.modalText}>ICD Code</Text>

                        <View style={{flexDirection: 'row', gap: 8}}>
                          <View style={[styles.segButton]}>
                            <Text style={styles.segText}>{values.icdcode}</Text>
                          </View>
                        </View>
                      </View>
                      <View>
                        <Text style={styles.modalText}>Date</Text>
                        <TouchableOpacity
                          style={[
                            styles.segButton,
                            {flexDirection: 'row', gap: 20},
                          ]}
                          onPress={() => setOpen(true)}>
                          <Text style={styles.segText}>
                            {values.adddate || 'Select Date'}
                          </Text>
                          <DatePicker
                            modal
                            mode="date"
                            open={open}
                            date={new Date()}
                            onConfirm={selectedDate => {
                              setOpen(false);
                              const formattedDate = selectedDate
                                .toISOString()
                                .split('T')[0];
                              setFieldValue('adddate', formattedDate);
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
                      <View>
                        <Text style={styles.modalText}>Time</Text>
                        <TouchableOpacity
                          style={[
                            styles.segButton,
                            {flexDirection: 'row', gap: 20},
                          ]}
                          onPress={() => setTimeOpen(true)}>
                          <Text style={styles.segText}>
                            {values.addtime || 'Select Time'}
                          </Text>
                          <DatePicker
                            modal
                            mode="time"
                            open={timeOpen}
                            date={new Date()}
                            onConfirm={selectedTime => {
                              setTimeOpen(false);
                              const hours = selectedTime
                                .getHours()
                                .toString()
                                .padStart(2, '0');
                              const minutes = selectedTime
                                .getMinutes()
                                .toString()
                                .padStart(2, '0');
                              setFieldValue('addtime', `${hours}:${minutes}`);
                            }}
                            onCancel={() => {
                              setTimeOpen(false);
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

export default Diagnosis;

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
  segDiv: {
    padding: 10,
    flexDirection: 'row',
    alignContent: 'center',
    gap: 10,
  },
});
