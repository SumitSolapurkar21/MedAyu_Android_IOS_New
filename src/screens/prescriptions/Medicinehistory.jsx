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
import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
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
  fetchdiseases,
  fetchmedicines,
  FetchMobileOpdAssessmentForEditapi,
} from '../../api/api';
import {Formik} from 'formik';
import {Modal} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';

const Medicinehistory = () => {
  const navigation = useNavigation();
  const formikRef = useRef(null);
  const {userData, selectedPatient} = useContext(UserContext);

  // input state ...
  const [diseaseSearchInput, setDiseaseSearchInput] = useState('');

  // array state ...
  const [medicineArray, setMedicineArray] = useState([]);
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
        reception_id: userData?._id,
        text: diseaseSearchInput,
      };

      await axios.post(fetchmedicines, __data).then(res => {
        const {data, message} = res.data;
        if (data.length > 0) {
          setMedicineArray(data);
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

    const filteData =
      medicineArray.length > 0 &&
      medicineArray?.filter(res => {
        return res.drugname === __data;
      });
    setSelectedDiseases(filteData);
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
      opdmedicinehistoryarray: patientAssessmentArray,
      api_type: 'OPD-MEDICINE-HISTORY',

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
              'Medicine History Added Successfully',
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

  useFocusEffect(
    useCallback(() => {
      const fetchmobileAssessment = async () => {
        try {
        await axios
          .post(FetchMobileOpdAssessmentForEditapi, {
            hospital_id: userData?.hospital_id,
            reception_id: userData?._id,
            patient_id: selectedPatient?._id,
            api_type: 'OPD-MEDICINE-HISTORY',
            uhid: selectedPatient?.patientuniqueno,
            mobilenumber: selectedPatient?.mobilenumber,
            appoint_id: selectedPatient?.appoint_id,
          })
          .then(res => {
            console.log('res : ', res.data);
            setPatientSympyomsArrayEdit(res.data.opdmedicinehistoryarray);
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
          <Text style={styles.navbarText}>Medicine History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <ScrollView
          style={{marginBottom: 70}}
          vertical
          showsVerticalScrollIndicator={false}>
          {/* Category Section */}
          <View style={styles.categoryDiv}>
            <Text style={styles.categoryText}>Medicine</Text>
            <View style={styles.filterDiv}>
              <TextInput
                style={[styles.filterinput, {padding: 4}]}
                placeholder="Search Diseases"
                value={diseaseSearchInput}
                onChangeText={text => setDiseaseSearchInput(text)}
              />
            </View>
            <View style={styles.catDiv}>
              {medicineArray?.length > 0 &&
                medicineArray.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => diseasesHandler(item.drugname)}
                    key={index + 1}
                    style={[
                      styles.segButton,
                      selectedDiseases === item.drugname &&
                        styles.selectedButton,
                    ]}>
                    <Text style={styles.segText}>{item.drugname}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
          {/* Symptoms Section */}
          <View style={styles.categoryDiv}>
            <Text style={styles.categoryText}>Previous Medicine History</Text>
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
                          #{index + 1} Symptom
                        </Text>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => navigation.navigate('Editmedicinehistory', {data: item, userData, selectedPatient})}>
                          <FontAwesomeIcon 
                            icon={faPencilSquare}
                            color="#05b508"
                            style={styles.icon}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.sympDivOuter} key={index + 1}>
                        <View style={styles.sympDivInner}>
                          <Text style={styles.label}>Drug Name</Text>
                          <Text>{item.drugname}</Text>
                        </View>
                        <View style={styles.sympDivInner}>
                          <Text style={styles.label}>Dose</Text>
                          <Text>{item.dose}</Text>
                        </View>
                        <View style={styles.sympDivInner}>
                          <Text style={styles.label}>Route</Text>
                          <Text>{item.route}</Text>
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
            <Text style={styles.categoryText}>Medicine History</Text>
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
                        <Text style={styles.label}>Grug Name</Text>
                        <Text>{item.drugname}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Dose</Text>
                        <Text>{item.drugname}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Route</Text>
                        <Text>{item.drugname}</Text>
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
                Add Medicine
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
                dose:
                  selectedDiseases.length > 0 ? selectedDiseases[0].dose : '',
                route:
                  selectedDiseases.length > 0 ? selectedDiseases[0].route : '',
                schedule:
                  selectedDiseases.length > 0
                    ? selectedDiseases[0].schedule
                    : '',
                drugname:
                  selectedDiseases.length > 0
                    ? selectedDiseases[0].drugname
                    : '', // Set the first drugname as initial value
                years: '',
                months: '',
                days: '',
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
                    {selectedDiseases.length > 0 &&
                      selectedDiseases.map((res, index) => {
                        return (
                          <View style={styles.modalDiv} key={index}>
                            <View>
                              <Text style={styles.modalText}>Drug Name</Text>
                              <TouchableOpacity
                                style={[
                                  styles.segButton,
                                  selectedDiseases && styles.selectedButton,
                                ]}>
                                <Text style={styles.segText}>
                                  {res.drugname}
                                </Text>
                              </TouchableOpacity>
                            </View>

                            {/* Input Fields with setFieldValue */}
                            <View>
                              <Text style={styles.modalText}>Dose</Text>
                              <TextInput
                                style={styles.filterinput}
                                placeholder="Dose"
                                value={values.dose}
                                onChangeText={text => {
                                  setFieldValue('dose', text);
                                }}
                                onBlur={handleBlur('dose')}
                              />
                            </View>

                            <View>
                              <Text style={styles.modalText}>Route</Text>
                              <TextInput
                                style={styles.filterinput}
                                placeholder="Route"
                                value={values.route}
                                onChangeText={text => {
                                  setFieldValue('route', text);
                                }}
                                onBlur={handleBlur('route')}
                              />
                            </View>

                            <View>
                              <Text style={styles.modalText}>Schedule</Text>
                              <TextInput
                                keyboardType="numeric"
                                style={styles.filterinput}
                                placeholder="Schedule"
                                value={values.schedule}
                                onChangeText={text => {
                                  setFieldValue('schedule', text);
                                }}
                                onBlur={handleBlur('schedule')}
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

                            {/* Update Years, Months, and Days */}
                            <View>
                              <Text style={styles.modalText}>Years</Text>
                              <TextInput
                                keyboardType="numeric"
                                style={styles.filterinput}
                                placeholder="Years"
                                value={values.years}
                                onChangeText={text => {
                                  setFieldValue('years', text);
                                  setManualDateSelected(false);
                                }}
                                onBlur={handleBlur('years')}
                              />
                            </View>

                            <View>
                              <Text style={styles.modalText}>Months</Text>
                              <TextInput
                                keyboardType="numeric"
                                style={styles.filterinput}
                                placeholder="Months"
                                value={values.months}
                                onChangeText={text => {
                                  setFieldValue('months', text);
                                  setManualDateSelected(false);
                                }}
                                onBlur={handleBlur('months')}
                              />
                            </View>

                            <View>
                              <Text style={styles.modalText}>Days</Text>
                              <TextInput
                                keyboardType="numeric"
                                style={styles.filterinput}
                                placeholder="Days"
                                value={values.days}
                                onChangeText={text => {
                                  setFieldValue('days', text);
                                  setManualDateSelected(false);
                                }}
                                onBlur={handleBlur('days')}
                              />
                            </View>
                          </View>
                        );
                      })}

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

export default Medicinehistory;
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
