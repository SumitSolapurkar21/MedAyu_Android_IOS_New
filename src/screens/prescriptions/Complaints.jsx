import React, {useEffect, useState, useContext, useCallback} from 'react';
import {
  Alert,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
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
import {Modal} from 'react-native-paper'; // Importing Modal from react-native-paper
import axios from 'axios';
import {
  addmobilesymptomsdirectly,
  addopdassessment,
  fetchmobilecomplaintscategory,
  FetchMobileOpdAssessmentForEditapi,
  fetchsysmptomsacccategory,
} from '../../api/api';
import UserContext from '../../functions/usercontext';

const Complaints = () => {
  const navigation = useNavigation();

  const {userData, selectedPatient} = useContext(UserContext);

  // selection data ...
  const [value, setValue] = useState('Medical');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('');
  const [selectedCategoryforSymptoms, setSelectedCategoryforSymptoms] =
    useState('');

  // inputs states ...
  const [filterInput, setFilterInput] = useState('');
  const [symptomsInput, setSymptomsInput] = useState('');
  const [searchSymptomsInput, setSearchSymptomsInput] = useState('');
  const [durationInput, setDurationInput] = useState('');
  const [remarkInput, setRemarkInput] = useState('');

  // array states ...
  const [symptomsArray, setSymptomsArray] = useState([]);
  const [categoryArray, setCategoryArray] = useState([]);
  const [patientSympyomsArray, setPatientSympyomsArray] = useState([]);
  const [patientSympyomsArrayEdit, setPatientSympyomsArrayEdit] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);

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

  // Fetch complaints data on page load
  useEffect(() => {
    if (value) {
      complaints();
    }
  }, [value]);

  const complaints = async () => {
    try {
      const res = await axios.post(fetchmobilecomplaintscategory, {
        hospital_id: userData?.hospital_id,
        reception_id: userData?._id,
        type: value,
      });
      const {data, message, status} = res.data;

      if (status) {
        setCategoryArray(data);
      } else {
        Alert.alert('Error !!', message);
      }
    } catch (error) {
      Alert.alert('Error !!', error.message);
    }
  };

  // fetch symtoms according to category ....

  useEffect(() => {
    if (value && selectedCategoryforSymptoms) {
      FetchSymptomsAccCategoryHandler();
    }
  }, [value, selectedCategoryforSymptoms]);

  const FetchSymptomsAccCategoryHandler = async () => {
    const data = {
      category: selectedCategoryforSymptoms,
      hospital_id: userData?.hospital_id,
      reception_id: userData?._id,
      // patient_id: patient_id,
      type: value,
    };
    try {
      await axios.post(fetchsysmptomsacccategory, data).then(res => {
        const {data, status, message} = res.data;

        if (status === true) {
          setSymptomsArray(data);
        } else {
          Alert.alert('Error !!', message);
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

  // Toggle2 modal visibility
  const toggleModal2 = () => {
    setIsModalVisible2(!isModalVisible2);
  };

  // Toggle3 modal visibility
  const toggleModal3 = data => {
    console.log({data});
    navigation.navigate('Editcomplaints', {
      data: data,
      userData: userData,
      selectedPatient: selectedPatient,
      frequencyArray: frequencyArray,
      timeArray: timeArray,
    });
  };

  // Filter category based on user input
  const filteredCategories = categoryArray?.filter(item =>
    item.categoryname.toLowerCase().includes(filterInput.toLowerCase()),
  );

  // Filter category based on user input
  const filteredSymptoms = symptomsArray?.filter(
    item =>
      typeof item.illnessname === 'string' &&
      item.illnessname
        .toLowerCase()
        .includes(searchSymptomsInput.toLowerCase()),
  );

  // when click on category to open symptoms popup ....
  const symptomsHandler = __data => {
    console.log(__data);
    toggleModal2();
    setSelectedCategoryforSymptoms(__data);
  };

  // Add Symptoms ...
  const addSymptomsHandler = async () => {
    try {
      const data = {
        hospital_id: userData?.hospital_id,
        maincategory: value,
        category: selectedCategory,
        illnessname: symptomsInput,
      };

      await axios.post(addmobilesymptomsdirectly, data).then(res => {
        return res.data;
      });
    } catch (error) {
      Alert.alert('Error !!', error);
    }
  };

  // frequency data .....
  let frequencyArray = [
    {
      label: 'Often',
      value: 'Often',
    },
    {
      label: 'Once',
      value: 'Once',
    },
    {
      label: 'Sometime',
      value: 'Sometime',
    },
    {
      label: 'Manytime',
      value: 'Manytime',
    },
    {
      label: 'Continuous',
      value: 'Continuous',
    },
  ];

  let timeArray = [
    {
      label: 'Minutes',
      value: 'Minutes',
    },
    {
      label: 'Hours',
      value: 'Hours',
    },
    {
      label: 'Days',
      value: 'Days',
    },
    {
      label: 'Months',
      value: 'Months',
    },
    {
      label: 'Year',
      value: 'Year',
    },
  ];

  // add symptoms for patients .....
  const addPatientSymptomsToArrayHandler = () => {
    toggleModal2();
    const data = {
      category: value,
      symptoms: selectedSymptoms,
      duration: durationInput,
      time: selectedTime,
      frequency: selectedFrequency,
      remark: remarkInput,
    };
    setPatientSympyomsArray(prevData => [...prevData, data]);
  };

  // Function to remove a symptom by index
  const removeSymptom = indexToRemove => {
    setPatientSympyomsArray(prevArray =>
      prevArray.filter((_, index) => index !== indexToRemove),
    );
  };

  // fetch complaints
  useFocusEffect(
    useCallback(() => {
      const fetchmobileAssessment = async () => {
        try {
          await axios
            .post(FetchMobileOpdAssessmentForEditapi, {
              hospital_id: userData?.hospital_id,
              reception_id: userData?._id,
              patient_id: selectedPatient?._id,
              api_type: 'OPD-COMPLAINTS',
              uhid: selectedPatient?.patientuniqueno,
              mobilenumber: selectedPatient?.mobilenumber,
              appoint_id: selectedPatient?.appoint_id,
            })
            .then(res => {
              console.log('edit fetchmobileAssessment : ', res.data);
              setPatientSympyomsArrayEdit(res.data.opdcomplaintArray);
            });
        } catch (error) {
          console.error(error);
        }
      };

      fetchmobileAssessment();
    }, []),
  );

  // submit complaints patient data ...
  const savePatientSymptoms = async () => {
    const data = {
      hospital_id: userData?.hospital_id,
      reception_id: userData?._id,
      complaintArray: patientSympyomsArray,
      api_type: 'OPD-COMPLAINTS',

      // patient details below ...
      uhid: selectedPatient?.patientuniqueno,
      mobilenumber: selectedPatient?.mobilenumber,
      patient_id: selectedPatient?.patient_id,
      appoint_id: selectedPatient?.appoint_id,
    };

    if (patientSympyomsArray?.length > 0) {
      try {
        await axios.post(addopdassessment, data).then(res => {
          if (res.data.status === true)
            return Alert.alert('Success !!', 'Complaints Added Successfully');
          else Alert.alert('Error !!', 'Complaints Not Added');
        });
      } catch (error) {
        Alert.alert('Error !!', error);
      }
      navigation.replace('CreateRx');
    } else {
      Alert.alert('Warning !!', 'Add symptoms first');
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
          <Text style={styles.navbarText}>Complaints</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {!isModalVisible2 ? (
          <>
            <ScrollView vertical showsVerticalScrollIndicator={false}>
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
                <Text style={styles.categoryText}>Category</Text>
                <View style={styles.filterDiv}>
                  <TextInput
                    style={styles.filterinput}
                    placeholder="Search Category"
                    value={filterInput}
                    onChangeText={text => setFilterInput(text)}
                  />
                  <TouchableOpacity
                    style={styles.addCategButton}
                    onPress={toggleModal}>
                    <FontAwesomeIcon icon={faPlus} style={styles.icon} />
                  </TouchableOpacity>
                </View>
                <View style={styles.catDiv}>
                  {filteredCategories?.length > 0 &&
                    filteredCategories.map((item, index) => (
                      <TouchableOpacity
                        onPress={() => symptomsHandler(item.categoryvalue)}
                        key={index}
                        style={[
                          styles.segButton,
                          selectedCategoryforSymptoms === item.categoryvalue &&
                            styles.selectedButton,
                        ]}>
                        <Text style={styles.segText}>{item.categoryname}</Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </View>

              {/* Already Symptoms Section */}
              <View style={styles.categoryDiv}>
                <Text style={styles.categoryText}>
                  Previous Symptoms Detail
                </Text>
                {patientSympyomsArrayEdit?.length > 0 ? (
                  patientSympyomsArrayEdit?.map((item, index) => {
                    return (
                      <View
                        style={[styles.sympDiv, styles.sympContainer]}
                        key={index + 1}>
                        <View style={styles.sympDivOuter} key={index + 1}>
                          <Text style={styles.sympText}>
                            {item.symptoms} {item.duration} {item.time}{' '}
                            {item.frequency}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.editIcon}
                          onPress={() => toggleModal3(item)}>
                          <FontAwesomeIcon
                            icon={faPencil}
                            color="#05b508"
                            style={[styles.icon, {padding: 9}]}
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
                <Text style={styles.categoryText}>Symptoms Detail</Text>
                {patientSympyomsArray?.length > 0 ? (
                  patientSympyomsArray?.map((item, index) => {
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
                          <View style={styles.icongroup}>
                            <TouchableOpacity
                              onPress={() => removeSymptom(index)}>
                              <FontAwesomeIcon
                                icon={faTrashCan}
                                color="#FF3B30"
                                style={styles.icon}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={styles.sympDivOuter} key={index + 1}>
                          <View style={styles.sympDivInner}>
                            <Text style={styles.label}>Category</Text>
                            <Text>{item.category}</Text>
                          </View>
                          <View style={styles.sympDivInner}>
                            <Text style={styles.label}>Symptom</Text>
                            <Text>{item.symptoms}</Text>
                          </View>
                          <View style={styles.sympDivInner}>
                            <Text style={styles.label}>Duration</Text>
                            <Text>{item.duration}</Text>
                          </View>
                          <View style={styles.sympDivInner}>
                            <Text style={styles.label}>Time</Text>
                            <Text>{item.time}</Text>
                          </View>
                          <View style={styles.sympDivInner}>
                            <Text style={styles.label}>Frequency</Text>
                            <Text>{item.frequency}</Text>
                          </View>
                          <View style={styles.sympDivInner}>
                            <Text style={styles.label}>Remark</Text>
                            <Text>{item.remark}</Text>
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

            {/* add chategory Modal */}
            <Modal
              visible={isModalVisible}
              onDismiss={toggleModal}
              contentContainerStyle={styles.bottomModalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalContentHeader}>
                  <Text
                    style={[styles.modalText, {marginBottom: 0, fontSize: 18}]}>
                    Add Symptoms
                  </Text>
                  <TouchableOpacity
                    onPress={toggleModal}
                    style={styles.closeButton1}>
                    <FontAwesomeIcon
                      icon={faXmark}
                      color="#FF3B30"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.modalText}>Category</Text>
                <TextInput
                  style={styles.filterinput}
                  placeholder="Search Category"
                  value={filterInput}
                  onChangeText={text => setFilterInput(text)}
                />
                <ScrollView horizontal>
                  <View style={styles.catDiv}>
                    {filteredCategories?.length > 0 &&
                      filteredCategories.map((item, index) => (
                        <TouchableOpacity
                          onPress={() =>
                            setSelectedCategory(item.categoryvalue)
                          }
                          key={index}
                          style={[
                            styles.segButton,
                            selectedCategory === item.categoryvalue &&
                              styles.selectedButton,
                          ]}>
                          <Text style={styles.segText}>
                            {item.categoryname}
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                </ScrollView>
                <Text style={styles.modalText}>Symptoms</Text>
                <TextInput
                  style={styles.filterinput}
                  placeholder="Symptoms"
                  value={symptomsInput}
                  onChangeText={text => setSymptomsInput(text)}
                />
                <TouchableOpacity
                  onPress={addSymptomsHandler}
                  style={[styles.closeButton, {backgroundColor: '#5cd65c'}]}>
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </>
        ) : (
          <View
            visible={isModalVisible2}
            onDismiss={toggleModal2}
            style={styles.bottomModalContainer2}>
            <View style={styles.modalContent}>
              {/* header */}
              <View style={styles.modalContentHeader}>
                <Text
                  style={[styles.modalText, {marginBottom: 0, fontSize: 18}]}>
                  Add Symptoms
                </Text>
                <TouchableOpacity
                  onPress={toggleModal2}
                  style={styles.closeButton1}>
                  <FontAwesomeIcon
                    icon={faXmark}
                    color="#FF3B30"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>

              {/* form */}
              <ScrollView vertical showsVerticalScrollIndicator={false}>
                <Text style={styles.modalText}>Symptoms</Text>
                <TextInput
                  style={styles.filterinput}
                  placeholder="Search Symptoms"
                  value={searchSymptomsInput}
                  onChangeText={text => setSearchSymptomsInput(text)}
                />
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.catDiv}>
                    {filteredSymptoms?.length > 0 &&
                      filteredSymptoms.map((item, index) => (
                        <TouchableOpacity
                          onPress={() => setSelectedSymptoms(item.illnessname)}
                          key={index + 1}
                          style={[
                            styles.segButton,
                            selectedSymptoms === item.illnessname &&
                              styles.selectedButton,
                          ]}>
                          <Text style={styles.segText}>{item.illnessname}</Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                </ScrollView>

                {/* duration ... */}
                <Text style={styles.modalText}>Duration</Text>
                <TextInput
                  style={styles.filterinput}
                  placeholder="Duration"
                  value={durationInput}
                  onChangeText={text => setDurationInput(text)}
                />
                {/* time ... */}
                <Text style={styles.modalText}>Time</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.catDiv}>
                    {timeArray?.length > 0 &&
                      timeArray.map((item, index) => (
                        <TouchableOpacity
                          onPress={() => setSelectedTime(item.value)}
                          key={index + 1}
                          style={[
                            styles.segButton,
                            selectedTime === item.value &&
                              styles.selectedButton,
                          ]}>
                          <Text style={styles.segText}>{item.label}</Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                </ScrollView>
                {/* frequency ... */}
                <Text style={styles.modalText}>Frequency</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.catDiv}>
                    {frequencyArray?.length > 0 &&
                      frequencyArray.map((item, index) => (
                        <TouchableOpacity
                          onPress={() => setSelectedFrequency(item.value)}
                          key={index + 1}
                          style={[
                            styles.segButton,
                            selectedFrequency === item.value &&
                              styles.selectedButton,
                          ]}>
                          <Text style={styles.segText}>{item.label}</Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                </ScrollView>

                {/* remark ... */}
                <Text style={styles.modalText}>Remark</Text>
                <TextInput
                  style={styles.filterinput}
                  placeholder="Remark"
                  value={remarkInput}
                  onChangeText={text => setRemarkInput(text)}
                />

                <TouchableOpacity
                  onPress={addPatientSymptomsToArrayHandler}
                  style={[styles.closeButton, {backgroundColor: '#5cd65c'}]}>
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    </>
  );
};

export default Complaints;

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
  sympContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sympText: {
    fontSize: 16,
    fontWeight: 'normal',

  },
  editIcon: {
    padding: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#05b508',
  },
  navbarText: {
    fontSize: 18,
    color: 'black',
    fontWeight: '400',
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f7fc',
    paddingBottom: '18%',
  },
  segDiv: {
    padding: 10,
    flexDirection: 'row',
    alignContent: 'center',
    gap: 10,
  },
  segButton: {
    padding: 4,
    paddingHorizontal: 16,
    borderColor: '#e6e6e6',
    borderWidth: 1.4,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  selectedButton: {
    backgroundColor: '#f2e6ff',
  },
  segText: {
    fontWeight: '500',
    letterSpacing: 0.5,
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
    marginBottom: 10,
  },
  filterDiv: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterinput: {
    padding: 12,
    paddingHorizontal: 16,
    borderColor: '#e6e6e6',
    borderWidth: 1.4,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    flex: 0.8,
    marginBottom: 6,
    // minHeight: 30
  },
  addCategButton: {
    backgroundColor: '#f2e6ff',
    borderColor: '#e6e6e6',
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 10,
  },
  bottomModalContainer: {
    padding: 20,
    paddingBottom: 120,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
  },
  bottomModalContainer2: {
    padding: 20,
    flex: 1,
  },

  modalText: {
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 10,
    color: '#000000',
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: '#FF3B30',
    padding: 6,
    borderRadius: 6,
    marginTop: 20,
    width: 80,
    alignSelf: 'flex-end',
    borderColor: '#e6e6e6',
    borderWidth: 1,
  },
  closeButton1: {
    // backgroundColor: '#FF3B30',
    padding: 4,
    borderRadius: 20,
    borderColor: '#FF3B30',
    borderWidth: 1.4,
  },

  modalContentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  icongroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
