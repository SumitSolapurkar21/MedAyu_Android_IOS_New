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
  faPencil,
  faPencilSquare,
  faPlus,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import UserContext from '../../functions/usercontext';
import axios from 'axios';
import {
  addopdassessment,
  fetchmedicines,
  FetchMobileOpdAssessmentForEditapi,
} from '../../api/api';
import {Formik} from 'formik';
import {Modal} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';

const Treatment = () => {
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
  const [selectedTreatmentArray, setSelectedTreatmentArray] = useState([]);

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
    const filterTreatment =
      diseasesArray.length > 0 &&
      diseasesArray?.filter(res => res.drugname === __data);
    setSelectedTreatmentArray(filterTreatment);
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
      opdtreatmenthistoryarray: patientAssessmentArray,
      api_type: 'OPD-TREATMENT',

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
              'Treatment History Added Successfully',
            );
          else Alert.alert('Error !!', 'Treatment History Not Added');
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
            api_type: 'OPD-TREATMENT',
            uhid: selectedPatient?.patientuniqueno,
            mobilenumber: selectedPatient?.mobilenumber,
            appoint_id: selectedPatient?.appoint_id,
          })
          .then(res => {
            console.log('res : ', res.data);
            setPatientSympyomsArrayEdit(res.data.opdtreatmenthistoryarray);
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
          <Text style={styles.navbarText}>Treatment History</Text>
        </TouchableOpacity>
      </View>

      {!isModalVisible ? (
        <View style={styles.container}>
          <ScrollView
            style={{marginBottom: 70}}
            vertical
            showsVerticalScrollIndicator={false}>
            {/* Category Section */}
            <View style={styles.categoryDiv}>
              <Text style={styles.categoryText}>Treatment</Text>
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
                  diseasesArray.map((item, index) => (
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
              <Text style={styles.categoryText}>
                Previous Treatment History
              </Text>
              {patientSympyomsArrayEdit?.length > 0 ? (
                patientSympyomsArrayEdit?.map((item, index) => {
                  console.log('patientSympyomsArrayEdit : ', item);
                  return (
                    <View
                      style={[styles.sympDiv, styles.sympContainer]}
                      key={index + 1}>
                      <Text style={styles.sympText}>
                        {item.drugcode} &nbsp; {item.drugname} &nbsp;{' '}
                        {item.brandname} &nbsp; {item.dose} &nbsp; {item.anupan}
                        &nbsp; {item.route} &nbsp; {item.schedule} &nbsp;{' '}
                        {item.duration} &nbsp; {item.from_date}
                      </Text>
                      <TouchableOpacity
                        style={styles.editIcon}
                        onPress={() =>
                          navigation.navigate('Edittreatment', {
                            data: item,
                            userData: userData,
                            selectedPatient: selectedPatient,
                          })
                        }>
                        <FontAwesomeIcon
                          icon={faPencil}
                          color="#05b508"
                          style={styles.icon}
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
              <Text style={styles.categoryText}>Treatment History</Text>
              {patientAssessmentArray?.length > 0 ? (
                patientAssessmentArray?.map((item, index) => {
                  console.log('item : ', item);
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
                          #{index + 1} Treatment
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
                          <Text style={styles.label}>Drug Code</Text>
                          <Text>{item.drugcode}</Text>
                        </View>
                        <View style={styles.sympDivInner}>
                          <Text style={styles.label}>Drug Name</Text>
                          <Text>{item.drugname}</Text>
                        </View>
                        <View style={styles.sympDivInner}>
                          <Text style={styles.label}>Brand Name</Text>
                          <Text>{item.brandname}</Text>
                        </View>
                        <View style={styles.sympDivInner}>
                          <Text style={styles.label}>Dose</Text>
                          <Text>{item.dose}</Text>
                        </View>
                        <View style={styles.sympDivInner}>
                          <Text style={styles.label}>Instruction</Text>
                          <Text>{item.anupan}</Text>
                        </View>
                        <View style={styles.sympDivInner}>
                          <Text style={styles.label}>Route</Text>
                          <Text>{item.route}</Text>
                        </View>
                        <View style={styles.sympDivInner}>
                          <Text style={styles.label}>Schedule</Text>
                          <Text>{item.schedule}</Text>
                        </View>
                        <View style={styles.sympDivInner}>
                          <Text style={styles.label}>Days</Text>
                          <Text>{item.duration}</Text>
                        </View>
                        <View style={styles.sympDivInner}>
                          <Text style={styles.label}>From Date</Text>
                          <Text>{item.from_date}</Text>
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
      ) : (
        <View
          visible={isModalVisible}
          onDismiss={toggleModal}
          contentContainerStyle={styles.bottomModalContainer}>
          <View style={{padding: 20}}>
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
                drugname: selectedTreatmentArray[0]?.drugname || '',
                drugcode: selectedTreatmentArray[0]?.drugcode || '',
                brandname: selectedTreatmentArray[0]?.brandname || '',
                dose: selectedTreatmentArray[0]?.dose || '',
                anupan: selectedDiseases,
                route: selectedTreatmentArray[0]?.route || '',
                schedule: selectedTreatmentArray[0]?.schedule || '',
                duration: selectedTreatmentArray[0]?.duration || '',
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
                return (
                  <>
                    <View style={styles.modalDiv}>
                      <View>
                        <Text style={styles.modalText}>Drug Code</Text>
                        <TouchableOpacity
                          style={[
                            styles.segButton,
                            selectedDiseases && styles.selectedButton,
                          ]}>
                          <Text style={styles.segText}>
                            {
                              // Find the illness that matches selectedDiseases
                              diseasesArray.find(
                                item => item.drugname === selectedDiseases,
                              )?.drugname || '-'
                            }
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View>
                        <Text style={styles.modalText}>Drug Name</Text>
                        <TextInput
                          style={styles.filterinput}
                          placeholder="drugname"
                          value={values.drugname}
                          onChangeText={text => {
                            setFieldValue('drugname', text);
                          }}
                          onBlur={handleBlur('drugname')}
                        />
                      </View>
                      <View>
                        <Text style={styles.modalText}>Brand Name</Text>
                        <TextInput
                          style={styles.filterinput}
                          placeholder="brandname"
                          value={values.brandname}
                          onChangeText={text => {
                            setFieldValue('brandname', text);
                          }}
                          onBlur={handleBlur('brandname')}
                        />
                      </View>
                      <View>
                        <Text style={styles.modalText}>Dose</Text>
                        <TextInput
                          style={styles.filterinput}
                          placeholder="dose"
                          value={values.dose}
                          onChangeText={text => {
                            setFieldValue('dose', text);
                          }}
                          onBlur={handleBlur('dose')}
                        />
                      </View>
                      <View>
                        <Text style={styles.modalText}>Instruction</Text>
                        <TextInput
                          style={styles.filterinput}
                          placeholder="anupan"
                          value={values.anupan}
                          onChangeText={text => {
                            setFieldValue('anupan', text);
                          }}
                          onBlur={handleBlur('anupan')}
                        />
                      </View>
                      <View>
                        <Text style={styles.modalText}>Route</Text>
                        <TextInput
                          style={styles.filterinput}
                          placeholder="route"
                          value={values.route}
                          onChangeText={text => {
                            setFieldValue('route', text);
                          }}
                          onBlur={handleBlur('route')}
                        />
                      </View>
                      <View>
                        <Text style={styles.modalText}>Schedule </Text>
                        <TextInput
                          style={styles.filterinput}
                          placeholder="schedule"
                          value={values.schedule}
                          onChangeText={text => {
                            setFieldValue('schedule', text);
                          }}
                          onBlur={handleBlur('schedule')}
                        />
                      </View>
                      <View>
                        <Text style={styles.modalText}>Days</Text>
                        <TextInput
                          style={styles.filterinput}
                          placeholder="Duration"
                          value={values.duration}
                          onChangeText={text => {
                            setFieldValue('duration', text);
                          }}
                          onBlur={handleBlur('duration')}
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
                              const formattedDate = selectedDate
                                .toISOString()
                                .split('T')[0];
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

                      {/* Days Field */}
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
      )}
    </>
  );
};

export default Treatment;

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
  sympContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sympText: {
    fontSize: 16,
    fontWeight: 'normal',
    flex: 0.9,
  },
  editIcon: {
    padding: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#05b508',
  },
});
