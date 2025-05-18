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

const Editgeneralexamination = ({route}) => {
  const navigation = useNavigation();
  const {data, userData, selectedPatient} = route?.params || {};

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(true);

  // Form state (use 'Present'/'Absent' for all fields)
  const [formData, setFormData] = useState({
    pallor:
      data?.pallor === 'present'
        ? 'Present'
        : data?.pallor === 'absent'
        ? 'Absent'
        : data?.pallor || '',
    cyanosis:
      data?.cyanosis === 'present'
        ? 'Present'
        : data?.cyanosis === 'absent'
        ? 'Absent'
        : data?.cyanosis || '',
    icterus:
      data?.icterus === 'present'
        ? 'Present'
        : data?.icterus === 'absent'
        ? 'Absent'
        : data?.icterus || '',
    ln:
      data?.ln === 'present'
        ? 'Present'
        : data?.ln === 'absent'
        ? 'Absent'
        : data?.ln || '',
    odema:
      data?.odema === 'present'
        ? 'Present'
        : data?.odema === 'absent'
        ? 'Absent'
        : data?.odema || '',
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

  // Update patient general examination history
  const updatePatientGeneralExaminationHistory = async () => {
    // Convert all values to lowercase for API consistency
    const apiData = {
      ...formData,
      pallor: formData.pallor.toLowerCase(),
      cyanosis: formData.cyanosis.toLowerCase(),
      icterus: formData.icterus.toLowerCase(),
      ln: formData.ln.toLowerCase(),
      odema: formData.odema.toLowerCase(),
    };
    const data = {
      hospital_id: userData?.hospital_id,
      reception_id: userData?._id,
      opdgeneralexaminationhistoryarray: [apiData],
      api_type: 'OPD-GENERAL-EXAMINATION',
      uhid: selectedPatient?.patientuniqueno,
      mobilenumber: selectedPatient?.mobilenumber,
      patient_id: selectedPatient?.patient_id,
      appoint_id: selectedPatient?.appoint_id,
    };
    try {
      await axios.post(addopdassessment, data).then(res => {
        if (res.data.status === true) {
          Alert.alert('Success !!', 'General Examination Updated Successfully');
          navigation.goBack();
        } else {
          Alert.alert('Error !!', 'General Examination Not Updated');
        }
      });
    } catch (error) {
      Alert.alert('Error !!', error);
    }
  };

  const fields = [
    {label: 'Pallor', field: 'pallor'},
    {label: 'Cyanosis', field: 'cyanosis'},
    {label: 'Icterus', field: 'icterus'},
    {label: 'Ln', field: 'ln'},
    {label: 'Odema', field: 'odema'},
  ];

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
          <Text style={styles.navbarText}>Edit General Examination</Text>
        </TouchableOpacity>
      </View>

      {!isModalVisible ? (
        <View style={styles.container}>
          <ScrollView
            style={{marginBottom: 100}}
            vertical
            showsVerticalScrollIndicator={false}>
            {/* Current General Examination Details */}
            <View style={styles.categoryDiv}>
              <Text style={styles.categoryText}>
                Current General Examination Details
              </Text>
              <View style={styles.sympDiv}>
                <View style={styles.sympDivOuter}>
                  {fields.map(f => (
                    <View style={styles.sympDivInner} key={f.field}>
                      <Text style={styles.label}>{f.label}</Text>
                      <Text>{formData[f.field]}</Text>
                    </View>
                  ))}
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
              onPress={updatePatientGeneralExaminationHistory}>
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
                Edit General Examination
              </Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}>
                <FontAwesomeIcon
                  icon={faXmark}
                  color="#FF3B30"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={styles.modalDiv}>
                {fields.map(f => (
                  <View key={f.field} style={{marginBottom: 10}}>
                    <Text style={styles.modalText}>{f.label}</Text>
                    <View style={{flexDirection: 'row', gap: 8}}>
                      <TouchableOpacity
                        style={[
                          styles.segButton,
                          formData[f.field] === 'Present' &&
                            styles.selectedButton,
                        ]}
                        onPress={() =>
                          setFormData(prev => ({...prev, [f.field]: 'Present'}))
                        }>
                        <Text style={styles.segText}>Present</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.segButton,
                          formData[f.field] === 'Absent' &&
                            styles.selectedButton,
                        ]}
                        onPress={() =>
                          setFormData(prev => ({...prev, [f.field]: 'Absent'}))
                        }>
                        <Text style={styles.segText}>Absent</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
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

export default Editgeneralexamination;

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
    padding: 10,
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
    backgroundColor: '#FF3B30',
    padding: 6,
    borderRadius: 6,
    marginTop: 20,
    width: 80,
    alignSelf: 'flex-end',
    borderColor: '#e6e6e6',
    borderWidth: 1,
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
    gap: 12,
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
  closeButton: {
    padding: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'red',
  },
});
