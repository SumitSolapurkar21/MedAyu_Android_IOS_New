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
import {addopdassessment, fetchmedicines} from '../../api/api';
import DatePicker from 'react-native-date-picker';

const Editmedicinehistory = ({route}) => {
  const navigation = useNavigation();
  const {data, userData, selectedPatient} = route?.params || {};

  // input state ...
  const [medicineSearchInput, setMedicineSearchInput] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [dose, setDose] = useState('');
  const [routeValue, setRouteValue] = useState('');
  const [schedule, setSchedule] = useState('');
  const [years, setYears] = useState('');
  const [months, setMonths] = useState('');
  const [days, setDays] = useState('');
  const [fromDate, setFromDate] = useState('');

  // array state ...
  const [medicineArray, setMedicineArray] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(true);
  const [open, setOpen] = useState(false);

  // Initialize form data with the passed data
  const [formData, setFormData] = useState({
    drugname: data?.drugname || '',
    dose: data?.dose || '',
    route: data?.route || '',
    schedule: data?.schedule || '',
    years: data?.years || '',
    months: data?.months || '',
    days: data?.days || '',
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

  // fetch medicines handler
  useEffect(() => {
    if (medicineSearchInput) {
      fetchMedicinesHandler();
    }
  }, [medicineSearchInput]);

  const fetchMedicinesHandler = async () => {
    try {
      const __data = {
        hospital_id: userData?.hospital_id,
        reception_id: userData?._id,
        text: medicineSearchInput,
      };
      await axios.post(fetchmedicines, __data).then(res => {
        const {data, message} = res.data;
        if (data.length > 0) {
          setMedicineArray(data);
        } else {
          Alert.alert('Error !!', message);
        }
      });
    } catch (error) {
      Alert.alert('Error !!', error);
    }
  };

  const calculateDateDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();
    if (days < 0) {
      months -= 1;
      days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    return {years, months, days};
  };

  // Update form data
  const updateFormData = () => {
    const updatedData = {
      drugname: selectedMedicine || formData.drugname,
      dose: dose || formData.dose,
      route: routeValue || formData.route,
      schedule: schedule || formData.schedule,
      years: years || formData.years,
      months: months || formData.months,
      days: days || formData.days,
      from_date: fromDate || formData.from_date,
    };
    setFormData(updatedData);
    setIsModalVisible(false);
  };

  // Update patient medicine history
  const updatePatientMedicineHistory = async () => {
    const data = {
      hospital_id: userData?.hospital_id,
      reception_id: userData?._id,
      opdmedicinehistoryarray: [formData],
      api_type: 'OPD-MEDICINE-HISTORY',
      uhid: selectedPatient?.patientuniqueno,
      mobilenumber: selectedPatient?.mobilenumber,
      patient_id: selectedPatient?.patient_id,
      appoint_id: selectedPatient?.appoint_id,
    };
    try {
      await axios.post(addopdassessment, data).then(res => {
        if (res.data.status === true) {
          Alert.alert('Success !!', 'Medicine History Updated Successfully');
          navigation.goBack();
        } else {
          Alert.alert('Error !!', 'Medicine History Not Updated');
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
          <Text style={styles.navbarText}>Edit Medicine History</Text>
        </TouchableOpacity>
      </View>

      {!isModalVisible ? (
        <View style={styles.container}>
          <ScrollView
            style={{marginBottom: 100}}
            vertical
            showsVerticalScrollIndicator={false}>
            {/* Current Medicine History Details */}
            <View style={styles.categoryDiv}>
              <Text style={styles.categoryText}>
                Current Medicine History Details
              </Text>
              <View style={styles.sympDiv}>
                <View style={styles.sympDivOuter}>
                  <View style={styles.sympDivInner}>
                    <Text style={styles.label}>Drug Name</Text>
                    <Text>{formData.drugname}</Text>
                  </View>
                  <View style={styles.sympDivInner}>
                    <Text style={styles.label}>Dose</Text>
                    <Text>{formData.dose}</Text>
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
                    <Text style={styles.label}>From Date</Text>
                    <Text>{formData.from_date}</Text>
                  </View>
                  <View style={styles.sympDivInner}>
                    <Text style={styles.label}>Years</Text>
                    <Text>{formData.years}</Text>
                  </View>
                  <View style={styles.sympDivInner}>
                    <Text style={styles.label}>Months</Text>
                    <Text>{formData.months}</Text>
                  </View>
                  <View style={styles.sympDivInner}>
                    <Text style={styles.label}>Days</Text>
                    <Text>{formData.days}</Text>
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
              onPress={updatePatientMedicineHistory}>
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
                Edit Medicine History
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
            <View>
              <Text style={styles.modalText}>Drug Name</Text>
              <TextInput
                style={styles.filterinput}
                placeholder="Search Medicine"
                value={medicineSearchInput}
                onChangeText={text => setMedicineSearchInput(text)}
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{marginBottom: 10}}>
                <View style={styles.catDiv}>
                  {medicineArray?.length > 0 &&
                    medicineArray.map((item, index) => (
                      <TouchableOpacity
                        onPress={() => setSelectedMedicine(item.drugname)}
                        key={index}
                        style={[
                          styles.segButton,
                          selectedMedicine === item.drugname &&
                            styles.selectedButton,
                        ]}>
                        <Text style={styles.segText}>{item.drugname}</Text>
                      </TouchableOpacity>
                    ))}
                </View>
              </ScrollView>
            </View>
            <View style={styles.modalDiv}>
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
                <Text style={styles.modalText}>From Date</Text>
                <TouchableOpacity
                  style={[styles.segButton, {flexDirection: 'row', gap: 20}]}
                  onPress={() => setOpen(true)}>
                  <Text style={styles.segText}>
                    {fromDate || 'Select Date'}
                  </Text>
                  <DatePicker
                    modal
                    mode="date"
                    open={open}
                    date={new Date()}
                    onConfirm={selectedDate => {
                      setOpen(false);
                      const formattedDate = selectedDate.toLocaleDateString(
                        'en-US',
                        {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        },
                      );
                      setFromDate(formattedDate);
                      const {years, months, days} = calculateDateDifference(
                        selectedDate,
                        new Date(),
                      );
                      setYears(years.toString());
                      setMonths(months.toString());
                      setDays(days.toString());
                    }}
                    onCancel={() => {
                      setOpen(false);
                    }}
                  />
                  <FontAwesomeIcon icon={faCalendarDays} style={styles.icon} />
                </TouchableOpacity>
              </View>
              <View>
                <Text style={styles.modalText}>Years</Text>
                <TextInput
                  keyboardType="numeric"
                  style={styles.filterinput}
                  placeholder="Years"
                  value={years}
                  onChangeText={text => setYears(text)}
                />
              </View>
              <View>
                <Text style={styles.modalText}>Months</Text>
                <TextInput
                  keyboardType="numeric"
                  style={styles.filterinput}
                  placeholder="Months"
                  value={months}
                  onChangeText={text => setMonths(text)}
                />
              </View>
              <View>
                <Text style={styles.modalText}>Days</Text>
                <TextInput
                  keyboardType="numeric"
                  style={styles.filterinput}
                  placeholder="Days"
                  value={days}
                  onChangeText={text => setDays(text)}
                />
              </View>
            </View>
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

export default Editmedicinehistory;

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
