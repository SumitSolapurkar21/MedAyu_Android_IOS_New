import {
  Alert,
  BackHandler,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
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

const Editpersonalhistory = ({route}) => {
  const navigation = useNavigation();
  const {data, userData, selectedPatient} = route?.params || {};

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    Tea: data?.Tea || '',
    Coffee: data?.Coffee || '',
    Tobacco: data?.Tobacco || '',
    Smoking: data?.Smoking || '',
    Alcohol: data?.Alcohol || '',
    Drugs: data?.Drugs || '',
    Exercise: data?.Exercise || '',
    Softdrink: data?.Softdrink || '',
    Saltyfood: data?.Saltyfood || '',
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

  // Update patient personal history
  const updatePatientPersonalHistory = async () => {
    const data = {
      hospital_id: userData?.hospital_id,
      reception_id: userData?._id,
      opdpersonalhistoryarray: [formData],
      api_type: 'OPD-PERSONAL-HISTORY',
      uhid: selectedPatient?.patientuniqueno,
      mobilenumber: selectedPatient?.mobilenumber,
      patient_id: selectedPatient?.patient_id,
      appoint_id: selectedPatient?.appoint_id,
    };
    try {
      await axios.post(addopdassessment, data).then(res => {
        if (res.data.status === true) {
          Alert.alert('Success !!', 'Personal History Updated Successfully');
          navigation.goBack();
        } else {
          Alert.alert('Error !!', 'Personal History Not Updated');
        }
      });
    } catch (error) {
      Alert.alert('Error !!', error);
    }
  };

  // Segmented button options
  const levels = ['None', 'Light', 'Moderate', 'Heavy'];
  const habits = [
    {label: 'Tea', field: 'Tea'},
    {label: 'Coffee', field: 'Coffee'},
    {label: 'Tobacco', field: 'Tobacco'},
    {label: 'Smoking', field: 'Smoking'},
    {label: 'Alcohol', field: 'Alcohol'},
    {label: 'Drugs', field: 'Drugs'},
    {label: 'Exercise', field: 'Exercise'},
    {label: 'Soft Drinks', field: 'Softdrink'},
    {label: 'Salty Food', field: 'Saltyfood'},
  ];

  return (
    <>
      <StatusBar style={styles.StatusBar} animated={false} backgroundColor="#ffffff" />
      {/* Header */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.navbarText}>Edit Personal History</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <ScrollView style={{marginBottom: 100}} vertical showsVerticalScrollIndicator={false}>
          {/* Current Personal History Details */}
          <View style={styles.categoryDiv}>
            <Text style={styles.categoryText}>Current Personal History Details</Text>
            <View style={styles.sympDiv}>
              <View style={styles.sympDivOuter}>
                {habits.map(habit => (
                  <View style={styles.sympDivInner} key={habit.field}>
                    <Text style={styles.label}>{habit.label}</Text>
                    <Text>{formData[habit.field]}</Text>
                  </View>
                ))}
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
          <TouchableOpacity style={[styles.buttonDiv, {backgroundColor: '#1b55f5'}]} onPress={updatePatientPersonalHistory}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
        {/* Edit Modal */}
        <Modal visible={isModalVisible} onDismiss={() => setIsModalVisible(false)} contentContainerStyle={styles.bottomModalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalContentHeader}>
              <Text style={[styles.modalText, {marginBottom: 0, fontSize: 18}]}>Edit Personal History</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton1}>
                <FontAwesomeIcon icon={faXmark} color="#FF3B30" style={styles.icon} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {habits.map(habit => (
                <View style={styles.modalDiv} key={habit.field}>
                  <Text style={styles.modalText}>{habit.label}</Text>
                  <View style={styles.modalDivCategory}>
                    {levels.map(level => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.segButton,
                          formData[habit.field] === level && styles.selectedButton,
                        ]}
                        onPress={() => setFormData(prev => ({...prev, [habit.field]: level}))}
                      >
                        <Text style={styles.segText}>{level}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
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

export default Editpersonalhistory;

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
    padding: 10,
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
  modalDivCategory: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
});