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
  fetchmedicines,
  FetchMobileOpdAssessmentForEditapi,
} from '../../api/api';
import {Formik} from 'formik';
import {Modal} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';

const Menstrualhistory = () => {
  const navigation = useNavigation();
  const formikRef = useRef(null);
  const {userData, selectedPatient} = useContext(UserContext);

  const [patientAssessmentArray, setPatientAssessmentArray] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [open, setOpen] = useState(false);

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

  const diseasesHandler = __data => {
    toggleModal();
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
      opdmenstrualhistoryarray: patientAssessmentArray,
      api_type: 'OPD-MENSTRUAL-HISTORY',

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
              'Menstrual History Added Successfully',
            );
          else Alert.alert('Error !!', 'Menstrual History Not Added');
        });
      } catch (error) {
        Alert.alert('Error !!', error);
      }
      navigation.replace('CreateRx');
    } else {
      Alert.alert('Warning !!', 'Add Menstrual History first');
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
            api_type: 'OPD-MENSTRUAL-HISTORY',
            uhid: selectedPatient?.patientuniqueno,
            mobilenumber: selectedPatient?.mobilenumber,
            appoint_id: selectedPatient?.appoint_id,
          })
          .then(res => {
            console.log('res : ', res.data);
            setPatientSympyomsArrayEdit(res.data.opdmenstrualhistoryarray);
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
          <Text style={styles.navbarText}>Menstrual History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <ScrollView
          style={{marginBottom: 70}}
          vertical
          showsVerticalScrollIndicator={false}>
          {/* Symptoms Section */}
          <View style={styles.categoryDiv}>
            <Text style={styles.categoryText}>Previous Menstrual Details</Text>
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
                      <TouchableOpacity onPress={() => navigation.navigate('Editmenstrualhistory', {data: item, userData, selectedPatient})}>
                        <FontAwesomeIcon
                          icon={faPencilSquare}
                          color="#05b508"
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.sympDivOuter} key={index + 1}>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Menarche Age</Text>
                        <Text>{item.menarche_age}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Lmp </Text>
                        <Text>{item.lmp}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Periods </Text>
                        <Text>{item.periods}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Durations </Text>
                        <Text>{item.durations}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Quality of Blood Flow </Text>
                        <Text>{item.qualityofbloodflow}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Pain during Cycle </Text>
                        <Text>{item.painduringcycle}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Menopause </Text>
                        <Text>{item.menopause}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Date / Time </Text>
                        <Text>
                          {item.from_date} / {item.opd_time}
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
            <Text style={styles.categoryText}>Menstrual Details</Text>
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
                        <Text style={styles.label}>Menarche Age</Text>
                        <Text>{item.menarche_age}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Lmp </Text>
                        <Text>{item.lmp}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Periods </Text>
                        <Text>{item.periods}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Durations </Text>
                        <Text>{item.durations}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Quality of Blood Flow </Text>
                        <Text>{item.qualityofbloodflow}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Pain during Cycle </Text>
                        <Text>{item.painduringcycle}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Menopause </Text>
                        <Text>{item.menopause}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Date / Time </Text>
                        <Text>
                          {item.from_date} / {item.opd_time}
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
                Add Menstrual
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
                menarche_age: '',
                lmp: '',
                periods: '',
                durations: '',
                qualityofbloodflow: '',
                menopause: '',
                menopause: '',
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
                setFieldValue,
              }) => {
                return (
                  <>
                    <View style={styles.modalDiv}>
                      {/* Dose Field */}
                      <View>
                        <Text style={styles.modalText}> Menarche Age</Text>
                        <TextInput
                          style={styles.filterinput}
                          placeholder="Menarche Age"
                          value={values.menarche_age}
                          onChangeText={text => {
                            setFieldValue('menarche_age', text);
                          }}
                          onBlur={handleBlur('menarche_age')}
                        />
                      </View>

                      {/* Route Field */}
                      <View>
                        <Text style={styles.modalText}>Lmp</Text>
                        <TextInput
                          style={styles.filterinput}
                          placeholder="Lmp"
                          value={values.lmp}
                          onChangeText={text => {
                            setFieldValue('lmp', text);
                          }}
                          onBlur={handleBlur('lmp')}
                        />
                      </View>

                      {/* Schedule Field */}
                      <View>
                        <Text style={styles.modalText}>Periods</Text>
                        <View
                          style={[
                            styles.segDiv,
                            {flexDirection: 'row', gap: 12},
                          ]}>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.periods === 'Regular' &&
                                styles.selectedButton,
                            ]}
                            onPress={() => setFieldValue('periods', 'Regular')}>
                            <Text style={styles.segText}>Regular</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.periods === 'Irregular' &&
                                styles.selectedButton,
                            ]}
                            onPress={() =>
                              setFieldValue('periods', 'Irregular')
                            }>
                            <Text style={styles.segText}>Irregular</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Years Field */}
                      <View>
                        <Text style={styles.modalText}>Durations </Text>
                        <TextInput
                          style={styles.filterinput}
                          placeholder="Durations "
                          value={values.durations}
                          onChangeText={text => {
                            setFieldValue('durations', text);
                          }}
                          onBlur={handleBlur('durations')}
                        />
                      </View>

                      <View>
                        <Text style={styles.modalText}>
                          {' '}
                          Quality of Blood Flow
                        </Text>
                        <View
                          style={[
                            styles.segDiv,
                            {flexDirection: 'row', gap: 12},
                          ]}>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.qualityofbloodflow === 'Scanty' &&
                                styles.selectedButton,
                            ]}
                            onPress={() =>
                              setFieldValue('qualityofbloodflow', 'Scanty')
                            }>
                            <Text style={styles.segText}>Scanty</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.qualityofbloodflow === 'Mod' &&
                                styles.selectedButton,
                            ]}
                            onPress={() =>
                              setFieldValue('qualityofbloodflow', 'Mod')
                            }>
                            <Text style={styles.segText}>Mod</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.qualityofbloodflow === 'Heavy' &&
                                styles.selectedButton,
                            ]}
                            onPress={() =>
                              setFieldValue('qualityofbloodflow', 'Heavy')
                            }>
                            <Text style={styles.segText}>Heavy</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View>
                        <Text style={styles.modalText}>Pain during Cycle</Text>
                        <View
                          style={[
                            styles.segDiv,
                            {flexDirection: 'row', gap: 12},
                          ]}>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.painduringcycle === 'yes' &&
                                styles.selectedButton,
                            ]}
                            onPress={() =>
                              setFieldValue('painduringcycle', 'yes')
                            }>
                            <Text style={styles.segText}>Yes</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.painduringcycle === 'no' &&
                                styles.selectedButton,
                            ]}
                            onPress={() =>
                              setFieldValue('painduringcycle', 'no')
                            }>
                            <Text style={styles.segText}>No</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View>
                        <Text style={styles.modalText}>Menopause</Text>
                        <TextInput
                          style={styles.filterinput}
                          placeholder="Menopause"
                          value={values.menopause}
                          onChangeText={text => {
                            setFieldValue('menopause', text);
                          }}
                          onBlur={handleBlur('menopause')}
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

export default Menstrualhistory;

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
    padding: 5,
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
