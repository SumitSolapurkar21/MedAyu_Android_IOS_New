import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  BackHandler,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faChevronDown,
  faChevronRight,
  faChevronUp,
  faPencilSquare,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import UserContext from '../../functions/usercontext';
import {Formik} from 'formik';
import axios from 'axios';
import {Checkbox, RadioButton} from 'react-native-paper';
import {
  addopdassessment,
  FetchMobileOpdAssessmentForEditapi,
} from '../../api/api';

const SystemicExamination = () => {
  // ref and navigation ....
  const navigation = useNavigation();
  const formikRef = useRef(null);

  // collapse States ...
  const [collapseEENT, setCollapseEENT] = useState(false);
  const [collapseResp, setCollapseResp] = useState(false);
  const [collapseCardio, setCollapseCardio] = useState(false);
  const [collapseGastro, setCollapseGastro] = useState(false);
  const [collapseGeneit, setCollapseGeneit] = useState(false);
  const [collapseMusculos, setCollapseMusculos] = useState(false);
  const [collapseNeuro, setCollapseNeuro] = useState(false);
  const [collapseSkin, setCollapseSkin] = useState(false);

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

  // context ...
  const {userData, selectedPatient} = useContext(UserContext);

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
          api_type: 'OPD-SYSTEMIC-EXAMINATION',
          opdsystemicexaminationhistoryarray: values,
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

  useEffect(() => {
    const fetchmobileAssessment = async () => {
      try {
        await axios
          .post(FetchMobileOpdAssessmentForEditapi, {
            hospital_id: userData?.hospital_id,
            reception_id: userData?._id,
            patient_id: selectedPatient?._id,
            api_type: 'OPD-SYSTEMIC-EXAMINATION',
            uhid: selectedPatient?.patientuniqueno,
            mobilenumber: selectedPatient?.mobilenumber,
            appoint_id: selectedPatient?.appoint_id,
          })
          .then(res => {
            console.log('res : ', res.data);
            setPatientSympyomsArrayEdit(
              res.data.opdsystemicexaminationhistoryarray,
            );
          });
      } catch (error) {
        console.error(error);
      }
    };

    fetchmobileAssessment();
  }, []);

  console.log(patientSympyomsArrayEdit);

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
          <Text style={styles.navbarText}>Systemic Examination</Text>
        </TouchableOpacity>
      </View>

      {/* section */}
      <View style={styles.container}>
        <ScrollView vertical style={{marginBottom: 80}}>
          <Formik
            innerRef={formikRef}
            initialValues={{
              eyes: '',
              ears: '',
              nose: '',
              oralcavity: '',
              tongue: '',
              scalp: '',
              throat: '',
              rate: '',
              rhythm_depth: '',
              chest_movement: '',
              breath_sound: '',
              pulse_rhythm: '',
              pluse_amplitude: '',
              pulse_rate: '',
              neck_vein_engorged: '',
              edema: '',
              chest_wall: '',
              heart_sound: '',
              presence_of_any: '',
              palpation: '',
              abdomen_shape: '',
              liver: '',
              spleen: '',
              pr_examination: '',
              abdominal_sound: '',
              genitalia: '',
              breast: '',
              nipple: '',
              motor_power: '',
              rom: '',
              cordination: '',
              gait: '',
              ecg_input: '',
              gcs_e: '',
              gcs_v: '',
              gcs_v2: '',
              gcs_score: '',
              vision: '',
              vision_right: '',
              vision_left: '',
              speech: '',
              speech_right: '',
              speech_left: '',
              hearing: '',
              hearing_left: '',
              hearing_right: '',
              sensation: '',
              reflexes: '',
              memory: '',
              dermal_assessment: '',
              color: '',
              turgor: '',
              pressure_ulcer: '',
              pressure_ulcer_stage1: '',
              pressure_ulcer_stage2: '',
              pressure_ulcer_stage3: '',
              pressure_ulcer_stage4: '',
              pressure_ulcer_unstable: '',
              pressure_ulcer_deep_tissue_injury: '',
            }}
            validate={values => {
              const errors = {};
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
              return (
                <>
                  {/* section 1 */}
                  <View style={styles.section}>
                    <TouchableOpacity
                      style={styles.sectionHeader}
                      onPress={() => setCollapseEENT(!collapseEENT)}>
                      <Text style={styles.title}>EENT</Text>
                      <FontAwesomeIcon
                        icon={collapseEENT ? faChevronUp : faChevronDown}
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                    {collapseEENT && (
                      <>
                        <View style={styles.content}>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Eyes</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('eyes', value)
                              }
                              value={values.eyes}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="Abnormal" />
                                  <Text>Abnormal</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Ears</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('ears', value)
                              }
                              value={values.ears}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="Abnormal" />
                                  <Text>Abnormal</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Nose</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('nose', value)
                              }
                              value={values.nose}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="Abnormal" />
                                  <Text>Abnormal</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Oral Cavity</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('oralcavity', value)
                              }
                              value={values.oralcavity}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="Abnormal" />
                                  <Text>Abnormal</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Tongue</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('tongue', value)
                              }
                              value={values.tongue}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="Abnormal" />
                                  <Text>Abnormal</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Scalp & Hair</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('scalp', value)
                              }
                              value={values.scalp}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="Abnormal" />
                                  <Text>Abnormal</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Throat</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('throat', value)
                              }
                              value={values.throat}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="Abnormal" />
                                  <Text>Abnormal</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                        </View>
                      </>
                    )}
                  </View>

                  {/* section 2 */}
                  <View style={styles.section}>
                    <TouchableOpacity
                      style={styles.sectionHeader}
                      onPress={() => setCollapseResp(!collapseResp)}>
                      <Text style={styles.title}>Respiratory</Text>
                      <FontAwesomeIcon
                        icon={collapseResp ? faChevronUp : faChevronDown}
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                    {collapseResp && (
                      <>
                        <View style={styles.content}>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Rate</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('rate', value)
                              }
                              value={values.rate}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="eupnea" />
                                  <Text>Eupnea</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="tachynea" />
                                  <Text>Tachypnea</Text>
                                </View>
                              </View>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="bradypnea" />
                                  <Text>Bradypnea</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="apnea" />
                                  <Text>Apnea</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Rhythm / Depth</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('rhythm_depth', value)
                              }
                              value={values.rhythm_depth}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="regular" />
                                  <Text>Regular</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="irregular" />
                                  <Text>Irregular</Text>
                                </View>
                              </View>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="deep" />
                                  <Text>Deep</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="shallow" />
                                  <Text>Shallow</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Chest Movement</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('chest_movement', value)
                              }
                              value={values.chest_movement}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="symmetrical" />
                                  <Text>Symmetrical</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="asymmetrical" />
                                  <Text>Asymmetrical</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Breath Sound</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('breath_sound', value)
                              }
                              value={values.breath_sound}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="Abnormal" />
                                  <Text>Abnormal</Text>
                                </View>
                              </View>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="wheeze" />
                                  <Text>Wheeze</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="rhonchi" />
                                  <Text>Rhonchi</Text>
                                </View>
                              </View>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="crepitation" />
                                  <Text>Crepitation</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="other" />
                                  <Text>Other</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                        </View>
                      </>
                    )}
                  </View>

                  {/* section 3 */}
                  <View style={styles.section}>
                    <TouchableOpacity
                      style={styles.sectionHeader}
                      onPress={() => setCollapseCardio(!collapseCardio)}>
                      <Text style={styles.title}>Cardiovescular</Text>
                      <FontAwesomeIcon
                        icon={collapseCardio ? faChevronUp : faChevronDown}
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                    {collapseCardio && (
                      <>
                        <View style={styles.content}>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Pulse Rhythm</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('pulse_rhythm', value)
                              }
                              value={values.pulse_rhythm}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="regular" />
                                  <Text>Regular</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="irregular" />
                                  <Text>Irregular</Text>
                                </View>
                              </View>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="bradypnea" />
                                  <Text>Bradypnea</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="apnea" />
                                  <Text>Apnea</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Pulse Amplitude</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('pluse_amplitude', value)
                              }
                              value={values.pluse_amplitude}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="bounding" />
                                  <Text>Bounding</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="decreased" />
                                  <Text>Decreased</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Pulse Rate</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('pulse_rate', value)
                              }
                              value={values.pulse_rate}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="tachycardia" />
                                  <Text>Tachycardia</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="bradycardia" />
                                  <Text>Bradycardia</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Neck Vein Engorged</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('neck_vein_engorged', value)
                              }
                              value={values.neck_vein_engorged}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="yes" />
                                  <Text>Yes</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="no" />
                                  <Text>No</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Edema</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('edema', value)
                              }
                              value={values.edema}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="yes" />
                                  <Text>Yes</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="no_pitting" />
                                  <Text>No Pitting</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Chest Wall</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('chest_wall', value)
                              }
                              value={values.chest_wall}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="abnormal" />
                                  <Text>Abnormal</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Heart Sound</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('heart_sound', value)
                              }
                              value={values.heart_sound}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="abnormal" />
                                  <Text>Abnormal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="wheeze" />
                                  <Text>Wheeze</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="rhonchi" />
                                  <Text>Rhonchi</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="crepitation" />
                                  <Text>Crepitation</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="other" />
                                  <Text>Other</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>ECG</Text>
                            <TextInput
                              style={styles.input}
                              name="ecg_input"
                              onChangeText={handleChange('ecg_input')}
                              onBlur={handleBlur('ecg_input')}
                              value={values.ecg_input}
                            />
                          </View>
                        </View>
                      </>
                    )}
                  </View>

                  {/* section 4 */}
                  <View style={styles.section}>
                    <TouchableOpacity
                      style={styles.sectionHeader}
                      onPress={() => setCollapseGastro(!collapseGastro)}>
                      <Text style={styles.title}>Gastrointestinal</Text>
                      <FontAwesomeIcon
                        icon={collapseGastro ? faChevronUp : faChevronDown}
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                    {collapseGastro && (
                      <>
                        <View style={styles.content}>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Abdomen Shape</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('abdomen_shape', value)
                              }
                              value={values.abdomen_shape}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="distended" />
                                  <Text>Distended</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Presence of Any</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('presence_of_any', value)
                              }
                              value={values.presence_of_any}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="scars" />
                                  <Text>Scars</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="swelling" />
                                  <Text>Swelling</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="distended_vessels" />
                                  <Text>Distended Vessels</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="none" />
                                  <Text>None</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Palpation</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('palpation', value)
                              }
                              value={values.palpation}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="soft" />
                                  <Text>Soft</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="tender" />
                                  <Text>Tender</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Liver</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('liver', value)
                              }
                              value={values.liver}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="palpable" />
                                  <Text>Palpable</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="non_palpable" />
                                  <Text>Non Palpable</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Spleen</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('spleen', value)
                              }
                              value={values.spleen}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="palpable" />
                                  <Text>Palpable</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="non_palpable" />
                                  <Text>Non Palpable</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Abdominal Sound</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('abdominal_sound', value)
                              }
                              value={values.abdominal_sound}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="abnormal" />
                                  <Text>Abnormal</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>PR Examination</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('pr_examination', value)
                              }
                              value={values.pr_examination}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="abnormal" />
                                  <Text>Abnormal</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                        </View>
                      </>
                    )}
                  </View>

                  {/* section 5 */}
                  <View style={styles.section}>
                    <TouchableOpacity
                      style={styles.sectionHeader}
                      onPress={() => setCollapseGeneit(!collapseGeneit)}>
                      <Text style={styles.title}>Genitourinary</Text>
                      <FontAwesomeIcon
                        icon={collapseGeneit ? faChevronUp : faChevronDown}
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                    {collapseGeneit && (
                      <>
                        <View style={styles.content}>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Genitalia</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('genitalia', value)
                              }
                              value={values.genitalia}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="abnormal" />
                                  <Text>Abnormal</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Breast</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('breast', value)
                              }
                              value={values.breast}>
                              <View style={styles.grpradio}>
                                <View style={styles.grpradio}>
                                  <View style={styles.radiosection}>
                                    <RadioButton value="normal" />
                                    <Text>Normal</Text>
                                  </View>
                                  <View style={styles.radiosection}>
                                    <RadioButton value="abnormal" />
                                    <Text>Abnormal</Text>
                                  </View>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Nipple</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('nipple', value)
                              }
                              value={values.nipple}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="abnormal" />
                                  <Text>Abnormal</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                        </View>
                      </>
                    )}
                  </View>

                  {/* section 6 */}
                  <View style={styles.section}>
                    <TouchableOpacity
                      style={styles.sectionHeader}
                      onPress={() => setCollapseMusculos(!collapseMusculos)}>
                      <Text style={styles.title}>Musculoskeletal</Text>
                      <FontAwesomeIcon
                        icon={collapseMusculos ? faChevronUp : faChevronDown}
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                    {collapseMusculos && (
                      <>
                        <View style={styles.content}>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Any Deformity</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('any_deformity', value)
                              }
                              value={values.any_deformity}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="yes" />
                                  <Text>Yes</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="no" />
                                  <Text>No</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Motor Power</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('motor_power', value)
                              }
                              value={values.motor_power}>
                              <View style={styles.grpradio}>
                                <View style={styles.grpradio}>
                                  <View style={styles.radiosection}>
                                    <RadioButton value="normal" />
                                    <Text>Normal</Text>
                                  </View>
                                  <View style={styles.radiosection}>
                                    <RadioButton value="abnormal" />
                                    <Text>Abnormal</Text>
                                  </View>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>ROM</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('rom', value)
                              }
                              value={values.rom}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="abnormal" />
                                  <Text>Abnormal</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Cordination</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('cordination', value)
                              }
                              value={values.cordination}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="abnormal" />
                                  <Text>Abnormal</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Gait</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('gait', value)
                              }
                              value={values.gait}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="abnormal" />
                                  <Text>Abnormal</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                        </View>
                      </>
                    )}
                  </View>

                  {/* section 7 */}
                  <View style={styles.section}>
                    <TouchableOpacity
                      style={styles.sectionHeader}
                      onPress={() => setCollapseNeuro(!collapseNeuro)}>
                      <Text style={styles.title}>Neurological</Text>
                      <FontAwesomeIcon
                        icon={collapseNeuro ? faChevronUp : faChevronDown}
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                    {collapseNeuro && (
                      <>
                        <View style={styles.content}>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>GCS</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('any_deformity', value)
                              }
                              value={values.any_deformity}>
                              <View style={[styles.grpradio, {gap: 3}]}>
                                <View
                                  style={[
                                    styles.radiosection,
                                    {gap: 6, marginBottom: 4},
                                  ]}>
                                  <Text>E</Text>
                                  <TextInput
                                    style={[styles.input, {width: 60}]}
                                    name="gcs_e"
                                    onChangeText={handleChange('gcs_e')}
                                    onBlur={handleBlur('gcs_e')}
                                    value={values.gcs_e}
                                  />
                                </View>
                                <View
                                  style={[
                                    styles.radiosection,
                                    {gap: 6, marginBottom: 4},
                                  ]}>
                                  <Text>V</Text>
                                  <TextInput
                                    style={[styles.input, {width: 60}]}
                                    name="gcs_v"
                                    onChangeText={handleChange('gcs_v')}
                                    onBlur={handleBlur('gcs_v')}
                                    value={values.gcs_v}
                                  />
                                </View>
                                <View
                                  style={[
                                    styles.radiosection,
                                    {gap: 6, marginBottom: 4},
                                  ]}>
                                  <Text>V</Text>
                                  <TextInput
                                    style={[styles.input, {width: 60}]}
                                    name="gcs_v2"
                                    onChangeText={handleChange('gcs_v2')}
                                    onBlur={handleBlur('gcs_v2')}
                                    value={values.gcs_v2}
                                  />
                                </View>
                                <View
                                  style={[
                                    styles.radiosection,
                                    {gap: 6, marginBottom: 4},
                                  ]}>
                                  <Text>Score</Text>
                                  <TextInput
                                    style={[styles.input, {width: 60}]}
                                    name="gcs_score"
                                    onChangeText={handleChange('gcs_score')}
                                    onBlur={handleBlur('gcs_score')}
                                    value={values.gcs_score}
                                  />
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Vision</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('vision', value)
                              }
                              value={values.vision}>
                              <View style={styles.grpradio}>
                                <View style={styles.grpradio}>
                                  <View style={styles.radiosection}>
                                    <RadioButton value="normal" />
                                    <Text>Normal</Text>
                                  </View>
                                  <View>
                                    <View style={styles.radiosection}>
                                      <RadioButton value="impaired" />
                                      <Text>Impaired</Text>
                                    </View>
                                    <View>
                                      {values.vision === 'impaired' && (
                                        <>
                                          <View
                                            style={[
                                              styles.radiosection,
                                              {marginBottom: 4, marginLeft: 8},
                                            ]}>
                                            <TouchableOpacity
                                              style={[
                                                styles.checkbox,
                                                {
                                                  backgroundColor:
                                                    values.vision_left
                                                      ? '&#10004'
                                                      : 'transparent',
                                                },
                                              ]}
                                              onPress={() =>
                                                setFieldValue(
                                                  'vision_left',
                                                  !values.vision_left,
                                                )
                                              }>
                                              {values.vision_left && (
                                                <View
                                                  style={styles.checkboxInner}
                                                />
                                              )}
                                            </TouchableOpacity>
                                            <Text>Left</Text>
                                          </View>
                                          <View
                                            style={[
                                              styles.radiosection,
                                              {marginLeft: 8},
                                            ]}>
                                            <TouchableOpacity
                                              style={[
                                                styles.checkbox,
                                                {
                                                  backgroundColor:
                                                    values.vision_right
                                                      ? '&#10004'
                                                      : 'transparent',
                                                },
                                              ]}
                                              onPress={() =>
                                                setFieldValue(
                                                  'vision_right',
                                                  !values.vision_right,
                                                )
                                              }>
                                              {values.vision_right && (
                                                <View
                                                  style={styles.checkboxInner}
                                                />
                                              )}
                                            </TouchableOpacity>
                                            <Text>Right</Text>
                                          </View>
                                        </>
                                      )}
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Hearing</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('hearing', value)
                              }
                              value={values.hearing}>
                              <View style={styles.grpradio}>
                                <View style={styles.grpradio}>
                                  <View style={styles.radiosection}>
                                    <RadioButton value="normal" />
                                    <Text>Normal</Text>
                                  </View>
                                  <View>
                                    <View style={styles.radiosection}>
                                      <RadioButton value="impaired" />
                                      <Text>Impaired</Text>
                                    </View>
                                    <View>
                                      {values.hearing === 'impaired' && (
                                        <>
                                          <View
                                            style={[
                                              styles.radiosection,
                                              {marginBottom: 4, marginLeft: 8},
                                            ]}>
                                            <TouchableOpacity
                                              style={[
                                                styles.checkbox,
                                                {
                                                  backgroundColor:
                                                    values.hearing_left
                                                      ? '&#10004'
                                                      : 'transparent',
                                                },
                                              ]}
                                              onPress={() =>
                                                setFieldValue(
                                                  'hearing_left',
                                                  !values.hearing_left,
                                                )
                                              }>
                                              {values.hearing_left && (
                                                <View
                                                  style={styles.checkboxInner}
                                                />
                                              )}
                                            </TouchableOpacity>
                                            <Text>Left</Text>
                                          </View>
                                          <View
                                            style={[
                                              styles.radiosection,
                                              {marginLeft: 8},
                                            ]}>
                                            <TouchableOpacity
                                              style={[
                                                styles.checkbox,
                                                {
                                                  backgroundColor:
                                                    values.hearing_right
                                                      ? '&#10004'
                                                      : 'transparent',
                                                },
                                              ]}
                                              onPress={() =>
                                                setFieldValue(
                                                  'hearing_right',
                                                  !values.hearing_right,
                                                )
                                              }>
                                              {values.hearing_right && (
                                                <View
                                                  style={styles.checkboxInner}
                                                />
                                              )}
                                            </TouchableOpacity>
                                            <Text>Right</Text>
                                          </View>
                                        </>
                                      )}
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Speech</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('speech', value)
                              }
                              value={values.speech}>
                              <View style={styles.grpradio}>
                                <View style={styles.grpradio}>
                                  <View style={styles.radiosection}>
                                    <RadioButton value="normal" />
                                    <Text>Normal</Text>
                                  </View>
                                  <View>
                                    <View style={styles.radiosection}>
                                      <RadioButton value="impaired" />
                                      <Text>Impaired</Text>
                                    </View>
                                    <View>
                                      {values.speech === 'impaired' && (
                                        <>
                                          <View
                                            style={[
                                              styles.radiosection,
                                              {marginBottom: 4, marginLeft: 8},
                                            ]}>
                                            <TouchableOpacity
                                              style={[
                                                styles.checkbox,
                                                {
                                                  backgroundColor:
                                                    values.speech_left
                                                      ? '&#10004'
                                                      : 'transparent',
                                                },
                                              ]}
                                              onPress={() =>
                                                setFieldValue(
                                                  'speech_left',
                                                  !values.speech_left,
                                                )
                                              }>
                                              {values.speech_left && (
                                                <View
                                                  style={styles.checkboxInner}
                                                />
                                              )}
                                            </TouchableOpacity>
                                            <Text>Left</Text>
                                          </View>
                                          <View
                                            style={[
                                              styles.radiosection,
                                              {marginLeft: 8},
                                            ]}>
                                            <TouchableOpacity
                                              style={[
                                                styles.checkbox,
                                                {
                                                  backgroundColor:
                                                    values.speech_right
                                                      ? '&#10004'
                                                      : 'transparent',
                                                },
                                              ]}
                                              onPress={() =>
                                                setFieldValue(
                                                  'speech_right',
                                                  !values.speech_right,
                                                )
                                              }>
                                              {values.speech_right && (
                                                <View
                                                  style={styles.checkboxInner}
                                                />
                                              )}
                                            </TouchableOpacity>
                                            <Text>Right</Text>
                                          </View>
                                        </>
                                      )}
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>

                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Sensations</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('sensation', value)
                              }
                              value={values.sensation}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="abnormal" />
                                  <Text>Abnormal</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Reflexes</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('reflexes', value)
                              }
                              value={values.reflexes}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="abnormal" />
                                  <Text>Abnormal</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Memory</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('memory', value)
                              }
                              value={values.memory}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="loss" />
                                  <Text>Loss</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                        </View>
                      </>
                    )}
                  </View>

                  {/* section 8 */}
                  <View style={styles.section}>
                    <TouchableOpacity
                      style={styles.sectionHeader}
                      onPress={() => setCollapseSkin(!collapseSkin)}>
                      <Text style={styles.title}>Skin</Text>
                      <FontAwesomeIcon
                        icon={collapseSkin ? faChevronUp : faChevronDown}
                        style={styles.icon}
                      />
                    </TouchableOpacity>
                    {collapseSkin && (
                      <>
                        <View style={styles.content}>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Dermal Assessment</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('dermal_assessment', value)
                              }
                              value={values.dermal_assessment}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="normal" />
                                  <Text>Normal</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="abrasion" />
                                  <Text>Abrasion</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="burn" />
                                  <Text>Burn</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="contusion" />
                                  <Text>Contusion</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="dermatitis" />
                                  <Text>Dermatitis</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="ecchymosis" />
                                  <Text>Ecchymosis</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="hematoma" />
                                  <Text>Hematoma</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="laceration" />
                                  <Text>Laceration</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="mass" />
                                  <Text>Mass</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="petechiae" />
                                  <Text>Petechiae</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="rash" />
                                  <Text>Rash</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="suture" />
                                  <Text>Suture</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="other" />
                                  <Text>Other</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Color</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('color', value)
                              }
                              value={values.color}>
                              <View style={styles.grpradio}>
                                <View style={styles.grpradio}>
                                  <View style={styles.radiosection}>
                                    <RadioButton value="nornal" />
                                    <Text>Normal</Text>
                                  </View>
                                  <View style={styles.radiosection}>
                                    <RadioButton value="pale" />
                                    <Text>Pale</Text>
                                  </View>
                                  <View style={styles.radiosection}>
                                    <RadioButton value="jaundice" />
                                    <Text>Jaundice</Text>
                                  </View>
                                  <View style={styles.radiosection}>
                                    <RadioButton value="cyanosis" />
                                    <Text>Cyanosis</Text>
                                  </View>
                                  <View style={styles.radiosection}>
                                    <RadioButton value="pink" />
                                    <Text>Pink</Text>
                                  </View>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Turgor</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('turgor', value)
                              }
                              value={values.turgor}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="good" />
                                  <Text>Good</Text>
                                </View>
                                <View style={styles.radiosection}>
                                  <RadioButton value="poor" />
                                  <Text>Poor</Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                          <View style={styles.contentOuter}>
                            <Text style={styles.text}>Pressure Ulcer</Text>
                            <RadioButton.Group
                              onValueChange={value =>
                                setFieldValue('pressure_ulcer', value)
                              }
                              value={values.pressure_ulcer}>
                              <View style={styles.grpradio}>
                                <View style={styles.radiosection}>
                                  <RadioButton value="no" />
                                  <Text>No</Text>
                                </View>
                                <View
                                  style={[
                                    styles.radiosection,
                                    {marginBottom: 4},
                                  ]}>
                                  <TouchableOpacity
                                    style={[
                                      styles.checkbox,
                                      {
                                        backgroundColor:
                                          values.pressure_ulcer_stage1
                                            ? '&#10004'
                                            : 'transparent',
                                      },
                                    ]}
                                    onPress={() =>
                                      setFieldValue(
                                        'pressure_ulcer_stage1',
                                        !values.pressure_ulcer_stage1,
                                      )
                                    }>
                                    {values.pressure_ulcer_stage1 && (
                                      <View style={styles.checkboxInner} />
                                    )}
                                  </TouchableOpacity>
                                  <Text style={styles.text2}>
                                    Stage 1: intact skin with non-blanch able
                                    redness of location
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    styles.radiosection,
                                    {marginBottom: 4},
                                  ]}>
                                  <TouchableOpacity
                                    style={[
                                      styles.checkbox,
                                      {
                                        backgroundColor:
                                          values.pressure_ulcer_stage2
                                            ? '&#10004'
                                            : 'transparent',
                                      },
                                    ]}
                                    onPress={() =>
                                      setFieldValue(
                                        'pressure_ulcer_stage2',
                                        !values.pressure_ulcer_stage2,
                                      )
                                    }>
                                    {values.pressure_ulcer_stage2 && (
                                      <View style={styles.checkboxInner} />
                                    )}
                                  </TouchableOpacity>
                                  <Text style={styles.text2}>
                                    Stage 2: skin loss: abrasion, blister or
                                    shallow crater
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    styles.radiosection,
                                    {marginBottom: 4},
                                  ]}>
                                  <TouchableOpacity
                                    style={[
                                      styles.checkbox,
                                      {
                                        backgroundColor:
                                          values.pressure_ulcer_stage3
                                            ? '&#10004'
                                            : 'transparent',
                                      },
                                    ]}
                                    onPress={() =>
                                      setFieldValue(
                                        'pressure_ulcer_stage3',
                                        !values.pressure_ulcer_stage3,
                                      )
                                    }>
                                    {values.pressure_ulcer_stage3 && (
                                      <View style={styles.checkboxInner} />
                                    )}
                                  </TouchableOpacity>
                                  <Text style={styles.text2}>
                                    Stage 3: Shallow/deep crater: not extend
                                    down through underlying fascia
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    styles.radiosection,
                                    {marginBottom: 4},
                                  ]}>
                                  <TouchableOpacity
                                    style={[
                                      styles.checkbox,
                                      {
                                        backgroundColor:
                                          values.pressure_ulcer_stage4
                                            ? '&#10004'
                                            : 'transparent',
                                      },
                                    ]}
                                    onPress={() =>
                                      setFieldValue(
                                        'pressure_ulcer_stage4',
                                        !values.pressure_ulcer_stage4,
                                      )
                                    }>
                                    {values.pressure_ulcer_stage4 && (
                                      <View style={styles.checkboxInner} />
                                    )}
                                  </TouchableOpacity>
                                  <Text style={styles.text2}>
                                    Stage 4: Deep crater: exposed bone, tendon
                                    or muscle
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    styles.radiosection,
                                    {marginBottom: 4},
                                  ]}>
                                  <TouchableOpacity
                                    style={[
                                      styles.checkbox,
                                      {
                                        backgroundColor:
                                          values.pressure_ulcer_unstable
                                            ? '&#10004'
                                            : 'transparent',
                                      },
                                    ]}
                                    onPress={() =>
                                      setFieldValue(
                                        'pressure_ulcer_unstable',
                                        !values.pressure_ulcer_unstable,
                                      )
                                    }>
                                    {values.pressure_ulcer_unstable && (
                                      <View style={styles.checkboxInner} />
                                    )}
                                  </TouchableOpacity>
                                  <Text style={styles.text2}>
                                    Unstageble: Slough (yellow, gray, green or
                                    brown) or eschar wound bed
                                  </Text>
                                </View>
                                <View
                                  style={[
                                    styles.radiosection,
                                    {marginBottom: 4},
                                  ]}>
                                  <TouchableOpacity
                                    style={[
                                      styles.checkbox,
                                      {
                                        backgroundColor:
                                          values.pressure_ulcer_deep_tissue_injury
                                            ? '&#10004'
                                            : 'transparent',
                                      },
                                    ]}
                                    onPress={() =>
                                      setFieldValue(
                                        'pressure_ulcer_deep_tissue_injury',
                                        !values.pressure_ulcer_deep_tissue_injury,
                                      )
                                    }>
                                    {values.pressure_ulcer_deep_tissue_injury && (
                                      <View style={styles.checkboxInner} />
                                    )}
                                  </TouchableOpacity>
                                  <Text style={styles.text2}>
                                    Deep tissue injury
                                  </Text>
                                </View>
                              </View>
                            </RadioButton.Group>
                          </View>
                        </View>
                      </>
                    )}
                  </View>
                </>
              );
            }}
          </Formik>
          {/* Symptoms Section */}
          <View style={styles.categoryDiv}>
            <Text style={styles.categoryText}>
              Systemic Examination Details
            </Text>

            <View style={styles.sympDiv}>
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
                  style={[styles.modalText, {marginBottom: 0, fontSize: 13}]}>
                  # Systemin Examination Details
                </Text>
                <TouchableOpacity>
                  <FontAwesomeIcon
                    icon={faPencilSquare}
                    color="#05b508"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.sympDivOuter}>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Advice</Text>
                  <Text>{patientSympyomsArrayEdit?.opdtemplate_text}</Text>
                </View>

                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Abdomen Shape</Text>
                  <Text>{patientSympyomsArrayEdit?.abdomen_shape}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Abdominal Sound</Text>
                  <Text>{patientSympyomsArrayEdit?.abdominal_sound}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Any Deformity</Text>
                  <Text>{patientSympyomsArrayEdit?.any_deformity}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Breast</Text>
                  <Text>{patientSympyomsArrayEdit?.breast}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Breath Sound</Text>
                  <Text>{patientSympyomsArrayEdit?.breath_sound}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Chest Movement</Text>
                  <Text>{patientSympyomsArrayEdit?.chest_movement}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Chest Wall</Text>
                  <Text>{patientSympyomsArrayEdit?.chest_wall}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Color</Text>
                  <Text>{patientSympyomsArrayEdit?.color}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Dermal Assessment</Text>
                  <Text>{patientSympyomsArrayEdit?.dermal_assessment}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Ears</Text>
                  <Text>{patientSympyomsArrayEdit?.ears}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>ECG Input</Text>
                  <Text>{patientSympyomsArrayEdit?.ecg_input}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Edema</Text>
                  <Text>{patientSympyomsArrayEdit?.edema}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Eyes</Text>
                  <Text>{patientSympyomsArrayEdit?.eyes}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>GCS E</Text>
                  <Text>{patientSympyomsArrayEdit?.gcs_e}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>GCS Score</Text>
                  <Text>{patientSympyomsArrayEdit?.gcs_score}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>GCS V</Text>
                  <Text>{patientSympyomsArrayEdit?.gcs_v}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Genitalia</Text>
                  <Text>{patientSympyomsArrayEdit?.genitalia}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Hearing</Text>
                  <Text>{patientSympyomsArrayEdit?.hearing}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Heart Sound</Text>
                  <Text>{patientSympyomsArrayEdit?.heart_sound}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Memory</Text>
                  <Text>{patientSympyomsArrayEdit?.memory}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Motor Power</Text>
                  <Text>{patientSympyomsArrayEdit?.motor_power}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Neck Vein Engorged</Text>
                  <Text>{patientSympyomsArrayEdit?.neck_vein_engorged}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Nipple</Text>
                  <Text>{patientSympyomsArrayEdit?.nipple}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Nose</Text>
                  <Text>{patientSympyomsArrayEdit?.nose}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Oral Cavity</Text>
                  <Text>{patientSympyomsArrayEdit?.oralcavity}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Palpation</Text>
                  <Text>{patientSympyomsArrayEdit?.palpation}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Pulse Amplitude</Text>
                  <Text>{patientSympyomsArrayEdit?.pluse_amplitude}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Pulse Rate</Text>
                  <Text>{patientSympyomsArrayEdit?.pulse_rate}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Pulse Rhythm</Text>
                  <Text>{patientSympyomsArrayEdit?.pulse_rhythm}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Rate</Text>
                  <Text>{patientSympyomsArrayEdit?.rate}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Reflexes</Text>
                  <Text>{patientSympyomsArrayEdit?.reflexes}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Rhythm Depth</Text>
                  <Text>{patientSympyomsArrayEdit?.rhythm_depth}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Sensation</Text>
                  <Text>{patientSympyomsArrayEdit?.sensation}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Speech</Text>
                  <Text>{patientSympyomsArrayEdit?.speech}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Spleen</Text>
                  <Text>{patientSympyomsArrayEdit?.spleen}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Throat</Text>
                  <Text>{patientSympyomsArrayEdit?.throat}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Tongue</Text>
                  <Text>{patientSympyomsArrayEdit?.tongue}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Turgor</Text>
                  <Text>{patientSympyomsArrayEdit?.turgor}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Vision</Text>
                  <Text>{patientSympyomsArrayEdit?.vision}</Text>
                </View>
              </View>
            </View>
          </View>
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

export default SystemicExamination;

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
    padding: 6,
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
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 2,
    borderColor: '#e6e6e6',
    borderWidth: 1.5,
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  content: {
    gap: 4,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    borderColor: '#e6e6e6',
  },
  contentDiv: {
    borderWidth: 1.5,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#e6e6e6',
    backgroundColor: '#ffffff',
  },
  contentOuter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  radiosection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  grpradio: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: 180,
  },
  text: {
    color: '#000000',
    letterSpacing: 0.5,
    fontWeight: '500',
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
  input: {
    borderWidth: 1.5,
    borderRadius: 4,
    width: '50%',
    padding: 6,
    borderColor: '#e6e6e6',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: 'blue',
  },
  text2: {
    width: '85%',
    flexWrap: 'wrap',
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
  modalDiv: {
    flexDirection: 'column',
    gap: 4,
    width: '100%',
  },
});
