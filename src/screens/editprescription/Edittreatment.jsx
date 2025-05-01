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
import {
  faArrowLeft,
  faCalendarDays,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {Modal} from 'react-native-paper';
import axios from 'axios';
import {addopdassessment, fetchmedicines} from '../../api/api';
import DatePicker from 'react-native-date-picker';

const Edittreatment = ({route}) => {
  const navigation = useNavigation();
  const {data, userData, selectedPatient} = route?.params;
  console.log('data : ', data);
  // input state ...
  const [diseaseSearchInput, setDiseaseSearchInput] = useState('');
  const [selectedDiseases, setSelectedDiseases] = useState('');
  const [drugname, setDrugname] = useState('');
  const [drugcode, setDrugcode] = useState('');
  const [brandname, setBrandname] = useState('');
  const [dose, setDose] = useState('');
  const [anupan, setAnupan] = useState('');
  const [routeValue, setRouteValue] = useState('');
  const [schedule, setSchedule] = useState('');
  const [duration, setDuration] = useState('');
  const [from_date, setFrom_date] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  // array state ...
  const [diseasesArray, setDiseasesArray] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTreatmentArray, setSelectedTreatmentArray] = useState([]);

  // Initialize form data with the passed data
  const [formData, setFormData] = useState({
    drugname: data?.drugname || '',
    drugcode: data?.drugcode || '',
    brandname: data?.brandname || '',
    dose: data?.dose || '',
    anupan: data?.anupan || '',
    route: data?.route || '',
    schedule: data?.schedule || '',
    duration: data?.duration || '',
    from_date: data?.from_date || '',
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
    setSelectedDiseases(__data);
    
    // Pre-fill the form values
    if (filterTreatment && filterTreatment.length > 0) {
      const treatment = filterTreatment[0];
      setDrugname(treatment.drugname || '');
      setDrugcode(treatment.drugcode || '');
      setBrandname(treatment.brandname || '');
      setDose(treatment.dose || '');
      setAnupan(treatment.anupan || '');
      setRouteValue(treatment.route || '');
      setSchedule(treatment.schedule || '');
      setDuration(treatment.duration || '');
      setFrom_date(treatment.from_date || '');
    }
    
    toggleModal();
  };

  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  // Update form data
  const updateFormData = () => {
    const updatedData = {
      drugname: selectedDiseases || formData.drugname,
      drugcode: selectedTreatmentArray[0]?.drugcode || formData.drugcode,
      brandname: brandname || formData.brandname,
      dose: dose || formData.dose,
      anupan: anupan || formData.anupan,
      route: routeValue || formData.route,
      schedule: schedule || formData.schedule,
      duration: duration || formData.duration,
      from_date: from_date || formData.from_date,
    };
    setFormData(updatedData);
  };

  // Update patient treatment
  const updatePatientTreatment = async () => {
    const data = {
      hospital_id: userData?.hospital_id,
      reception_id: userData?._id,
      opdtreatmenthistoryarray: [formData],
      api_type: 'OPD-TREATMENT',
      uhid: selectedPatient?.patientuniqueno,
      mobilenumber: selectedPatient?.mobilenumber,
      patient_id: selectedPatient?.patient_id,
      appoint_id: selectedPatient?.appoint_id,
    };

    try {
      await axios.post(addopdassessment, data).then(res => {
        if (res.data.status === true) {
          Alert.alert('Success !!', 'Treatment Updated Successfully');
          navigation.goBack();
        } else {
          Alert.alert('Error !!', 'Treatment Not Updated');
        }
      });
    } catch (error) {
      Alert.alert('Error !!', error);
    }
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
          <Text style={styles.navbarText}>Edit Treatment</Text>
        </TouchableOpacity>
      </View>

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

          {/* Current Treatment Details */}
          <View style={styles.categoryDiv}>
            <Text style={styles.categoryText}>Current Treatment Details</Text>
            <View style={styles.sympDiv}>
              <View style={styles.sympDivOuter}>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Drug Code</Text>
                  <Text>{formData.drugcode}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Drug Name</Text>
                  <Text>{formData.drugname}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Brand Name</Text>
                  <Text>{formData.brandname}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Dose</Text>
                  <Text>{formData.dose}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Instruction</Text>
                  <Text>{formData.anupan}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Route</Text>
                  <Text>{formData.route}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Schedule</Text>
                  <Text>{formData.schedule}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Days</Text>
                  <Text>{formData.duration}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>From Date</Text>
                  <Text>{formData.from_date}</Text>
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
              updatePatientTreatment();
            }}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>

        {/* Edit Treatment Modal */}
        <Modal
          visible={isModalVisible}
          onDismiss={toggleModal}
          contentContainerStyle={styles.bottomModalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalContentHeader}>
              <Text style={[styles.modalText, {marginBottom: 0, fontSize: 18}]}>
                Edit Treatment
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
                <Text style={styles.modalText}>Drug Code</Text>
                <TouchableOpacity
                  style={[
                    styles.segButton,
                    selectedDiseases && styles.selectedButton,
                  ]}>
                  <Text style={styles.segText}>
                    {selectedTreatmentArray[0]?.drugcode || '-'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text style={styles.modalText}>Drug Name</Text>
                <TextInput
                  style={styles.filterinput}
                  placeholder="Drug Name"
                  value={drugname}
                  onChangeText={text => setDrugname(text)}
                />
              </View>
              <View>
                <Text style={styles.modalText}>Brand Name</Text>
                <TextInput
                  style={styles.filterinput}
                  placeholder="Brand Name"
                  value={brandname}
                  onChangeText={text => setBrandname(text)}
                />
              </View>
              <View>
                <Text style={styles.modalText}>Dose</Text>
                <TextInput
                  style={styles.filterinput}
                  placeholder="Dose"
                  value={dose}
                  onChangeText={text => setDose(text)}
                />
              </View>
              <View>
                <Text style={styles.modalText}>Instruction</Text>
                <TextInput
                  style={styles.filterinput}
                  placeholder="Instruction"
                  value={anupan}
                  onChangeText={text => setAnupan(text)}
                />
              </View>
              <View>
                <Text style={styles.modalText}>Route</Text>
                <TextInput
                  style={styles.filterinput}
                  placeholder="Route"
                  value={routeValue}
                  onChangeText={text => setRouteValue(text)}
                />
              </View>
              <View>
                <Text style={styles.modalText}>Schedule</Text>
                <TextInput
                  style={styles.filterinput}
                  placeholder="Schedule"
                  value={schedule}
                  onChangeText={text => setSchedule(text)}
                />
              </View>
              <View>
                <Text style={styles.modalText}>Days</Text>
                <TextInput
                  style={styles.filterinput}
                  placeholder="Duration"
                  value={duration}
                  onChangeText={text => setDuration(text)}
                />
              </View>
              <View>
                <Text style={styles.modalText}>From Date</Text>
                <TouchableOpacity
                  style={[styles.segButton, {flexDirection: 'row', gap: 20}]}
                  onPress={() => setOpen(true)}>
                  <Text style={styles.segText}>
                    {from_date || 'Select Date'}
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
                      setFrom_date(formattedDate);
                    }}
                    onCancel={() => {
                      setOpen(false);
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
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default Edittreatment;

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
  closeButton: {
    padding: 4,
    borderRadius: 20,
    borderColor: '#FF3B30',
    borderWidth: 1.4,
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
});
