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
  faPencil,
  faPencilSquare,
  faPlus,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import UserContext from '../../functions/usercontext';
import axios from 'axios';
import {Formik} from 'formik';
import {Modal} from 'react-native-paper';
import {
  addopdassessment,
  FetchMobileOpdAssessmentForEditapi,
} from '../../api/api';

const Generalexamination = () => {
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
      opdgeneralexaminationhistoryarray: patientAssessmentArray,
      api_type: 'OPD-GENERAL-EXAMINATION',

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
              'General Examination Added Successfully',
            );
          else Alert.alert('Error !!', 'General Examination Not Added');
        });
      } catch (error) {
        Alert.alert('Error !!', error);
      }
      navigation.replace('CreateRx');
    } else {
      Alert.alert('Warning !!', 'Add Examination first');
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
              api_type: 'OPD-GENERAL-EXAMINATION',
              uhid: selectedPatient?.patientuniqueno,
              mobilenumber: selectedPatient?.mobilenumber,
              appoint_id: selectedPatient?.appoint_id,
            })
            .then(res => {
              console.log('res : ', res.data);
              setPatientSympyomsArrayEdit(
                res.data.opdgeneralexaminationhistoryarray,
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
          <Text style={styles.navbarText}>General Examination</Text>
        </TouchableOpacity>
      </View>

      {!isModalVisible ? (
        <View style={styles.container}>
          <ScrollView
            style={{marginBottom: 70}}
            vertical
            showsVerticalScrollIndicator={false}>
            {/* Symptoms Section */}
            <View style={styles.categoryDiv}>
              <Text style={styles.categoryText}>Previous General Details</Text>
              {patientSympyomsArrayEdit?.length > 0 ? (
                patientSympyomsArrayEdit?.map((item, index) => {
                  return (
                    <View
                      style={[styles.sympDiv, styles.sympContainer]}
                      key={index + 1}>
                      <Text style={styles.sympText}>
                        {item.pallor} {item.cyanosis} {item.icterus} {item.ln}{' '}
                        {item.odema}
                      </Text>
                      <TouchableOpacity
                        style={styles.editIcon}
                        onPress={() =>
                          navigation.navigate('Editgeneralexamination', {
                            data: item,
                            userData,
                            selectedPatient,
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
              <Text style={styles.categoryText}>General Details</Text>
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
                          <Text style={styles.label}>Pallor</Text>
                          <Text>{item.pallor}</Text>
                        </View>
                        <View style={styles.sympDivInner}>
                          <Text style={styles.label}>Cyanosis</Text>
                          <Text>{item.cyanosis}</Text>
                        </View>
                        <View style={styles.sympDivInner}>
                          <Text style={styles.label}>Icterus</Text>
                          <Text>{item.icterus}</Text>
                        </View>
                        <View style={styles.sympDivInner}>
                          <Text style={styles.label}>Ln</Text>
                          <Text>{item.ln}</Text>
                        </View>
                        <View style={styles.sympDivInner}>
                          <Text style={styles.label}>Odema</Text>
                          <Text>{item.odema}</Text>
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
              onPress={toggleModal}>
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
        </View>
      ) : (
        <View
          visible={isModalVisible}
          onDismiss={toggleModal}
          contentContainerStyle={styles.bottomModalContainer}>
          <View style={{padding: 20}}>
            <View style={styles.modalContentHeader}>
              <Text style={[styles.modalText, {marginBottom: 0, fontSize: 18}]}>
                Add General Examination
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
                pallor: '',
                cyanosis: '',
                icterus: '',
                ln: '',
                odema: '',
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
                        <Text style={styles.modalText}>Pallor</Text>
                        <View
                          style={[
                            styles.segDiv,
                            {flexDirection: 'row', gap: 6},
                          ]}>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.pallor === 'present' &&
                                styles.selectedButton,
                            ]}
                            onPress={() => setFieldValue('pallor', 'present')}>
                            <Text style={styles.segText}>Present</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.pallor === 'absent' &&
                                styles.selectedButton,
                            ]}
                            onPress={() => setFieldValue('pallor', 'absent')}>
                            <Text style={styles.segText}>Absent</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View>
                        <Text style={styles.modalText}>Cyanosis</Text>
                        <View
                          style={[
                            styles.segDiv,
                            {flexDirection: 'row', gap: 6},
                          ]}>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.cyanosis === 'Present' &&
                                styles.selectedButton,
                            ]}
                            onPress={() =>
                              setFieldValue('cyanosis', 'Present')
                            }>
                            <Text style={styles.segText}>Present</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.cyanosis === 'absent' &&
                                styles.selectedButton,
                            ]}
                            onPress={() => setFieldValue('cyanosis', 'absent')}>
                            <Text style={styles.segText}>Absent</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View>
                        <Text style={styles.modalText}>Icterus</Text>
                        <View
                          style={[
                            styles.segDiv,
                            {flexDirection: 'row', gap: 6},
                          ]}>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.icterus === 'present' &&
                                styles.selectedButton,
                            ]}
                            onPress={() => setFieldValue('icterus', 'present')}>
                            <Text style={styles.segText}>Present</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.icterus === 'absent' &&
                                styles.selectedButton,
                            ]}
                            onPress={() => setFieldValue('icterus', 'absent')}>
                            <Text style={styles.segText}>Absent</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View>
                        <Text style={styles.modalText}>Ln</Text>
                        <View
                          style={[
                            styles.segDiv,
                            {flexDirection: 'row', gap: 6},
                          ]}>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.ln === 'present' && styles.selectedButton,
                            ]}
                            onPress={() => setFieldValue('ln', 'present')}>
                            <Text style={styles.segText}>Present</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.ln === 'absent' && styles.selectedButton,
                            ]}
                            onPress={() => setFieldValue('ln', 'absent')}>
                            <Text style={styles.segText}>Absent</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View>
                        <Text style={styles.modalText}>Odema</Text>
                        <View
                          style={[
                            styles.segDiv,
                            {flexDirection: 'row', gap: 6},
                          ]}>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.odema === 'present' &&
                                styles.selectedButton,
                            ]}
                            onPress={() => setFieldValue('odema', 'present')}>
                            <Text style={styles.segText}>Present</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.segButton,
                              values.odema === 'absent' &&
                                styles.selectedButton,
                            ]}
                            onPress={() => setFieldValue('odema', 'absent')}>
                            <Text style={styles.segText}>Absent</Text>
                          </TouchableOpacity>
                        </View>
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
      )}
    </>
  );
};

export default Generalexamination;

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
    backgroundColor: '#f7f7fc',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    width: '100%',
    flex: 1,
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
    gap: 12,
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
