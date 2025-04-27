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
import {faArrowLeft, faXmark} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {Modal} from 'react-native-paper';
import axios from 'axios';
import {addopdassessment} from '../../api/api';

const relationEyeOpening = [
  {label: 'Spontaneous', value: '4'},
  {label: 'To sound', value: '3'},
  {label: 'To pressure', value: '2'},
  {label: 'None', value: '1'},
];
const relationVerbalResp = [
  {label: 'Orientated', value: '5'},
  {label: 'Confused', value: '4'},
  {label: 'Words', value: '3'},
  {label: 'Sounds', value: '2'},
  {label: 'None', value: '1'},
];
const relationMotorResp = [
  {label: 'Obey commands', value: '6'},
  {label: 'Localising', value: '5'},
  {label: 'Normal flexion', value: '4'},
  {label: 'Abnormal flexion', value: '3'},
  {label: 'Extension', value: '2'},
  {label: 'None', value: '1'},
];

const Editvitals = ({route}) => {
  const navigation = useNavigation();
  const {data, userData, selectedPatient} = route?.params || {};

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    p_temp: data?.p_temp || '',
    p_pulse: data?.p_pulse || '',
    p_spo2: data?.p_spo2 || '',
    p_systolicbp: data?.p_systolicbp || '',
    p_diastolicbp: data?.p_diastolicbp || '',
    p_rsprate: data?.p_rsprate || '',
    eyeopening: data?.eyeopening || '',
    verbalResponse: data?.verbalResponse || '',
    motorResponse: data?.motorResponse || '',
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
  const updateFormData = () => {
    setIsModalVisible(false);
  };

  // Update patient vitals history
  const updatePatientVitalsHistory = async () => {
    const data = {
      hospital_id: userData?.hospital_id,
      reception_id: userData?._id,
      opdvitalshistoryarray: [formData],
      api_type: 'OPD-VITALS',
      uhid: selectedPatient?.patientuniqueno,
      mobilenumber: selectedPatient?.mobilenumber,
      patient_id: selectedPatient?.patient_id,
      appoint_id: selectedPatient?.appoint_id,
    };
    try {
      await axios.post(addopdassessment, data).then(res => {
        if (res.data.status === true) {
          Alert.alert('Success !!', 'Vitals Updated Successfully');
          navigation.goBack();
        } else {
          Alert.alert('Error !!', 'Vitals Not Updated');
        }
      });
    } catch (error) {
      Alert.alert('Error !!', error);
    }
  };

  return (
    <>
      <StatusBar style={styles.StatusBar} animated={false} backgroundColor="#ffffff" />
      {/* Header */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.navbarText}>Edit Vitals</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <ScrollView style={{marginBottom: 100}} vertical showsVerticalScrollIndicator={false}>
          {/* Current Vitals Details */}
          <View style={styles.categoryDiv}>
            <Text style={styles.categoryText}>Current Vitals Details</Text>
            <View style={styles.sympDiv}>
              <View style={styles.sympDivOuter}>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Temperature</Text>
                  <Text>{formData.p_temp}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Pulse</Text>
                  <Text>{formData.p_pulse}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>SPO2</Text>
                  <Text>{formData.p_spo2}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Systolic BP</Text>
                  <Text>{formData.p_systolicbp}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Diastolic BP</Text>
                  <Text>{formData.p_diastolicbp}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Resp. Rate</Text>
                  <Text>{formData.p_rsprate}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Eye Opening</Text>
                  <Text>{formData.eyeopening}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Verbal Response</Text>
                  <Text>{formData.verbalResponse}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Motor Response</Text>
                  <Text>{formData.motorResponse}</Text>
                </View>
              </View>
            </View>
          </View>
          {/* Edit Button */}
          <View style={styles.categoryDiv}>
            <TouchableOpacity style={[styles.buttonDiv, {backgroundColor: '#1b55f5'}]} onPress={() => setIsModalVisible(true)}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={styles.loginButton}>
          <TouchableOpacity style={[styles.buttonDiv, {backgroundColor: '#1b55f5'}]} onPress={updatePatientVitalsHistory}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
        {/* Edit Modal */}
        <Modal visible={isModalVisible} onDismiss={() => setIsModalVisible(false)} contentContainerStyle={styles.bottomModalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalContentHeader}>
              <Text style={[styles.modalText, {marginBottom: 0, fontSize: 18}]}>Edit Vitals</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton1}>
                <FontAwesomeIcon icon={faXmark} color="#FF3B30" style={styles.icon} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={styles.modalDiv}>
                <View>
                  <Text style={styles.modalText}>Temperature (°F)</Text>
                  <TextInput
                    style={styles.filterinput}
                    placeholder="Temperature"
                    value={formData.p_temp}
                    onChangeText={text => setFormData(prev => ({...prev, p_temp: text}))}
                    keyboardType="numeric"
                  />
                </View>
                <View>
                  <Text style={styles.modalText}>Pulse (/min)</Text>
                  <TextInput
                    style={styles.filterinput}
                    placeholder="Pulse"
                    value={formData.p_pulse}
                    onChangeText={text => setFormData(prev => ({...prev, p_pulse: text}))}
                    keyboardType="numeric"
                  />
                </View>
                <View>
                  <Text style={styles.modalText}>SPO2 (%)</Text>
                  <TextInput
                    style={styles.filterinput}
                    placeholder="SPO2"
                    value={formData.p_spo2}
                    onChangeText={text => setFormData(prev => ({...prev, p_spo2: text}))}
                    keyboardType="numeric"
                  />
                </View>
                <View>
                  <Text style={styles.modalText}>Systolic BP (mmHg)</Text>
                  <TextInput
                    style={styles.filterinput}
                    placeholder="Systolic BP"
                    value={formData.p_systolicbp}
                    onChangeText={text => setFormData(prev => ({...prev, p_systolicbp: text}))}
                    keyboardType="numeric"
                  />
                </View>
                <View>
                  <Text style={styles.modalText}>Diastolic BP (mmHg)</Text>
                  <TextInput
                    style={styles.filterinput}
                    placeholder="Diastolic BP"
                    value={formData.p_diastolicbp}
                    onChangeText={text => setFormData(prev => ({...prev, p_diastolicbp: text}))}
                    keyboardType="numeric"
                  />
                </View>
                <View>
                  <Text style={styles.modalText}>Resp. Rate (/min)</Text>
                  <TextInput
                    style={styles.filterinput}
                    placeholder="Resp. Rate"
                    value={formData.p_rsprate}
                    onChangeText={text => setFormData(prev => ({...prev, p_rsprate: text}))}
                    keyboardType="numeric"
                  />
                </View>
                <View>
                  <Text style={styles.modalText}>Eye Opening</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 10}}>
                    <View style={{flexDirection: 'row', gap: 8}}>
                      {relationEyeOpening.map(opt => (
                        <TouchableOpacity
                          key={opt.value}
                          style={[styles.segButton, formData.eyeopening === opt.value && styles.selectedButton]}
                          onPress={() => setFormData(prev => ({...prev, eyeopening: opt.value}))}
                        >
                          <Text style={styles.segText}>{opt.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>
                <View>
                  <Text style={styles.modalText}>Verbal Response</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 10}}>
                    <View style={{flexDirection: 'row', gap: 8}}>
                      {relationVerbalResp.map(opt => (
                        <TouchableOpacity
                          key={opt.value}
                          style={[styles.segButton, formData.verbalResponse === opt.value && styles.selectedButton]}
                          onPress={() => setFormData(prev => ({...prev, verbalResponse: opt.value}))}
                        >
                          <Text style={styles.segText}>{opt.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>
                <View>
                  <Text style={styles.modalText}>Motor Response</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 10}}>
                    <View style={{flexDirection: 'row', gap: 8}}>
                      {relationMotorResp.map(opt => (
                        <TouchableOpacity
                          key={opt.value}
                          style={[styles.segButton, formData.motorResponse === opt.value && styles.selectedButton]}
                          onPress={() => setFormData(prev => ({...prev, motorResponse: opt.value}))}
                        >
                          <Text style={styles.segText}>{opt.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </View>
            </ScrollView>
            <TouchableOpacity
              onPress={updateFormData}
              style={{
                backgroundColor: '#5cd65c',
                padding: 10,
                borderRadius: 6,
                alignSelf: 'flex-end',
                marginTop: 10,
                minWidth: 80,
              }}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default Editvitals;

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
  catDiv: {
    flexDirection: 'row',
    alignContent: 'center',
    gap: 10,
    flexWrap: 'wrap',
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
  sympDivInner: {
    flex: 1,
    minWidth: '45%',
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