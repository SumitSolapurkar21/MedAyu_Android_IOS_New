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
  faPencilSquare,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
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

const Familyhistory = () => {
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

  // relation data...
  let relationArray = [
    {label: 'Mother', value: 'Mother'},
    {label: 'Father', value: 'Father'},
    {label: 'Brother', value: 'Brother'},
    {label: 'Niece', value: 'Niece'},
    {label: 'Nephew', value: 'Nephew'},
    {label: 'Sister', value: 'Sister'},
    {label: 'Spouse', value: 'Spouse'},
    {label: 'Elder Brother', value: 'Elder Brother'},
    {label: 'Elder Sister', value: 'Elder Sister'},
    {label: 'Younger Brother', value: 'Younger Brother'},
    {label: 'Younger Sister', value: 'Younger Sister'},
    {label: 'Son', value: 'Son'},
    {label: 'Daughter', value: 'Daughter'},
    {label: 'Husband', value: 'Husband'},
    {label: 'Wife', value: 'Wife'},
    {label: 'Fiancé Or Fiancée', value: 'Fiancé Or Fiancée'},
    {label: 'Aunt', value: 'Aunt'},
    {label: 'Uncle', value: 'Uncle'},
    {label: 'Guest', value: 'Guest'},
    {label: 'Teacher', value: 'Teacher'},
    {label: 'Step Brother', value: 'Step Brother'},
    {label: 'Customer', value: 'Customer'},
    {label: 'Landlord', value: 'Landlord'},
    {label: 'Friend', value: 'Friend'},
    {label: 'Lover', value: 'Lover'},
    {label: 'Girlfriend', value: 'Girlfriend'},
    {label: 'Boyfriend', value: 'Boyfriend'},
    {label: 'Client', value: 'Client'},
    {label: 'Patient', value: 'Patient'},
    {label: 'Step Sister', value: 'Step Sister'},
    {label: 'Step Mother', value: 'Step Mother'},
    {label: 'Step Father', value: 'Step Father'},
    {label: 'Step Son', value: 'Step Son'},
    {label: 'Step Daughter', value: 'Step Daughter'},
    {
      label: 'Grandfather (Father Of Mother)',
      value: 'Grandfather (Father Of Mother)',
    },
    {
      label: 'Grandmother (Mother Of Mother)',
      value: 'Grandmother (Mother Of Mother)',
    },
    {label: 'Relative', value: 'Relative'},
    {label: 'Own', value: 'Own'},
    {label: 'Maternal-Grandfather', value: 'Maternal-Grandfather'},
    {label: 'Maternal-Grandmother', value: 'Maternal-Grandmother'},
    {
      label: 'Grandfather (Father Of Father)',
      value: 'Grandfather (Father Of Father)',
    },
    {
      label: 'Grandmother (Mother Of Father)',
      value: 'Grandmother (Mother Of Father)',
    },
    {label: 'Adopted Daughter', value: 'Adopted Daughter'},
    {label: 'Adopted Son', value: 'Adopted Son'},
    {
      label: 'Son’s Wife (Daughter In Law)',
      value: 'Son’s Wife (Daughter In Law)',
    },
    {
      label: 'Daughter’s Husband (Son In Law)',
      value: 'Daughter’s Husband (Son In Law)',
    },
    {label: 'Son’s Son (Grandson)', value: 'Son’s Son (Grandson)'},
    {
      label: 'Son’s Daughter (Grand Daughter)',
      value: 'Son’s Daughter (Grand Daughter)',
    },
    {label: 'Daughter’s Son', value: 'Daughter’s Son'},
    {label: 'Daughter’s Daughter', value: 'Daughter’s Daughter'},
    {
      label: 'Husband Sister (sister In Law)',
      value: 'Husband Sister (sister In Law)',
    },
    {label: 'Father’s Sister', value: 'Father’s Sister'},
    {label: 'Elder Sister Husband', value: 'Elder Sister Husband'},
    {label: 'Younger Sister Husband', value: 'Younger Sister Husband'},
    {
      label: 'Husband Elder Brother (Brother In Law)',
      value: 'Husband Elder Brother (Brother In Law)',
    },
    {label: 'Husband Younger Brother', value: 'Husband Younger Brother'},
    {label: 'Elder Brother’s Wife', value: 'Elder Brother’s Wife'},
    {label: 'Younger Brothers Wife', value: 'Younger Brothers Wife'},
    {
      label: 'Wife’s Sister (Sister in Law)',
      value: 'Wife’s Sister (Sister in Law)',
    },
    {label: 'Wife’s Elder Brother', value: 'Wife’s Elder Brother'},
    {label: 'Wife’s Younger Brother', value: 'Wife’s Younger Brother'},
    {label: 'Younger Sister Husband', value: 'Younger Sister Husband'},
    {
      label: 'Husband’s Elder Brother (Brother In Law)',
      value: 'Husband’s Elder Brother (Brother In Law)',
    },
    {label: 'Wife’s Brother Wife', value: 'Wife’s Brother Wife'},
    {label: 'Husband Younger Brother', value: 'Husband Younger Brother'},
    {label: 'Husband’s Sister’s Husband', value: 'Husband’s Sister’s Husband'},
    {label: 'Wife’s Sister’s Husband', value: 'Wife’s Sister’s Husband'},
    {
      label: 'Husband’s Elder Brother’s Wife',
      value: 'Husband’s Elder Brother’s Wife',
    },
    {
      label: 'Husband’s Younger Brother’s Wife',
      value: 'Husband’s Younger Brother’s Wife',
    },
    {
      label: 'Father’s Brother’s Son (Cousin)',
      value: 'Father’s Brother’s Son (Cousin)',
    },
    {
      label: 'Fathers Brother’s Daughter (Cousin)',
      value: 'Fathers Brother’s Daughter (Cousin)',
    },
    {
      label: 'Father’s Sister’s Son (Cousin)',
      value: 'Father’s Sister’s Son (Cousin)',
    },
    {
      label: 'Father’s Sister’s Daughter (Cousin)',
      value: 'Father’s Sister’s Daughter (Cousin)',
    },
    {
      label: 'Mother’s Brother’s Son (Cousin)',
      value: 'Mother’s Brother’s Son (Cousin)',
    },
    {
      label: 'Mother’s Brother’s Daughter (Cousin)',
      value: 'Mother’s Brother’s Daughter (Cousin)',
    },
    {
      label: 'Mother’s Sister’s Son (Cousin)',
      value: 'Mother’s Sister’s Son (Cousin)',
    },
    {
      label: 'Mother’s Sister’s Daughter (Cousin)',
      value: 'Mother’s Sister’s Daughter (Cousin)',
    },
    {
      label: 'Spouse’s Mother (Mother In Law)',
      value: 'Spouse’s Mother (Mother In Law)',
    },
    {
      label: 'Spouse’s Father (Father In Law)',
      value: 'Spouse’s Father (Father In Law)',
    },
    {
      label: 'Father’s Younger Brother (Uncle)',
      value: 'Father’s Younger Brother (Uncle)',
    },
    {
      label: 'Father’s Elder Brother (Uncle)',
      value: 'Father’s Elder Brother (Uncle)',
    },
    {
      label: 'Father’s Younger Brother’s Wife (Aunt)',
      value: 'Father’s Younger Brother’s Wife (Aunt)',
    },
    {label: 'Mother’s Brother', value: 'Mother’s Brother'},
    {label: 'Mother’s Younger Sister', value: 'Mother’s Younger Sister'},
    {
      label: 'Mother’s Younger Sister’s Husband',
      value: 'Mother’s Younger Sister’s Husband',
    },
    {
      label: 'Mother’s Elder Sister’s Husband (Uncle)',
      value: 'Mother’s Elder Sister’s Husband (Uncle)',
    },
    {
      label: 'Mother’s Elder Sister (Aunt)',
      value: 'Mother’s Elder Sister (Aunt)',
    },
    {label: 'Mother’s Brother Wife', value: 'Mother’s Brother Wife'},
    {label: 'Mistress', value: 'Mistress'},
    {label: 'Concubine / Keep Mistress', value: 'Concubine / Keep Mistress'},
    {label: 'Pupil', value: 'Pupil'},
    {label: 'Disciple', value: 'Disciple'},
    {label: 'Preceptor', value: 'Preceptor'},
    {label: 'Tenant', value: 'Tenant'},
  ];

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
      opdfamilyhistoryarray: patientAssessmentArray,
      api_type: 'OPD-FAMILY-HISTORY',

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
              'Family History Added Successfully',
            );
          else Alert.alert('Error !!', 'Family History Not Added');
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
            api_type: 'OPD-FAMILY-HISTORY',
            uhid: selectedPatient?.patientuniqueno,
            mobilenumber: selectedPatient?.mobilenumber,
            appoint_id: selectedPatient?.appoint_id,
          })
          .then(res => {
            console.log('res : ', res.data);
            setPatientSympyomsArrayEdit(res.data.opdfamilyhistoryarray);
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
          <Text style={styles.navbarText}>Family History</Text>
        </TouchableOpacity>
      </View>

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
                style={[styles.filterinput, {padding: 4}]}
                placeholder="Search Diseases"
                value={diseaseSearchInput}
                onChangeText={text => setDiseaseSearchInput(text)}
              />
            </View>
            <View style={styles.catDiv}>
              {diseasesArray?.length > 0 &&
                diseasesArray.map((item, index) => (
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
            {
            patientSympyomsArrayEdit?.length > 0 ? (
              patientSympyomsArrayEdit?.map((item, index) => {
                console.log('patientSympyomsArrayEdit : ', item);
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
                      <TouchableOpacity>
                        <FontAwesomeIcon
                          icon={faPencilSquare}
                          color="#05b508"
                          style={[styles.icon, {padding: 9}]}
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
          {/* Symptoms Section */}
          <View style={styles.categoryDiv}>
            <Text style={styles.categoryText}>Family History</Text>
            {patientAssessmentArray?.length > 0 ? (
              patientAssessmentArray?.map((item, index) => {
                return (
                  <>
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
                          <Text style={styles.label}>Relations</Text>
                          <Text>{item.treatment_status}</Text>
                        </View>
                      </View>
                    </View>
                  </>
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
                      <Text style={styles.modalText}>Relation Status</Text>

                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={{flexDirection: 'row'}}>
                        {relationArray &&
                          relationArray?.map((item, index) => {
                            return (
                              <TouchableOpacity
                                key={index + 1}
                                onPress={() =>
                                  setFieldValue('treatment_status', item.value)
                                }
                                style={[
                                  styles.segButton,
                                  values.treatment_status === item.value &&
                                    styles.selectedButton,
                                  {marginRight: 4},
                                ]}>
                                <Text style={styles.segText}>{item.label}</Text>
                              </TouchableOpacity>
                            );
                          })}
                      </ScrollView>
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

export default Familyhistory;

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
});
