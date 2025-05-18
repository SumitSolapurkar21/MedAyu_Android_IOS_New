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
  faXmark,
  faCalendarDays,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {Modal} from 'react-native-paper';
import axios from 'axios';
import {addopdassessment} from '../../api/api';
import DatePicker from 'react-native-date-picker';

const Editmenstrualhistory = ({route}) => {
  const navigation = useNavigation();
  const {data, userData, selectedPatient} = route?.params || {};

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const [openTime, setOpenTime] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    menarche_age: data?.menarche_age || '',
    lmp: data?.lmp || '',
    periods: data?.periods || '',
    durations: data?.durations || '',
    qualityofbloodflow: data?.qualityofbloodflow || '',
    painduringcycle: data?.painduringcycle || '',
    menopause: data?.menopause || '',
    from_date: data?.from_date || '',
    opd_time: data?.opd_time || '',
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

  // Update patient menstrual history
  const updatePatientMenstrualHistory = async () => {
    const data = {
      hospital_id: userData?.hospital_id,
      reception_id: userData?._id,
      opdmenstrualhistoryarray: [formData],
      api_type: 'OPD-MENSTRUAL-HISTORY',
      uhid: selectedPatient?.patientuniqueno,
      mobilenumber: selectedPatient?.mobilenumber,
      patient_id: selectedPatient?.patient_id,
      appoint_id: selectedPatient?.appoint_id,
    };
    try {
      await axios.post(addopdassessment, data).then(res => {
        if (res.data.status === true) {
          Alert.alert('Success !!', 'Menstrual History Updated Successfully');
          navigation.goBack();
        } else {
          Alert.alert('Error !!', 'Menstrual History Not Updated');
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
          <Text style={styles.navbarText}>Edit Menstrual History</Text>
        </TouchableOpacity>
      </View>

      {!isModalVisible ? (
        <View style={styles.container}>
          <ScrollView
            style={{marginBottom: 100}}
            vertical
            showsVerticalScrollIndicator={false}>
            {/* Current Menstrual History Details */}
            <View style={styles.categoryDiv}>
              <Text style={styles.categoryText}>
                Current Menstrual History Details
              </Text>
              <View style={styles.sympDiv}>
                <View style={styles.sympDivOuter}>
                  <View style={styles.sympDivInner}>
                    <Text style={styles.label}>Menarche Age</Text>
                    <Text>{formData.menarche_age}</Text>
                  </View>
                  <View style={styles.sympDivInner}>
                    <Text style={styles.label}>Lmp</Text>
                    <Text>{formData.lmp}</Text>
                  </View>
                  <View style={styles.sympDivInner}>
                    <Text style={styles.label}>Periods</Text>
                    <Text>{formData.periods}</Text>
                  </View>
                  <View style={styles.sympDivInner}>
                    <Text style={styles.label}>Durations</Text>
                    <Text>{formData.durations}</Text>
                  </View>
                  <View style={styles.sympDivInner}>
                    <Text style={styles.label}>Quality of Blood Flow</Text>
                    <Text>{formData.qualityofbloodflow}</Text>
                  </View>
                  <View style={styles.sympDivInner}>
                    <Text style={styles.label}>Pain during Cycle</Text>
                    <Text>{formData.painduringcycle}</Text>
                  </View>
                  <View style={styles.sympDivInner}>
                    <Text style={styles.label}>Menopause</Text>
                    <Text>{formData.menopause}</Text>
                  </View>
                  <View style={styles.sympDivInner}>
                    <Text style={styles.label}>Date / Time</Text>
                    <Text>
                      {formData.from_date} / {formData.opd_time}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {/* Edit Button */}
            <View style={styles.categoryDiv}>
              <TouchableOpacity
                style={[styles.buttonDiv, {backgroundColor: '#1b55f5'}]}
                onPress={() => setIsModalVisible(true)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <View style={styles.loginButton}>
            <TouchableOpacity
              style={[styles.buttonDiv, {backgroundColor: '#1b55f5'}]}
              onPress={updatePatientMenstrualHistory}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
          contentContainerStyle={styles.bottomModalContainer}>
          <View style={{padding: 20}}>
            <View style={styles.modalContentHeader}>
              <Text style={[styles.modalText, {marginBottom: 0, fontSize: 18}]}>
                Edit Menstrual History
              </Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton1}>
                <FontAwesomeIcon
                  icon={faXmark}
                  color="#FF3B30"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={styles.modalDiv}>
                <View>
                  <Text style={styles.modalText}>Menarche Age</Text>
                  <TextInput
                    style={styles.filterinput}
                    placeholder="Menarche Age"
                    value={formData.menarche_age}
                    onChangeText={text =>
                      setFormData(prev => ({...prev, menarche_age: text}))
                    }
                  />
                </View>
                <View>
                  <Text style={styles.modalText}>Lmp</Text>
                  <TextInput
                    style={styles.filterinput}
                    placeholder="Lmp"
                    value={formData.lmp}
                    onChangeText={text =>
                      setFormData(prev => ({...prev, lmp: text}))
                    }
                  />
                </View>
                <View>
                  <Text style={styles.modalText}>Periods</Text>
                  <View style={{flexDirection: 'row', gap: 12}}>
                    <TouchableOpacity
                      style={[
                        styles.segButton,
                        formData.periods === 'Regular' && styles.selectedButton,
                      ]}
                      onPress={() =>
                        setFormData(prev => ({...prev, periods: 'Regular'}))
                      }>
                      <Text style={styles.segText}>Regular</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.segButton,
                        formData.periods === 'Irregular' &&
                          styles.selectedButton,
                      ]}
                      onPress={() =>
                        setFormData(prev => ({...prev, periods: 'Irregular'}))
                      }>
                      <Text style={styles.segText}>Irregular</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View>
                  <Text style={styles.modalText}>Durations</Text>
                  <TextInput
                    style={styles.filterinput}
                    placeholder="Durations"
                    value={formData.durations}
                    onChangeText={text =>
                      setFormData(prev => ({...prev, durations: text}))
                    }
                  />
                </View>
                <View>
                  <Text style={styles.modalText}>Quality of Blood Flow</Text>
                  <View style={{flexDirection: 'row', gap: 12}}>
                    <TouchableOpacity
                      style={[
                        styles.segButton,
                        formData.qualityofbloodflow === 'Scanty' &&
                          styles.selectedButton,
                      ]}
                      onPress={() =>
                        setFormData(prev => ({
                          ...prev,
                          qualityofbloodflow: 'Scanty',
                        }))
                      }>
                      <Text style={styles.segText}>Scanty</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.segButton,
                        formData.qualityofbloodflow === 'Mod' &&
                          styles.selectedButton,
                      ]}
                      onPress={() =>
                        setFormData(prev => ({
                          ...prev,
                          qualityofbloodflow: 'Mod',
                        }))
                      }>
                      <Text style={styles.segText}>Mod</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.segButton,
                        formData.qualityofbloodflow === 'Heavy' &&
                          styles.selectedButton,
                      ]}
                      onPress={() =>
                        setFormData(prev => ({
                          ...prev,
                          qualityofbloodflow: 'Heavy',
                        }))
                      }>
                      <Text style={styles.segText}>Heavy</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View>
                  <Text style={styles.modalText}>Pain during Cycle</Text>
                  <View style={{flexDirection: 'row', gap: 12}}>
                    <TouchableOpacity
                      style={[
                        styles.segButton,
                        formData.painduringcycle === 'yes' &&
                          styles.selectedButton,
                      ]}
                      onPress={() =>
                        setFormData(prev => ({...prev, painduringcycle: 'yes'}))
                      }>
                      <Text style={styles.segText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.segButton,
                        formData.painduringcycle === 'no' &&
                          styles.selectedButton,
                      ]}
                      onPress={() =>
                        setFormData(prev => ({...prev, painduringcycle: 'no'}))
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
                    value={formData.menopause}
                    onChangeText={text =>
                      setFormData(prev => ({...prev, menopause: text}))
                    }
                  />
                </View>
                <View>
                  <Text style={styles.modalText}>From Date</Text>
                  <TouchableOpacity
                    style={[styles.segButton, {flexDirection: 'row', gap: 20}]}
                    onPress={() => setOpen(true)}>
                    <Text style={styles.segText}>
                      {formData.from_date || 'Select Date'}
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
                        setFormData(prev => ({
                          ...prev,
                          from_date: formattedDate,
                        }));
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
                <View>
                  <Text style={styles.modalText}>OPD Time</Text>
                  <TouchableOpacity
                    style={[styles.segButton, {flexDirection: 'row', gap: 20}]}
                    onPress={() => setOpenTime(true)}>
                    <Text style={styles.segText}>
                      {formData.opd_time || 'Select Time'}
                    </Text>
                    <DatePicker
                      modal
                      mode="time"
                      open={openTime}
                      date={new Date()}
                      onConfirm={selectedTime => {
                        setOpenTime(false);
                        const formattedTime = selectedTime.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        });
                        setFormData(prev => ({
                          ...prev,
                          opd_time: formattedTime,
                        }));
                      }}
                      onCancel={() => {
                        setOpenTime(false);
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faCalendarDays}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
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
        </View>
      )}
    </>
  );
};

export default Editmenstrualhistory;

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
