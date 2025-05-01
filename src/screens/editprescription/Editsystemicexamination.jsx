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
import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {Modal, RadioButton} from 'react-native-paper';
import axios from 'axios';
import {addopdassessment} from '../../api/api';

const initialFields = {
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
};

const Editsystemicexamination = ({route}) => {
  const navigation = useNavigation();
  const {data, userData, selectedPatient} = route?.params || {};

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    ...initialFields,
    ...data,
  });

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

  // Update form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  // Update patient systemic examination
  const updatePatientSystemicExamination = async () => {
    const data = {
      hospital_id: userData?.hospital_id,
      reception_id: userData?._id,
      opdsystemicexaminationhistoryarray: [formData],
      api_type: 'OPD-SYSTEMIC-EXAMINATION',
      uhid: selectedPatient?.patientuniqueno,
      mobilenumber: selectedPatient?.mobilenumber,
      patient_id: selectedPatient?.patient_id,
      appoint_id: selectedPatient?.appoint_id,
    };
    try {
      await axios.post(addopdassessment, data).then(res => {
        if (res.data.status === true) {
          Alert.alert('Success !!', 'Systemic Examination Updated Successfully');
          navigation.goBack();
        } else {
          Alert.alert('Error !!', 'Systemic Examination Not Updated');
        }
      });
    } catch (error) {
      Alert.alert('Error !!', error?.message || error);
    }
  };

  // Section collapse states
  const [collapseEENT, setCollapseEENT] = useState(true);
  const [collapseResp, setCollapseResp] = useState(false);
  const [collapseCardio, setCollapseCardio] = useState(false);
  const [collapseGastro, setCollapseGastro] = useState(false);
  const [collapseGeneit, setCollapseGeneit] = useState(false);
  const [collapseMusculos, setCollapseMusculos] = useState(false);
  const [collapseNeuro, setCollapseNeuro] = useState(false);
  const [collapseSkin, setCollapseSkin] = useState(false);

  // Helper for checkboxes
  const toggleCheckbox = (field) => {
    setFormData(prev => ({...prev, [field]: !prev[field]}));
  };

  return (
    <>
      <StatusBar style={styles.StatusBar} animated={false} backgroundColor="#ffffff" />
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.navbarText}>Edit Systemic Examination</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={isModalVisible} onDismiss={() => setIsModalVisible(false)} contentContainerStyle={styles.bottomModalContainer}>
        <ScrollView style={{maxHeight: '90%'}}>
          {/* EENT Section */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.sectionHeader} onPress={() => setCollapseEENT(!collapseEENT)}>
              <Text style={styles.title}>EENT</Text>
            </TouchableOpacity>
            {collapseEENT && (
              <>
                {[{label: 'Eyes', field: 'eyes'}, {label: 'Ears', field: 'ears'}, {label: 'Nose', field: 'nose'}, {label: 'Oral Cavity', field: 'oralcavity'}, {label: 'Tongue', field: 'tongue'}, {label: 'Scalp & Hair', field: 'scalp'}, {label: 'Throat', field: 'throat'}].map(item => (
                  <View style={styles.contentOuter} key={item.field}>
                    <Text style={styles.text}>{item.label}</Text>
                    <RadioButton.Group
                      onValueChange={value => updateFormData(item.field, value)}
                      value={formData[item.field]}>
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
                ))}
              </>
            )}
          </View>

          {/* Respiratory Section */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.sectionHeader} onPress={() => setCollapseResp(!collapseResp)}>
              <Text style={styles.title}>Respiratory</Text>
            </TouchableOpacity>
            {collapseResp && (
              <>
                {/* Rate */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Rate</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('rate', value)}
                    value={formData.rate}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="eupnea" /><Text>Eupnea</Text></View>
                      <View style={styles.radiosection}><RadioButton value="tachynea" /><Text>Tachypnea</Text></View>
                      <View style={styles.radiosection}><RadioButton value="bradypnea" /><Text>Bradypnea</Text></View>
                      <View style={styles.radiosection}><RadioButton value="apnea" /><Text>Apnea</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Rhythm / Depth */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Rhythm / Depth</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('rhythm_depth', value)}
                    value={formData.rhythm_depth}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="regular" /><Text>Regular</Text></View>
                      <View style={styles.radiosection}><RadioButton value="irregular" /><Text>Irregular</Text></View>
                      <View style={styles.radiosection}><RadioButton value="deep" /><Text>Deep</Text></View>
                      <View style={styles.radiosection}><RadioButton value="shallow" /><Text>Shallow</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Chest Movement */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Chest Movement</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('chest_movement', value)}
                    value={formData.chest_movement}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="symmetrical" /><Text>Symmetrical</Text></View>
                      <View style={styles.radiosection}><RadioButton value="asymmetrical" /><Text>Asymmetrical</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Breath Sound */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Breath Sound</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('breath_sound', value)}
                    value={formData.breath_sound}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="normal" /><Text>Normal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="Abnormal" /><Text>Abnormal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="wheeze" /><Text>Wheeze</Text></View>
                      <View style={styles.radiosection}><RadioButton value="rhonchi" /><Text>Rhonchi</Text></View>
                      <View style={styles.radiosection}><RadioButton value="crepitation" /><Text>Crepitation</Text></View>
                      <View style={styles.radiosection}><RadioButton value="other" /><Text>Other</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
              </>
            )}
          </View>

          {/* Cardiovascular Section */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.sectionHeader} onPress={() => setCollapseCardio(!collapseCardio)}>
              <Text style={styles.title}>Cardiovascular</Text>
            </TouchableOpacity>
            {collapseCardio && (
              <>
                {/* Pulse Rhythm */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Pulse Rhythm</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('pulse_rhythm', value)}
                    value={formData.pulse_rhythm}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="regular" /><Text>Regular</Text></View>
                      <View style={styles.radiosection}><RadioButton value="irregular" /><Text>Irregular</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Pulse Amplitude */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Pulse Amplitude</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('pluse_amplitude', value)}
                    value={formData.pluse_amplitude}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="bounding" /><Text>Bounding</Text></View>
                      <View style={styles.radiosection}><RadioButton value="normal" /><Text>Normal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="decreased" /><Text>Decreased</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Pulse Rate */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Pulse Rate</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('pulse_rate', value)}
                    value={formData.pulse_rate}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="normal" /><Text>Normal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="tachycardia" /><Text>Tachycardia</Text></View>
                      <View style={styles.radiosection}><RadioButton value="bradycardia" /><Text>Bradycardia</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Neck Vein Engorged */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Neck Vein Engorged</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('neck_vein_engorged', value)}
                    value={formData.neck_vein_engorged}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="yes" /><Text>Yes</Text></View>
                      <View style={styles.radiosection}><RadioButton value="no" /><Text>No</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Edema */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Edema</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('edema', value)}
                    value={formData.edema}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="yes" /><Text>Yes</Text></View>
                      <View style={styles.radiosection}><RadioButton value="no_pitting" /><Text>No Pitting</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Chest Wall */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Chest Wall</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('chest_wall', value)}
                    value={formData.chest_wall}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="normal" /><Text>Normal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="abnormal" /><Text>Abnormal</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Heart Sound */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Heart Sound</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('heart_sound', value)}
                    value={formData.heart_sound}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="normal" /><Text>Normal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="abnormal" /><Text>Abnormal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="wheeze" /><Text>Wheeze</Text></View>
                      <View style={styles.radiosection}><RadioButton value="rhonchi" /><Text>Rhonchi</Text></View>
                      <View style={styles.radiosection}><RadioButton value="crepitation" /><Text>Crepitation</Text></View>
                      <View style={styles.radiosection}><RadioButton value="other" /><Text>Other</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* ECG */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>ECG</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.ecg_input}
                    onChangeText={text => updateFormData('ecg_input', text)}
                  />
                </View>
              </>
            )}
          </View>

          {/* Gastrointestinal Section */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.sectionHeader} onPress={() => setCollapseGastro(!collapseGastro)}>
              <Text style={styles.title}>Gastrointestinal</Text>
            </TouchableOpacity>
            {collapseGastro && (
              <>
                {/* Abdomen Shape */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Abdomen Shape</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('abdomen_shape', value)}
                    value={formData.abdomen_shape}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="normal" /><Text>Normal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="distended" /><Text>Distended</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Presence of Any */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Presence of Any</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('presence_of_any', value)}
                    value={formData.presence_of_any}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="scars" /><Text>Scars</Text></View>
                      <View style={styles.radiosection}><RadioButton value="swelling" /><Text>Swelling</Text></View>
                      <View style={styles.radiosection}><RadioButton value="distended_vessels" /><Text>Distended Vessels</Text></View>
                      <View style={styles.radiosection}><RadioButton value="none" /><Text>None</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Palpation */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Palpation</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('palpation', value)}
                    value={formData.palpation}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="soft" /><Text>Soft</Text></View>
                      <View style={styles.radiosection}><RadioButton value="tender" /><Text>Tender</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Liver */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Liver</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('liver', value)}
                    value={formData.liver}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="palpable" /><Text>Palpable</Text></View>
                      <View style={styles.radiosection}><RadioButton value="non_palpable" /><Text>Non Palpable</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Spleen */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Spleen</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('spleen', value)}
                    value={formData.spleen}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="palpable" /><Text>Palpable</Text></View>
                      <View style={styles.radiosection}><RadioButton value="non_palpable" /><Text>Non Palpable</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Abdominal Sound */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Abdominal Sound</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('abdominal_sound', value)}
                    value={formData.abdominal_sound}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="normal" /><Text>Normal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="abnormal" /><Text>Abnormal</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* PR Examination */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>PR Examination</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('pr_examination', value)}
                    value={formData.pr_examination}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="normal" /><Text>Normal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="abnormal" /><Text>Abnormal</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
              </>
            )}
          </View>

          {/* Genitourinary Section */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.sectionHeader} onPress={() => setCollapseGeneit(!collapseGeneit)}>
              <Text style={styles.title}>Genitourinary</Text>
            </TouchableOpacity>
            {collapseGeneit && (
              <>
                {/* Genitalia */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Genitalia</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('genitalia', value)}
                    value={formData.genitalia}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="normal" /><Text>Normal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="abnormal" /><Text>Abnormal</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Breast */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Breast</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('breast', value)}
                    value={formData.breast}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="normal" /><Text>Normal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="abnormal" /><Text>Abnormal</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Nipple */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Nipple</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('nipple', value)}
                    value={formData.nipple}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="normal" /><Text>Normal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="abnormal" /><Text>Abnormal</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
              </>
            )}
          </View>

          {/* Musculoskeletal Section */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.sectionHeader} onPress={() => setCollapseMusculos(!collapseMusculos)}>
              <Text style={styles.title}>Musculoskeletal</Text>
            </TouchableOpacity>
            {collapseMusculos && (
              <>
                {/* Any Deformity */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Any Deformity</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('any_deformity', value)}
                    value={formData.any_deformity}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="yes" /><Text>Yes</Text></View>
                      <View style={styles.radiosection}><RadioButton value="no" /><Text>No</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Motor Power */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Motor Power</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('motor_power', value)}
                    value={formData.motor_power}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="normal" /><Text>Normal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="abnormal" /><Text>Abnormal</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* ROM */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>ROM</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('rom', value)}
                    value={formData.rom}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="normal" /><Text>Normal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="abnormal" /><Text>Abnormal</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Cordination */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Cordination</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('cordination', value)}
                    value={formData.cordination}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="normal" /><Text>Normal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="abnormal" /><Text>Abnormal</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Gait */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Gait</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('gait', value)}
                    value={formData.gait}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="normal" /><Text>Normal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="abnormal" /><Text>Abnormal</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
              </>
            )}
          </View>

          {/* Neurological Section */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.sectionHeader} onPress={() => setCollapseNeuro(!collapseNeuro)}>
              <Text style={styles.title}>Neurological</Text>
            </TouchableOpacity>
            {collapseNeuro && (
              <>
                {/* GCS */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>GCS E</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.gcs_e}
                    onChangeText={text => updateFormData('gcs_e', text)}
                  />
                  <Text style={styles.text}>GCS V</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.gcs_v}
                    onChangeText={text => updateFormData('gcs_v', text)}
                  />
                  <Text style={styles.text}>GCS V2</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.gcs_v2}
                    onChangeText={text => updateFormData('gcs_v2', text)}
                  />
                  <Text style={styles.text}>GCS Score</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.gcs_score}
                    onChangeText={text => updateFormData('gcs_score', text)}
                  />
                </View>
                {/* Vision */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Vision</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('vision', value)}
                    value={formData.vision}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="normal" /><Text>Normal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="impaired" /><Text>Impaired</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Hearing */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Hearing</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('hearing', value)}
                    value={formData.hearing}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="normal" /><Text>Normal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="impaired" /><Text>Impaired</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Speech */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Speech</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('speech', value)}
                    value={formData.speech}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="normal" /><Text>Normal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="impaired" /><Text>Impaired</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Sensation */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Sensation</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('sensation', value)}
                    value={formData.sensation}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="normal" /><Text>Normal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="abnormal" /><Text>Abnormal</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Reflexes */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Reflexes</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('reflexes', value)}
                    value={formData.reflexes}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="normal" /><Text>Normal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="abnormal" /><Text>Abnormal</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Memory */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Memory</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('memory', value)}
                    value={formData.memory}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="normal" /><Text>Normal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="loss" /><Text>Loss</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
              </>
            )}
          </View>

          {/* Skin Section */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.sectionHeader} onPress={() => setCollapseSkin(!collapseSkin)}>
              <Text style={styles.title}>Skin</Text>
            </TouchableOpacity>
            {collapseSkin && (
              <>
                {/* Dermal Assessment */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Dermal Assessment</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('dermal_assessment', value)}
                    value={formData.dermal_assessment}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="normal" /><Text>Normal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="abrasion" /><Text>Abrasion</Text></View>
                      <View style={styles.radiosection}><RadioButton value="burn" /><Text>Burn</Text></View>
                      <View style={styles.radiosection}><RadioButton value="contusion" /><Text>Contusion</Text></View>
                      <View style={styles.radiosection}><RadioButton value="dermatitis" /><Text>Dermatitis</Text></View>
                      <View style={styles.radiosection}><RadioButton value="ecchymosis" /><Text>Ecchymosis</Text></View>
                      <View style={styles.radiosection}><RadioButton value="hematoma" /><Text>Hematoma</Text></View>
                      <View style={styles.radiosection}><RadioButton value="laceration" /><Text>Laceration</Text></View>
                      <View style={styles.radiosection}><RadioButton value="mass" /><Text>Mass</Text></View>
                      <View style={styles.radiosection}><RadioButton value="petechiae" /><Text>Petechiae</Text></View>
                      <View style={styles.radiosection}><RadioButton value="rash" /><Text>Rash</Text></View>
                      <View style={styles.radiosection}><RadioButton value="suture" /><Text>Suture</Text></View>
                      <View style={styles.radiosection}><RadioButton value="other" /><Text>Other</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Color */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Color</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('color', value)}
                    value={formData.color}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="normal" /><Text>Normal</Text></View>
                      <View style={styles.radiosection}><RadioButton value="pale" /><Text>Pale</Text></View>
                      <View style={styles.radiosection}><RadioButton value="jaundice" /><Text>Jaundice</Text></View>
                      <View style={styles.radiosection}><RadioButton value="cyanosis" /><Text>Cyanosis</Text></View>
                      <View style={styles.radiosection}><RadioButton value="pink" /><Text>Pink</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Turgor */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Turgor</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('turgor', value)}
                    value={formData.turgor}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="good" /><Text>Good</Text></View>
                      <View style={styles.radiosection}><RadioButton value="poor" /><Text>Poor</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Pressure Ulcer */}
                <View style={styles.contentOuter}>
                  <Text style={styles.text}>Pressure Ulcer</Text>
                  <RadioButton.Group
                    onValueChange={value => updateFormData('pressure_ulcer', value)}
                    value={formData.pressure_ulcer}>
                    <View style={styles.grpradio}>
                      <View style={styles.radiosection}><RadioButton value="no" /><Text>No</Text></View>
                    </View>
                  </RadioButton.Group>
                </View>
                {/* Pressure Ulcer Stages (checkboxes) */}
                {[
                  {label: 'Stage 1', field: 'pressure_ulcer_stage1'},
                  {label: 'Stage 2', field: 'pressure_ulcer_stage2'},
                  {label: 'Stage 3', field: 'pressure_ulcer_stage3'},
                  {label: 'Stage 4', field: 'pressure_ulcer_stage4'},
                  {label: 'Unstageable', field: 'pressure_ulcer_unstable'},
                  {label: 'Deep tissue injury', field: 'pressure_ulcer_deep_tissue_injury'},
                ].map(item => (
                  <View style={styles.contentOuter} key={item.field}>
                    <TouchableOpacity
                      style={styles.checkbox}
                      onPress={() => toggleCheckbox(item.field)}>
                      {formData[item.field] && <View style={styles.checkboxInner} />}
                    </TouchableOpacity>
                    <Text style={styles.text}>{item.label}</Text>
                  </View>
                ))}
              </>
            )}
          </View>
        </ScrollView>
        <View style={styles.loginButton}>
          <TouchableOpacity style={[styles.buttonDiv, {backgroundColor: '#1b55f5'}]} onPress={updatePatientSystemicExamination}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

export default Editsystemicexamination;

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
    padding: 8,
    fontWeight: '400',
  },
  navbarText: {
    fontSize: 18,
    color: 'black',
    fontWeight: '400',
  },
  section: {
    padding: 6,
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
  contentOuter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  grpradio: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: 180,
  },
  radiosection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  text: {
    color: '#000000',
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#ffffff',
    padding: 10,
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
  bottomModalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 16,
    position: 'absolute',
    bottom: 0.5,
    width: '100%',
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 4,
    width: 60,
    padding: 6,
    borderColor: '#e6e6e6',
    marginHorizontal: 4,
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
});