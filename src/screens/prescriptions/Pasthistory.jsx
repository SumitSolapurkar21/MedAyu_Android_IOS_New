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
  faPencil,
  faPencilSquare,
  faPlus,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import UserContext from '../../functions/usercontext';
import axios from 'axios';
import {
  addopdassessment,
  fetchdiseases,
  FetchMobileOpdAssessmentForEditapi,
} from '../../api/api';
import {Formik} from 'formik';
import {Modal} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';

const Pasthistory = () => {
  const navigation = useNavigation();
  const formikRef = useRef(null);
  const {userData, selectedPatient} = useContext(UserContext);

  // input state ...
  const [diseaseSearchInput, setDiseaseSearchInput] = useState('');

  // array state ...
  const [diseasesArray, setDiseasesArray] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState('');
  const [patientAssessmentArray, setPatientAssessmentArray] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [manualDateSelected, setManualDateSelected] = useState(false);

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

  // fetch diseases handler ....
  useEffect(() => {
    if (diseaseSearchInput) {
      fetchDiseasesHandler();
    }
  }, [diseaseSearchInput]);

  const fetchDiseasesHandler = async () => {
    try {
      const __data = {
        hospital_id: userData?.hospital_id,
        // patient_id: patient_id,
        reception_id: userData?._id,
        text: diseaseSearchInput,
      };

      await axios.post(fetchdiseases, __data).then(res => {
        const {data, message} = res.data;
        if (data.length > 0) {
          setDiseasesArray(data);
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

  const calculateDateDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return {years, months, days};
  };

  const calculateDateFromInput = (years, months, days) => {
    const currentDate = new Date();

    // Adjust the year
    currentDate.setFullYear(currentDate.getFullYear() - years);

    // Adjust the month, handle overflow
    let targetMonth = currentDate.getMonth() - months;
    if (targetMonth < 0) {
      currentDate.setFullYear(
        currentDate.getFullYear() - Math.ceil(Math.abs(targetMonth) / 12),
      );
      targetMonth = (12 + (targetMonth % 12)) % 12; // Normalize month
    }
    currentDate.setMonth(targetMonth);

    // Adjust the day
    currentDate.setDate(currentDate.getDate() - days);

    // Format as yyyy-mm-dd for consistency
    return currentDate.toISOString().split('T')[0];
  };

  // add symptoms for patients .....
  const addPatientAssessmentToArrayHandler = __data => {
    toggleModal();
    setPatientAssessmentArray(prevData => [...prevData, __data]);
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
      opdpasthistoryarray: patientAssessmentArray,
      api_type: 'OPD-PAST-HISTORY',

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
            return Alert.alert('Success !!', 'Past History Added Successfully');
          else Alert.alert('Error !!', 'Past History Not Added');
        });
      } catch (error) {
        Alert.alert('Error !!', error);
      }
      navigation.replace('CreateRx');
    } else {
      Alert.alert('Warning !!', 'Add symptoms first');
    }
  };

  // fetch complaints
  useFocusEffect(
    useCallback(() => {
      const fetchmobileAssessment = async () => {
        try {
          await axios
            .post(FetchMobileOpdAssessmentForEditapi, {
              hospital_id: userData?.hospital_id,
              reception_id: userData?._id,
              patient_id: selectedPatient?._id,
              api_type: 'OPD-PAST-HISTORY',
              uhid: selectedPatient?.patientuniqueno,
              mobilenumber: selectedPatient?.mobilenumber,
              appoint_id: selectedPatient?.appoint_id,
            })
            .then(res => {
              console.log('res : ', res.data);
              setPatientSympyomsArrayEdit(res.data.opdpasthistoryarray);
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
          <Text style={styles.navbarText}>Past History</Text>
        </TouchableOpacity>
      </View>

      {isModalVisible ? (
        <>
          {/* add symptoms Modal */}
          <View
            visible={isModalVisible}
            onDismiss={toggleModal}
            contentContainerStyle={styles.bottomModalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalContentHeader}>
                <Text
                  style={[styles.modalText, {marginBottom: 0, fontSize: 18}]}>
                  Add Diseases
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
                  treatment_status: '',
                  days: '',
                  months: '',
                  years: '',
                  illnessname: selectedDiseases,
                  from_date: '',
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
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  setFieldValue,
                }) => {
                  // Update `from_date` when `years`, `months`, or `days` changes, but only if a manual date wasn't selected
                  useEffect(() => {
                    if (!manualDateSelected) {
                      const years = parseInt(values.years) || 0;
                      const months = parseInt(values.months) || 0;
                      const days = parseInt(values.days) || 0;

                      if (years || months || days) {
                        const calculatedDate = calculateDateFromInput(
                          years,
                          months,
                          days,
                        );
                        setFieldValue('from_date', calculatedDate);
                      }
                    }
                  }, [values.years, values.months, values.days]);

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
                                diseasesArray.find(
                                  item => item.illnessname === selectedDiseases,
                                )?.illnessname || '-'
                              }
                            </Text>
                          </TouchableOpacity>
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

                                // Calculate difference between selected date and today
                                const {years, months, days} =
                                  calculateDateDifference(
                                    selectedDate,
                                    new Date(),
                                  );
                                setFieldValue('years', years.toString());
                                setFieldValue('months', months.toString());
                                setFieldValue('days', days.toString());
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
                        {/* Years Field */}
                        <View>
                          <Text style={styles.modalText}>Years</Text>
                          <TextInput
                            keyboardType="numeric"
                            style={styles.filterinput}
                            placeholder="Years"
                            value={values.years}
                            onChangeText={text => {
                              setFieldValue('years', text);
                              setManualDateSelected(false); // Reset manual selection if user edits fields
                            }}
                            onBlur={handleBlur('years')}
                          />
                        </View>

                        {/* Months Field */}
                        <View>
                          <Text style={styles.modalText}>Months</Text>
                          <TextInput
                            keyboardType="numeric"
                            style={styles.filterinput}
                            placeholder="Months"
                            value={values.months}
                            onChangeText={text => {
                              setFieldValue('months', text);
                              setManualDateSelected(false); // Reset manual selection if user edits fields
                            }}
                            onBlur={handleBlur('months')}
                          />
                        </View>

                        {/* Days Field */}
                        <View>
                          <Text style={styles.modalText}>Days</Text>
                          <TextInput
                            keyboardType="numeric"
                            style={styles.filterinput}
                            placeholder="Days"
                            value={values.days}
                            onChangeText={text => {
                              setFieldValue('days', text);
                              setManualDateSelected(false); // Reset manual selection if user edits fields
                            }}
                            onBlur={handleBlur('days')}
                          />
                        </View>
                      </View>
                      <View style={{marginBottom: 10}}>
                        <Text style={styles.modalText}>Treatment Status</Text>

                        <View style={{flexDirection: 'row', gap: 8}}>
                          <TouchableOpacity
                            key={'Treated'}
                            onPress={() =>
                              setFieldValue('treatment_status', 'Treated')
                            }
                            style={[
                              styles.segButton,
                              values.treatment_status === 'Treated' &&
                                styles.selectedButton,
                            ]}>
                            <Text style={styles.segText}>Treated</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            key={'Treatment'}
                            onPress={() =>
                              setFieldValue('treatment_status', 'Treatment')
                            }
                            style={[
                              styles.segButton,
                              values.treatment_status === 'Treatment' &&
                                styles.selectedButton,
                            ]}>
                            <Text style={styles.segText}>On Treatment</Text>
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
          </View>
        </>
      ) : (
        <View style={styles.container}>
          <ScrollView
            style={{marginBottom: 70}}
            vertical
            showsVerticalScrollIndicator={false}>
            {/* Category Section */}
            <View style={styles.categoryDiv}>
              <Text style={styles.categoryText}>Diseases</Text>
              <View style={styles.filterDiv}>
                <TextInput
                  style={[styles.filterinput]}
                  placeholder="Search Diseases"
                  value={diseaseSearchInput}
                  onChangeText={text => setDiseaseSearchInput(text)}
                />
              </View>
              <View style={styles.catDiv}>
                {diseasesArray?.length > 0 &&
                  diseasesArray?.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => diseasesHandler(item.illnessname)}
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

            {/* Already 
          Symptoms Section */}
            <View style={styles.categoryDiv}>
              <Text style={styles.categoryText}>Previous Past History</Text>
              {patientSympyomsArrayEdit?.length > 0 ? (
                patientSympyomsArrayEdit?.map((item, index) => {
                  return (
                    <View
                      style={[styles.sympDiv, styles.sympContainer]}
                      key={index + 1}>
                      <View style={styles.sympDivOuter} key={index + 1}>
                        <Text style={styles.sympText}>
                          {item.illnessname} {item.from_date} {item.years}{' '}
                          {item.months} {item.days} {item.treatment_status}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.editIcon}
                        onPress={() =>
                          navigation.navigate('Editpasthistory', {
                            data: item,
                            userData,
                            selectedPatient,
                          })
                        }>
                        <FontAwesomeIcon
                          icon={faPencil}
                          color="#05b508"
                          style={[styles.icon, {padding: 9}]}
                        />
                      </TouchableOpacity>
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
              <Text style={styles.categoryText}>Past History</Text>
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
                          #{index + 1} Symptom
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
                          <Text style={styles.label}>Illness</Text>
                          <Text>{item.illnessname}</Text>
                        </View>
                        <View style={styles.sympDivInner}>
                          <Text style={styles.label}>From Date</Text>
                          <Text>{item.from_date}</Text>
                        </View>
                        <View style={styles.sympDivInner}>
                          <Text style={styles.label}>Years</Text>
                          <Text>{item.years}</Text>
                        </View>
                        <View style={styles.sympDivInner}>
                          <Text style={styles.label}>Months</Text>
                          <Text>{item.months}</Text>
                        </View>
                        <View style={styles.sympDivInner}>
                          <Text style={styles.label}>Days</Text>
                          <Text>{item.days}</Text>
                        </View>
                        <View style={styles.sympDivInner}>
                          <Text style={styles.label}>Treatment Status</Text>
                          <Text>{item.treatment_status}</Text>
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
        </View>
      )}
    </>
  );
};

export default Pasthistory;

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
  sympContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sympText: {
    fontSize: 16,
    fontWeight: 'normal',
    flex: 0.9
  },
  editIcon: {
    padding: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#05b508',
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
    padding: 8,
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
  modalContent: {
    padding: 20,
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
});
