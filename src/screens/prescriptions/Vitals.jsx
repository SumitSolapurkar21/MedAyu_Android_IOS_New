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
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  faArrowLeft,
  faChevronUp,
  faPencilSquare,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons/faChevronDown';
import {Dropdown} from 'react-native-element-dropdown';
import {Formik} from 'formik';
import {useRef} from 'react';
import UserContext from '../../functions/usercontext';
import axios from 'axios';
import {
  addopdassessment,
  FetchMobileOpdAssessmentForEditapi,
} from '../../api/api';

const Vitals = () => {
  // ref and navigation ....
  const navigation = useNavigation();
  const formikRef = useRef(null);

  // context ...
  const {userData, selectedPatient} = useContext(UserContext);

  // states ...
  const [collaspeVitals, setCollaspeVitals] = useState(false);
  const [collaspeGlyaemic, setCollaspeGlyaemic] = useState(false);
  const [statusColorMild, setStatusColorMild] = useState('');
  const [statusColorMildModerate, setStatusColorMildModerate] = useState('');
  const [statusColorMildSevere, setStatusColorMildSevere] = useState('');

  const [patientSympyomsArrayEdit, setPatientSympyomsArrayEdit] = useState([]);

  // system back button ...
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

  let relationEyeOpening = [
    {
      label: 'Spontaneous',
      value: '4',
    },
    {
      label: 'To sound',
      value: '3',
    },
    {
      label: 'To pressure',
      value: '2',
    },
    {
      label: 'None',
      value: '1',
    },
  ];

  let relationVerbalResp = [
    {
      label: 'Orientated',
      value: '5',
    },
    {
      label: 'Confused',
      value: '4',
    },
    {
      label: 'Words',
      value: '3',
    },
    {
      label: 'Sounds',
      value: '2',
    },
    {
      label: 'None',
      value: '1',
    },
  ];

  let relationMotorResp = [
    {
      label: 'Obey commands',
      value: '6',
    },
    {
      label: 'Localising',
      value: '5',
    },
    {
      label: 'Normal flexion',
      value: '4',
    },
    {
      label: 'Abnormal flexion',
      value: '3',
    },
    {
      label: 'Extension',
      value: '2',
    },
    {
      label: 'None',
      value: '1',
    },
  ];

  // validate input range ...
  const validateInputRange = (value, min, max) => {
    const numericValue = parseFloat(value);
    return !isNaN(numericValue) && numericValue >= min && numericValue <= max;
  };

  // form submit handler ....
  const onSubmitHandler = async (values, {resetForm}) => {
    try {
      await axios
        .post(addopdassessment, {
          reception_id: userData?._id,
          hospital_id: userData?.hospital_id,
          uhid: selectedPatient?.patientuniqueno,
          mobilenumber: selectedPatient?.mobilenumber,
          patient_id: selectedPatient?.patient_id,
          appoint_id: selectedPatient?.appoint_id,
          opdvitalshistoryarray: [values],
          api_type: 'OPD-VITALS',
        })
        .then(res => {
          const {message, status} = res.data;
          if (status)
            return (
              Alert.alert('Success !!', message),
              resetForm(),
              navigation.replace('CreateRx')
            );
          else return Alert.alert('Error !!', message);
        })
        .catch(error => {
          Alert.alert('Error !!', error);
        });
    } catch (error) {
      Alert.alert('Error !!', error);
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
            api_type: 'OPD-VITALS',
            uhid: selectedPatient?.patientuniqueno,
            mobilenumber: selectedPatient?.mobilenumber,
            appoint_id: selectedPatient?.appoint_id,
          })
          .then(res => {
            console.log('res : ', res.data);
            setPatientSympyomsArrayEdit(res.data.opdvitalshistoryarray);
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
      {/* Status Bar */}
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
        <TouchableOpacity style={styles.navbarGrp}>
          <Text style={styles.navbarText}>Vitals</Text>
        </TouchableOpacity>
      </View>

      {/* section */}
      <View style={styles.container}>
        <ScrollView vertical style={{marginBottom: 100}}>
          <Formik
            innerRef={formikRef}
            initialValues={{
              p_temp: '',
              p_pulse: '',
              p_spo2: '',
              p_systolicbp: '',
              p_diastolicbp: '',
              p_rsprate: '',
              motorResponse: '',
              verbalResponse: '',
              eyeopening: '',
            }}
            validate={values => {
              const errors = {};
              let isValidInput = true;

              if (!validateInputRange(values.p_temp, 90, 110)) {
                errors.p_temp = 'Temperature Not in Range';
                isValidInput = false;
              }

              if (!validateInputRange(values.p_pulse, 20, 300)) {
                errors.p_pulse = 'Pulse Not in Range';
                isValidInput = false;
              }

              if (!validateInputRange(values.p_spo2, 30, 100)) {
                errors.p_spo2 = 'SPO2 Not in Range';
                isValidInput = false;
              }

              if (!validateInputRange(values.p_systolicbp, 30, 240)) {
                errors.p_systolicbp = 'Systolic BP Not in Range';
                isValidInput = false;
              }

              if (!validateInputRange(values.p_diastolicbp, 10, 200)) {
                errors.p_diastolicbp = 'Diastolic BP Not in Range';
                isValidInput = false;
              }

              if (!validateInputRange(values.p_rsprate, 5, 50)) {
                errors.p_rsprate = 'Resp.Rate Not in Range';
                isValidInput = false;
              }
              if (!validateInputRange(values.eyeopening, 1, 4)) {
                errors.eyeopening = 'EyeOpening Range 1-4';
                isValidInput = false;
              }
              if (!validateInputRange(values.verbalResponse, 1, 5)) {
                errors.verbalResponse = 'Verbal Range 1-5';
                isValidInput = false;
              }
              if (!validateInputRange(values.motorResponse, 1, 6)) {
                errors.motorResponse = 'Motor Range 1-6';
                isValidInput = false;
              }
              return errors;
            }}
            onSubmit={onSubmitHandler}>
            {({
              handleChange,
              handleBlur,
              values,
              errors,
              touched,
              setFieldValue,
            }) => {
              // Correct useEffect hook to access form values properly
              useEffect(() => {
                // Calculate scoreCount correctly
                const scoreCount =
                  parseFloat(values.eyeopening || 0) +
                  parseFloat(values.verbalResponse || 0) +
                  parseFloat(values.motorResponse || 0);
                if (scoreCount >= 13) {
                  setStatusColorMild('green');
                  setStatusColorMildModerate('white');
                  setStatusColorMildSevere('white');
                } else if (scoreCount >= 9 && scoreCount <= 12) {
                  setStatusColorMildModerate('yellow');
                  setStatusColorMild('white');
                  setStatusColorMildSevere('white');
                } else if (scoreCount >= 3 && scoreCount <= 8) {
                  setStatusColorMildSevere('red');
                  setStatusColorMildModerate('white');
                  setStatusColorMild('white');
                }
              }, [
                values.eyeopening,
                values.verbalResponse,
                values.motorResponse,
              ]);

              return (
                <>
                  {/* section 1 */}
                  <View style={styles.section}>
                    <TouchableOpacity
                      style={styles.sectionHeader}
                      onPress={() => setCollaspeVitals(!collaspeVitals)}>
                      <Text style={styles.title}>Basic Vitals</Text>
                      <FontAwesomeIcon
                        icon={collaspeVitals ? faChevronUp : faChevronDown}
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                    {collaspeVitals && (
                      <>
                        <View style={styles.vitalsContent}>
                          <View style={styles.vitalsContentOuter}>
                            <Text style={styles.vitalsTitle}>TEMP</Text>
                            <View style={styles.vitalsContentDiv}>
                              <View style={styles.vitalsContentDivInner}>
                                <TextInput
                                  style={styles.input}
                                  keyboardType="numeric"
                                  name="p_temp"
                                  onChangeText={handleChange('p_temp')}
                                  onBlur={handleBlur('p_temp')}
                                  value={values.p_temp}
                                />
                              </View>
                              <View style={styles.vitalsContentTextInner}>
                                <Text style={styles.text}>°F</Text>
                              </View>
                            </View>
                            {errors.p_temp && touched.p_temp && (
                              <Text style={{color: 'red'}}>
                                {errors.p_temp}
                              </Text>
                            )}
                          </View>
                          <View style={styles.vitalsContentOuter}>
                            <Text style={styles.vitalsTitle}>PULSE</Text>
                            <View style={styles.vitalsContentDiv}>
                              <View style={styles.vitalsContentDivInner}>
                                <TextInput
                                  style={styles.input}
                                  keyboardType="numeric"
                                  name="p_pulse"
                                  onChangeText={handleChange('p_pulse')}
                                  onBlur={handleBlur('p_pulse')}
                                  value={values.p_pulse}
                                />
                              </View>
                              <View style={styles.vitalsContentTextInner}>
                                <Text style={styles.text}>/ min</Text>
                              </View>
                            </View>
                            {errors.p_pulse && touched.p_pulse && (
                              <Text style={{color: 'red'}}>
                                {errors.p_pulse}
                              </Text>
                            )}
                          </View>
                          <View style={styles.vitalsContentOuter}>
                            <Text style={styles.vitalsTitle}>SPO2</Text>
                            <View style={styles.vitalsContentDiv}>
                              <View style={styles.vitalsContentDivInner}>
                                <TextInput
                                  style={styles.input}
                                  keyboardType="numeric"
                                  name="p_spo2"
                                  onChangeText={handleChange('p_spo2')}
                                  onBlur={handleBlur('p_spo2')}
                                  value={values.p_spo2}
                                />
                              </View>
                              <View style={styles.vitalsContentTextInner}>
                                <Text style={styles.text}>%</Text>
                              </View>
                            </View>
                            {errors.p_spo2 && touched.p_spo2 && (
                              <Text style={{color: 'red'}}>
                                {errors.p_spo2}
                              </Text>
                            )}
                          </View>
                          <View style={styles.vitalsContentOuter}>
                            <Text style={styles.vitalsTitle}>SYSTOLIC BP</Text>
                            <View style={styles.vitalsContentDiv}>
                              <View style={styles.vitalsContentDivInner}>
                                <TextInput
                                  style={styles.input}
                                  keyboardType="numeric"
                                  name="p_systolicbp"
                                  onChangeText={handleChange('p_systolicbp')}
                                  onBlur={handleBlur('p_systolicbp')}
                                  value={values.p_systolicbp}
                                />
                              </View>
                              <View style={styles.vitalsContentTextInner}>
                                <Text style={styles.text}>mmHg</Text>
                              </View>
                            </View>
                            {errors.p_systolicbp && touched.p_systolicbp && (
                              <Text style={{color: 'red'}}>
                                {errors.p_systolicbp}
                              </Text>
                            )}
                          </View>
                          <View style={styles.vitalsContentOuter}>
                            <Text style={styles.vitalsTitle}>DIASTOLIC BP</Text>
                            <View style={styles.vitalsContentDiv}>
                              <View style={styles.vitalsContentDivInner}>
                                <TextInput
                                  style={styles.input}
                                  keyboardType="numeric"
                                  name="p_diastolicbp"
                                  onChangeText={handleChange('p_diastolicbp')}
                                  onBlur={handleBlur('p_diastolicbp')}
                                  value={values.p_diastolicbp}
                                />
                              </View>
                              <View style={styles.vitalsContentTextInner}>
                                <Text style={styles.text}>mmHg</Text>
                              </View>
                            </View>
                            {errors.p_diastolicbp && touched.p_diastolicbp && (
                              <Text style={{color: 'red'}}>
                                {errors.p_diastolicbp}
                              </Text>
                            )}
                          </View>
                          <View style={styles.vitalsContentOuter}>
                            <Text style={styles.vitalsTitle}>RESP. Rate</Text>
                            <View style={styles.vitalsContentDiv}>
                              <View style={styles.vitalsContentDivInner}>
                                <TextInput
                                  style={styles.input}
                                  keyboardType="numeric"
                                  name="p_rsprate"
                                  onChangeText={handleChange('p_rsprate')}
                                  onBlur={handleBlur('p_rsprate')}
                                  value={values.p_rsprate}
                                />
                              </View>
                              <View style={styles.vitalsContentTextInner}>
                                <Text style={styles.text}>/ min</Text>
                              </View>
                            </View>
                            {errors.p_rsprate && touched.p_rsprate && (
                              <Text style={{color: 'red'}}>
                                {errors.p_rsprate}
                              </Text>
                            )}
                          </View>
                        </View>
                      </>
                    )}
                  </View>

                  {/* section 2 */}
                  <View style={styles.section}>
                    <TouchableOpacity
                      style={styles.sectionHeader}
                      onPress={() => setCollaspeGlyaemic(!collaspeGlyaemic)}>
                      <Text style={styles.title}>Glasgow Coma Scale</Text>
                      <FontAwesomeIcon
                        icon={collaspeGlyaemic ? faChevronUp : faChevronDown}
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                    {collaspeGlyaemic && (
                      <>
                        <View style={styles.vitalsContent}>
                          <View
                            style={[styles.vitalsContentOuter, {width: '32%'}]}>
                            <Text style={styles.vitalsTitle}>EYE OPENING</Text>
                            <View style={styles.vitalsContentDiv}>
                              <View style={styles.vitalsContentDivInner}>
                                <TextInput
                                  style={styles.input}
                                  keyboardType="numeric"
                                  name="eyeopening"
                                  onChangeText={handleChange('eyeopening')}
                                  onBlur={handleBlur('eyeopening')}
                                  value={values.eyeopening}
                                />
                              </View>
                            </View>
                            {errors.eyeopening && touched.eyeopening && (
                              <Text style={{color: 'red'}}>
                                {errors.eyeopening}
                              </Text>
                            )}
                          </View>
                          <View
                            style={[styles.vitalsContentOuter, {width: '32%'}]}>
                            <Text style={styles.vitalsTitle}>VERBAL RESP</Text>
                            <View style={styles.vitalsContentDiv}>
                              <View style={styles.vitalsContentDivInner}>
                                <TextInput
                                  style={styles.input}
                                  keyboardType="numeric"
                                  name="verbalResponse"
                                  onChangeText={handleChange('verbalResponse')}
                                  onBlur={handleBlur('verbalResponse')}
                                  value={values.verbalResponse}
                                />
                              </View>
                            </View>
                            {errors.verbalResponse &&
                              touched.verbalResponse && (
                                <Text style={{color: 'red'}}>
                                  {errors.verbalResponse}
                                </Text>
                              )}
                          </View>
                          <View
                            style={[styles.vitalsContentOuter, {width: '32%'}]}>
                            <Text style={styles.vitalsTitle}>MOTOR RESP</Text>
                            <View style={styles.vitalsContentDiv}>
                              <View style={styles.vitalsContentDivInner}>
                                <TextInput
                                  style={styles.input}
                                  keyboardType="numeric"
                                  name="motorResponse"
                                  onChangeText={handleChange('motorResponse')}
                                  onBlur={handleBlur('motorResponse')}
                                  value={values.motorResponse}
                                />
                              </View>
                            </View>
                            {errors.motorResponse && touched.motorResponse && (
                              <Text style={{color: 'red'}}>
                                {errors.motorResponse}
                              </Text>
                            )}
                          </View>
                        </View>
                        <View style={styles.vitalsContent}>
                          <View style={[styles.vitalsContentOuter]}>
                            <Text style={styles.vitalsTitle}>EYE OPENING</Text>
                            <Dropdown
                              style={[styles.dropdown]}
                              placeholderStyle={styles.placeholderStyle}
                              selectedTextStyle={styles.selectedTextStyle}
                              inputSearchStyle={styles.inputSearchStyle}
                              iconStyle={styles.iconStyle}
                              data={relationEyeOpening?.map(res => ({
                                label: res.label,
                                value: res.value,
                              }))}
                              maxHeight={300}
                              labelField="label"
                              valueField="value"
                              placeholder="Select"
                              value={values.eyeopening}
                              onChange={item => {
                                setFieldValue('eyeopening', item.value);
                              }}
                            />
                            {errors.eyeopening && touched.eyeopening && (
                              <Text style={{color: 'red'}}>
                                {errors.eyeopening}
                              </Text>
                            )}
                          </View>
                          <View style={[styles.vitalsContentOuter]}>
                            <Text style={styles.vitalsTitle}>
                              MOTOR RESPONSE
                            </Text>
                            <Dropdown
                              style={[styles.dropdown]}
                              placeholderStyle={styles.placeholderStyle}
                              selectedTextStyle={styles.selectedTextStyle}
                              inputSearchStyle={styles.inputSearchStyle}
                              iconStyle={styles.iconStyle}
                              data={relationMotorResp?.map(res => ({
                                label: res.label,
                                value: res.value,
                              }))}
                              maxHeight={300}
                              labelField="label"
                              valueField="value"
                              placeholder="Select"
                              value={values.motorResponse}
                              onChange={item => {
                                setFieldValue('motorResponse', item.value);
                              }}
                            />
                            {errors.motorResponse && touched.motorResponse && (
                              <Text style={{color: 'red'}}>
                                {errors.motorResponse}
                              </Text>
                            )}
                          </View>
                          <View style={[styles.vitalsContentOuter]}>
                            <Text style={styles.vitalsTitle}>
                              VERBAL RESPONSE
                            </Text>
                            <Dropdown
                              style={[styles.dropdown]}
                              placeholderStyle={styles.placeholderStyle}
                              selectedTextStyle={styles.selectedTextStyle}
                              inputSearchStyle={styles.inputSearchStyle}
                              iconStyle={styles.iconStyle}
                              data={relationVerbalResp?.map(res => ({
                                label: res.label,
                                value: res.value,
                              }))}
                              maxHeight={300}
                              labelField="label"
                              valueField="value"
                              placeholder="Select"
                              value={values.verbalResponse}
                              onChange={item => {
                                setFieldValue('verbalResponse', item.value);
                              }}
                            />
                            {errors.verbalResponse &&
                              touched.verbalResponse && (
                                <Text style={{color: 'red'}}>
                                  {errors.verbalResponse}
                                </Text>
                              )}
                          </View>
                        </View>
                        <View>
                          <Text style={styles.title}>
                            Glasgow Coma Scale Score
                          </Text>
                          <View style={styles.statusDivSection}>
                            <View
                              style={[
                                styles.statusDiv,
                                {
                                  backgroundColor: statusColorMild
                                    ? statusColorMild
                                    : '#ffffff',
                                },
                              ]}>
                              <Text style={styles.gcsStatusTxt}>Mild</Text>
                              <Text style={styles.gcsStatusTxt}>13-15</Text>
                            </View>
                            <View
                              style={[
                                styles.statusDiv,
                                {
                                  backgroundColor: statusColorMildModerate
                                    ? statusColorMildModerate
                                    : '#ffffff',
                                },
                              ]}>
                              <Text style={styles.gcsStatusTxt}>Moderate</Text>
                              <Text style={styles.gcsStatusTxt}>9-12</Text>
                            </View>
                            <View
                              style={[
                                styles.statusDiv,
                                {
                                  backgroundColor: statusColorMildSevere
                                    ? statusColorMildSevere
                                    : '#ffffff',
                                },
                              ]}>
                              <Text style={styles.gcsStatusTxt}>Severe</Text>
                              <Text style={styles.gcsStatusTxt}>3-8</Text>
                            </View>
                          </View>
                        </View>
                      </>
                    )}
                  </View>

                  {/* Symptoms Section */}
                  <View style={styles.categoryDiv}>
                    <Text style={styles.categoryText}>
                       Vitals Details
                    </Text>
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
                              <TouchableOpacity onPress={() => navigation.navigate('Editvitals', {data: item, userData, selectedPatient})}>
                                <FontAwesomeIcon
                                  icon={faPencilSquare}
                                  color="#05b508"
                                  style={styles.icon}
                                />
                              </TouchableOpacity>
                            </View>
                            <View style={styles.sympDivOuter} key={index + 1}>

                              {/* New Vitals Data */}
                              <View style={styles.sympDivInner}>
                                <Text style={styles.label}>Eye Opening</Text>
                                <Text>{item.eyeopening}</Text>
                              </View>
                              <View style={styles.sympDivInner}>
                                <Text style={styles.label}>Motor Response</Text>
                                <Text>{item.motorResponse}</Text>
                              </View>
                              <View style={styles.sympDivInner}>
                                <Text style={styles.label}>Diastolic BP</Text>
                                <Text>{item.p_diastolicbp}</Text>
                              </View>
                              <View style={styles.sympDivInner}>
                                <Text style={styles.label}>Pulse</Text>
                                <Text>{item.p_pulse}</Text>
                              </View>
                              <View style={styles.sympDivInner}>
                                <Text style={styles.label}>
                                  Respiratory Rate
                                </Text>
                                <Text>{item.p_rsprate}</Text>
                              </View>
                              <View style={styles.sympDivInner}>
                                <Text style={styles.label}>SpO2</Text>
                                <Text>{item.p_spo2}</Text>
                              </View>
                              <View style={styles.sympDivInner}>
                                <Text style={styles.label}>Systolic BP</Text>
                                <Text>{item.p_systolicbp}</Text>
                              </View>
                              <View style={styles.sympDivInner}>
                                <Text style={styles.label}>Temperature</Text>
                                <Text>{item.p_temp}</Text>
                              </View>
                              <View style={styles.sympDivInner}>
                                <Text style={styles.label}>
                                  Verbal Response
                                </Text>
                                <Text>{item.verbalResponse}</Text>
                              </View>
                            </View>
                          </View>
                        );
                      })
                    ) : (
                      <View style={styles.sympDiv}>
                        <View style={{padding: 20}}>
                          <Text
                            style={{textAlign: 'center', fontWeight: '500'}}>
                            No Data Available
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </>
              );
            }}
          </Formik>
        </ScrollView>

        <View style={styles.loginButton}>
          <TouchableOpacity
            style={[styles.buttonDiv, {backgroundColor: '#1b55f5'}]}
            onPress={() =>
              formikRef.current && formikRef.current.handleSubmit()
            }>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default Vitals;

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
  section: {
    padding: 10,
  },
  title: {
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 1,
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 10,
  },
  vitalsContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 10,
  },
  vitalsContentDiv: {
    borderWidth: 1.5,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#e6e6e6',
    backgroundColor: '#ffffff',
  },
  input: {
    width: '100%',
    // borderWidth: 1
  },
  vitalsContentDivInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '62%',
  },
  text: {
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 1,
  },
  vitalsContentTextInner: {
    padding: 10,
    borderLeftWidth: 0.5,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  vitalsContentOuter: {
    width: '49%',
    marginBottom: 10,
  },
  vitalsTitle: {
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  loginButton: {
    backgroundColor: '#ffffff',
    padding: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    // height: 60,
    borderTopWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#e6e6e6',
  },
  buttonDiv: {
    padding: 14,
    backgroundColor: '#f2f2f2',
    width: '100%',
    borderRadius: 4,
  },
  buttonText: {
    fontWeight: '500',
    color: '#fff',
    letterSpacing: 1,
    textAlign: 'center',
  },
  dropdown: {
    height: 50,
    backgroundColor: '#ffffff',
    borderColor: '#dcdcde',
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginVertical: 10,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  statusDiv: {
    borderColor: '#dcdcde',
    borderWidth: 1,
    borderRadius: 4,
    padding: 6,
    width: '30%',
    backgroundColor: '#ffffff',
  },
  gcsStatusTxt: {
    textAlign: 'center',
    color: '#000000',
  },

  statusDivSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
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
  modalContentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
