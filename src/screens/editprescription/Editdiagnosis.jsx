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
  Platform,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faCalendarDays,
  faPencilSquare,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {Modal} from 'react-native-paper';
import axios from 'axios';
import {addopdassessment, searchdiagnosisdata} from '../../api/api';
import DatePicker from 'react-native-date-picker';

const Editdiagnosis = ({route}) => {
  const navigation = useNavigation();
  const {data, userData, selectedPatient} = route?.params;

  // input state ...
  const [diagnosisSearchInput, setDiagnosisSearchInput] = useState('');
  const [value, setValue] = useState('Medical');
  const [selectedDiseases, setSelectedDiseases] = useState('');
  const [diagnosisType, setDiagnosisType] = useState('');
  const [adddate, setAdddate] = useState('');
  const [addtime, setAddtime] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  // array state ...
  const [diagnosisArray, setDiagnosisArray] = useState([]);
  const [open, setOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  // Initialize form data with the passed data
  const [formData, setFormData] = useState({
    icdcode: data?.icdcode || '',
    illnessname: data?.illnessname || '',
    diagnosis_type: data?.diagnosis_type || '',
    adddate: data?.adddate || '',
    addtime: data?.addtime || '',
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

  // fetch diseases handler
  useEffect(() => {
    if (diagnosisSearchInput) {
      fetchDiagnosisHandler();
    }
  }, [diagnosisSearchInput, value]);

  const fetchDiagnosisHandler = async () => {
    try {
      const __data = {
        hospital_id: userData?.hospital_id,
        reception_id: userData?._id,
        text: diagnosisSearchInput,
        type: value,
      };

      await axios.post(searchdiagnosisdata, __data).then(res => {
        const {data, message} = res.data;
        if (data.length > 0) {
          setDiagnosisArray(data);
        } else {
          Alert.alert('Error !!', message);
        }
      });
    } catch (error) {
      Alert.alert('Error !!', error);
    }
  };

  // Update form data
  const updateFormData = () => {
    const updatedData = {
      icdcode:
        diagnosisArray.find(item => item.illnessname === selectedDiseases)
          ?.icdcode || formData.icdcode,
      illnessname: selectedDiseases || formData.illnessname,
      diagnosis_type: diagnosisType || formData.diagnosis_type,
      adddate: adddate || formData.adddate,
      addtime: addtime || formData.addtime,
    };
    setFormData(updatedData);
  };

  // Update patient diagnosis
  const updatePatientDiagnosis = async () => {
    const data = {
      hospital_id: userData?.hospital_id,
      reception_id: userData?._id,
      opddiagnosishistoryarray: [formData],
      api_type: 'OPD-DIAGNOSIS',
      uhid: selectedPatient?.patientuniqueno,
      mobilenumber: selectedPatient?.mobilenumber,
      patient_id: selectedPatient?.patient_id,
      appoint_id: selectedPatient?.appoint_id,
    };

    try {
      await axios.post(addopdassessment, data).then(res => {
        if (res.data.status === true) {
          Alert.alert('Success !!', 'Diagnosis Updated Successfully');
          navigation.goBack();
        } else {
          Alert.alert('Error !!', 'Diagnosis Not Updated');
        }
      });
    } catch (error) {
      Alert.alert('Error !!', error);
    }
  };

  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

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
          <Text style={styles.navbarText}>Edit Diagnosis</Text>
        </TouchableOpacity>
      </View>

      {!isModalVisible ? (
        <View style={styles.container}>
          <ScrollView
            style={{marginBottom: 70}}
            vertical
            showsVerticalScrollIndicator={false}>
            {/* Segmented Buttons */}
            <View style={styles.segDiv}>
              <TouchableOpacity
                style={[
                  styles.segButton,
                  value === 'Medical' && styles.selectedButton,
                ]}
                onPress={() => setValue('Medical')}>
                <Text style={styles.segText}>Medical</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.segButton,
                  value === 'Ayurvedic' && styles.selectedButton,
                ]}
                onPress={() => setValue('Ayurvedic')}>
                <Text style={styles.segText}>Ayurvedic</Text>
              </TouchableOpacity>
            </View>

            {/* Category Section */}
            <View style={styles.categoryDiv}>
              <Text style={styles.categoryText}>Diagnosis</Text>
              <View style={styles.filterDiv}>
                <TextInput
                  style={[styles.filterinput]}
                  placeholder="Search Diagnosis"
                  value={diagnosisSearchInput}
                  onChangeText={text => setDiagnosisSearchInput(text)}
                />
              </View>
              <View style={styles.catDiv}>
                {diagnosisArray?.length > 0 &&
                  diagnosisArray.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedDiseases(item.illnessname);
                        setDiagnosisType(item.diagnosis_type || '');
                        setAdddate(item.adddate || '');
                        setAddtime(item.addtime || '');
                        toggleModal();
                      }}
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

            {/* Current Diagnosis Details */}
            <View style={styles.categoryDiv}>
              <Text style={styles.categoryText}>Current Diagnosis Details</Text>
              <View style={styles.sympDiv}>
                <View style={styles.sympDivOuter}>
                  <View style={styles.sympDivInner}>
                    <Text style={styles.label}>ICD Code</Text>
                    <Text>{formData.icdcode}</Text>
                  </View>
                  <View style={styles.sympDivInner}>
                    <Text style={styles.label}>Diagnosis</Text>
                    <Text>{formData.illnessname}</Text>
                  </View>
                  <View style={styles.sympDivInner}>
                    <Text style={styles.label}>Diagnosis Type</Text>
                    <Text>{formData.diagnosis_type}</Text>
                  </View>
                  <View style={styles.sympDivInner}>
                    <Text style={styles.label}>Date / Time</Text>
                    <Text>
                      {formData.adddate} / {formData.addtime}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.loginButton}>
            <TouchableOpacity
              style={[styles.buttonDiv, {backgroundColor: '#1b55f5'}]}
              onPress={() => {
                updateFormData();
                updatePatientDiagnosis();
              }}>
              <Text style={styles.buttonText}>Update</Text>
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
                Edit Diagnosis
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
            <View style={styles.modalDiv}>
              <View>
                <Text style={styles.modalText}>Illness</Text>
                <TouchableOpacity
                  style={[
                    styles.segButton,
                    selectedDiseases && styles.selectedButton,
                  ]}>
                  <Text style={styles.segText}>{selectedDiseases || '-'}</Text>
                </TouchableOpacity>
              </View>
              <View style={{marginBottom: 10}}>
                <Text style={styles.modalText}>Diagnosis Type</Text>
                <View style={{flexDirection: 'row', gap: 8}}>
                  <TouchableOpacity
                    style={[
                      styles.segButton,
                      diagnosisType === 'Provisional' && styles.selectedButton,
                    ]}
                    onPress={() => setDiagnosisType('Provisional')}>
                    <Text style={styles.segText}>Provisional</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.segButton,
                      diagnosisType === 'Final' && styles.selectedButton,
                    ]}
                    onPress={() => setDiagnosisType('Final')}>
                    <Text style={styles.segText}>Final</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <Text style={styles.modalText}>ICD Code</Text>
                <View style={{flexDirection: 'row', gap: 8}}>
                  <View style={[styles.segButton]}>
                    <Text style={styles.segText}>
                      {diagnosisArray.find(
                        item => item.illnessname === selectedDiseases,
                      )?.icdcode || '-'}
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                <Text style={styles.modalText}>Date</Text>
                <TouchableOpacity
                  style={[styles.segButton, {flexDirection: 'row', gap: 20}]}
                  onPress={() => setOpen(true)}>
                  <Text style={styles.segText}>{adddate || 'Select Date'}</Text>
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
                      setAdddate(formattedDate);
                    }}
                    onCancel={() => {
                      setOpen(false);
                    }}
                  />
                  <FontAwesomeIcon icon={faCalendarDays} style={styles.icon} />
                </TouchableOpacity>
              </View>
              <View>
                <Text style={styles.modalText}>Time</Text>
                <TouchableOpacity
                  style={[styles.segButton, {flexDirection: 'row', gap: 20}]}
                  onPress={() => setTimeOpen(true)}>
                  <Text style={styles.segText}>{addtime || 'Select Time'}</Text>
                  <DatePicker
                    modal
                    mode="time"
                    open={timeOpen}
                    date={new Date()}
                    onConfirm={selectedTime => {
                      setTimeOpen(false);
                      const hours = selectedTime
                        .getHours()
                        .toString()
                        .padStart(2, '0');
                      const minutes = selectedTime
                        .getMinutes()
                        .toString()
                        .padStart(2, '0');
                      setAddtime(`${hours}:${minutes}`);
                    }}
                    onCancel={() => {
                      setTimeOpen(false);
                    }}
                  />
                  <FontAwesomeIcon icon={faCalendarDays} style={styles.icon} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                updateFormData();
                toggleModal();
              }}
              style={[styles.closeButton1, {backgroundColor: '#5cd65c'}]}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

export default Editdiagnosis;

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
  buttonText: {
    color: '#ffffff',
    fontWeight: '500',
    letterSpacing: 1,
    textAlign: 'center',
  },
  segDiv: {
    padding: 10,
    flexDirection: 'row',
    alignContent: 'center',
    gap: 10,
  },
  modalContent: {
    padding: 16,
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
  bottomModalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 16,
    position: 'absolute',
    bottom: 0.5,
    width: '100%',
  },
  closeButton: {
    padding: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'red',
  },
});
