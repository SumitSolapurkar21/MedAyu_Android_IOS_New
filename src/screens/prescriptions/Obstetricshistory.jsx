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

const Obstetricshistory = () => {
  const navigation = useNavigation();
  const formikRef = useRef(null);
  const {userData, selectedPatient} = useContext(UserContext);

  // array state ...
  const [patientAssessmentArray, setPatientAssessmentArray] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);

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
      opdobstetricshistoryarray: patientAssessmentArray,
      api_type: 'OPD-OBSTETRICS-HISTORY',

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
              'Obstetrics History Added Successfully',
            );
          else Alert.alert('Error !!', 'Obstetrics History Not Added');
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
              api_type: 'OPD-OBSTETRICS-HISTORY',
              uhid: selectedPatient?.patientuniqueno,
              mobilenumber: selectedPatient?.mobilenumber,
              appoint_id: selectedPatient?.appoint_id,
            })
            .then(res => {
              console.log('res : ', res.data);
              setPatientSympyomsArrayEdit(res.data.opdobstetricshistoryarray);
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
          <Text style={styles.navbarText}>Obstetrics History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <ScrollView
          style={{marginBottom: 70}}
          vertical
          showsVerticalScrollIndicator={false}>
          {/* Symptoms Section */}
          <View style={styles.categoryDiv}>
            <Text style={styles.categoryText}>Previous Obstetrics Details</Text>
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
                        onPress={() =>
                          navigation.navigate('Editobstetricshistory', {
                            data: item,
                            userData,
                            selectedPatient,
                          })
                        }>
                        <FontAwesomeIcon
                          icon={faPencilSquare}
                          color="#05b508"
                          style={styles.icon}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.sympDivOuter} key={index + 1}>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>G / P / L / A / D</Text>
                        <Text>
                          {item.g} / {item.p} / {item.l} / {item.a} / {item.d}{' '}
                        </Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Pregnant</Text>
                        <Text>{item.pregnant}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Breast Feeding</Text>
                        <Text>{item.breastFeeding}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Planing to Conceive</Text>
                        <Text>{item.conception}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Contraception</Text>
                        <Text>
                          {item.contraception === 'no'
                            ? item.contraception
                            : item.contraception +
                              ' - ' +
                              item.pillsChecked +
                              ' , ' +
                              item.injuctionChecked +
                              ' , ' +
                              item.otherChecked}
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
            <Text style={styles.categoryText}>Obstetrics Details</Text>
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
                        <Text style={styles.label}>G / P / L / A / D</Text>
                        <Text>
                          {item.g} / {item.p} / {item.l} / {item.a} / {item.d}{' '}
                        </Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Pregnant</Text>
                        <Text>{item.pregnant}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Breast Feeding</Text>
                        <Text>{item.breastFeeding}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Planing to Conceive</Text>
                        <Text>{item.conception}</Text>
                      </View>
                      <View style={styles.sympDivInner}>
                        <Text style={styles.label}>Contraception</Text>
                        <Text>
                          {item.contraception === 'no'
                            ? item.contraception
                            : item.contraception +
                              ' - ' +
                              item.pillsChecked +
                              ' , ' +
                              item.injuctionChecked +
                              ' , ' +
                              item.otherChecked}
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
          <TouchableOpacity style={[styles.addbuttonDiv]} onPress={toggleModal}>
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
                Add Obstetrics
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
                g: '',
                p: '',
                l: '',
                a: '',
                d: '',
                pregnant: '',
                breastFeeding: '',
                conception: '',
                contraception: '',
                pillsChecked: '',
                injuctionChecked: '',
                otherChecked: '',
              }}
              onSubmit={(values, {resetForm}) => {
                toggleModal();
                setPatientAssessmentArray(prevData => [...prevData, values]);
                resetForm();
              }}>
              {({handleBlur, handleSubmit, values, setFieldValue}) => {
                return (
                  <>
                    <View style={styles.modalDiv}>
                      {/* Dose Field */}
                      <View>
                        <Text style={styles.modalText}>G</Text>
                        <TextInput
                          style={styles.filterinput}
                          placeholder="G"
                          value={values.g}
                          onChangeText={text => {
                            setFieldValue('g', text);
                          }}
                          onBlur={handleBlur('g')}
                        />
                      </View>

                      {/* Route Field */}
                      <View>
                        <Text style={styles.modalText}>P</Text>
                        <TextInput
                          style={styles.filterinput}
                          placeholder="P"
                          value={values.p}
                          onChangeText={text => {
                            setFieldValue('p', text);
                          }}
                          onBlur={handleBlur('p')}
                        />
                      </View>

                      {/* Schedule Field */}
                      <View>
                        <Text style={styles.modalText}>L</Text>
                        <TextInput
                          style={styles.filterinput}
                          placeholder="L"
                          value={values.l}
                          onChangeText={text => {
                            setFieldValue('l', text);
                          }}
                          onBlur={handleBlur('l')}
                        />
                      </View>

                      {/* Years Field */}
                      <View>
                        <Text style={styles.modalText}>A</Text>
                        <TextInput
                          style={styles.filterinput}
                          placeholder="A"
                          value={values.years}
                          onChangeText={text => {
                            setFieldValue('a', text);
                          }}
                          onBlur={handleBlur('a')}
                        />
                      </View>

                      {/* Months Field */}
                      <View>
                        <Text style={styles.modalText}>D</Text>
                        <TextInput
                          style={styles.filterinput}
                          placeholder="D"
                          value={values.d}
                          onChangeText={text => {
                            setFieldValue('d', text);
                          }}
                          onBlur={handleBlur('d')}
                        />
                      </View>

                      {/* Pragnent Field */}
                      <View>
                        <Text style={styles.modalText}>Pragnent</Text>
                        <View
                          style={[
                            styles.segDiv,
                            {flexDirection: 'row', gap: 12},
                          ]}>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.pregnant === 'yes' &&
                                styles.selectedButton,
                            ]}
                            onPress={() => setFieldValue('pregnant', 'yes')}>
                            <Text style={styles.segText}>Yes</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.pregnant === 'no' && styles.selectedButton,
                            ]}
                            onPress={() => setFieldValue('pregnant', 'no')}>
                            <Text style={styles.segText}>No</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View>
                        <Text style={styles.modalText}>Breast Feeding</Text>
                        <View
                          style={[
                            styles.segDiv,
                            {flexDirection: 'row', gap: 12},
                          ]}>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.breastFeeding === 'yes' &&
                                styles.selectedButton,
                            ]}
                            onPress={() =>
                              setFieldValue('breastFeeding', 'yes')
                            }>
                            <Text style={styles.segText}>Yes</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.breastFeeding === 'no' &&
                                styles.selectedButton,
                            ]}
                            onPress={() =>
                              setFieldValue('breastFeeding', 'no')
                            }>
                            <Text style={styles.segText}>No</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View>
                        <Text style={styles.modalText}>
                          Planing to Conceive
                        </Text>
                        <View
                          style={[
                            styles.segDiv,
                            {flexDirection: 'row', gap: 12},
                          ]}>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.conception === 'yes' &&
                                styles.selectedButton,
                            ]}
                            onPress={() => setFieldValue('conception', 'yes')}>
                            <Text style={styles.segText}>Yes</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.conception === 'no' &&
                                styles.selectedButton,
                            ]}
                            onPress={() => setFieldValue('conception', 'no')}>
                            <Text style={styles.segText}>No</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View>
                        <Text style={styles.modalText}>Contraception</Text>
                        <View
                          style={[
                            styles.segDiv,
                            {flexDirection: 'row', gap: 12},
                          ]}>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.contraception === 'yes' &&
                                styles.selectedButton,
                            ]}
                            onPress={() =>
                              setFieldValue('contraception', 'yes')
                            }>
                            <Text style={styles.segText}>Yes</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.contraception === 'no' &&
                                styles.selectedButton,
                            ]}
                            onPress={() =>
                              setFieldValue('contraception', 'no')
                            }>
                            <Text style={styles.segText}>No</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      {values.contraception === 'yes' && (
                        <View
                          style={[
                            styles.segDiv,
                            {flexDirection: 'row', gap: 12},
                          ]}>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.pillsChecked === 'Pills' &&
                                styles.selectedButton,
                            ]}
                            onPress={() =>
                              setFieldValue('pillsChecked', 'Pills')
                            }>
                            <Text style={styles.segText}>Pills</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.injuctionChecked === 'Injection' &&
                                styles.selectedButton,
                            ]}
                            onPress={() =>
                              setFieldValue('injuctionChecked', 'Injection')
                            }>
                            <Text style={styles.segText}>Injection</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.otherChecked === 'Other' &&
                                styles.selectedButton,
                            ]}
                            onPress={() =>
                              setFieldValue('otherChecked', 'Other')
                            }>
                            <Text style={styles.segText}>Other</Text>
                          </TouchableOpacity>
                        </View>
                      )}
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

export default Obstetricshistory;

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
    minWidth: 60,
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
