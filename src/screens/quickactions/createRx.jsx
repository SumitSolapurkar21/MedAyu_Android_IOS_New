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
import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft, faUserPlus} from '@fortawesome/free-solid-svg-icons';
import {faCirclePlus} from '@fortawesome/free-solid-svg-icons/faCirclePlus';
import UserContext from '../../functions/usercontext';
import axios from 'axios';
import {getappointmentapi} from '../../api/api';

const CreateRx = () => {
  const navigation = useNavigation();
  const {selectedPatient, setSelectedPatient, userData} =
    useContext(UserContext);

  //backHandler ...
  useEffect(() => {
    const backAction = () => {
      setSelectedPatient([]);
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const prescriptionType = [
    {id: 1, prescription: 'Complaints', page: 'Complaints'},
    {id: 2, prescription: 'Past History', page: 'Pasthistory'},
    {id: 3, prescription: 'Family History', page: 'Familyhistory'},
    {id: 4, prescription: 'Medicine History', page: 'Medicinehistory'},
    {id: 5, prescription: 'Personal History', page: 'Personalhistory'},
    {id: 6, prescription: 'Obstetrics History', page: 'Obstetricshistory'},
    {id: 7, prescription: 'Menstrual History', page: 'Menstrualhistory'},
    {id: 8, prescription: 'Vitals', page: 'Vitals'},
    {id: 9, prescription: 'General Examination', page: 'Generalexamination'},
    {id: 10, prescription: 'Systemic Examination', page: 'SystemicExamination'},
    {id: 11, prescription: 'Diagnosis', page: 'Diagnosis'},
    //     {id: 12, prescription: 'Plan of Care', page: 'Planofcare'},
    {id: 13, prescription: 'Treatment', page: 'Treatment'},
    //     {id: 14, prescription: 'Procedure', page: 'Procedure'},
    {id: 15, prescription: 'Advice', page: 'Advice'},
    {id: 16, prescription: 'Follow Up Date', page: 'Followupdate'},
  ];

  const prescriptionAyurvedicType = [
    {id: 1, prescription: 'Ashtvidh Pariksha', page: 'AshtvidhPariksha'},
    {id: 2, prescription: 'Dashavidh Pariksha', page: 'DashavidhPariksha'},
    {id: 3, prescription: 'Samprapti', page: 'Samprapti'},
    {id: 4, prescription: 'Srotas Pariksha', page: 'SrotasPariksha'},
    {id: 5, prescription: 'Prakruti', page: 'Prakruti'},
  ];

  const [prescriptionCategory, setPrescriptionCategory] = useState('Medical');

  const formattedDate =
    new Date()
      .toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      })
      .replace(',', '') + ' (India Standard Time)';

  useEffect(() => {
    if (selectedPatient?.reception_id !== '') {
      getSelectedPatientAppointHandler();
    }
  }, [selectedPatient]);

  // get slected patient appointment
  const getSelectedPatientAppointHandler = async () => {
    const __data = {
      depart_id: userData?.depart_id,
      reception_id: userData?._id,
      fromdate: formattedDate,
      todate: formattedDate,
      status: 'Confirmed',
    };
    try {
      await axios.post(getappointmentapi, __data).then(res => {
        const {data} = res.data;
        if (data.length > 0) {
          console.log(selectedPatient);
        }
      });
    } catch (error) {
      Alert.alert('Error !!', error);
    }
  };

  // navigation handler ...
  const navigationHandler = page => {
    if (selectedPatient?._id) {
      navigation.navigate(page);
    } else {
      Alert.alert('Warning', 'Please select patient');
    }
  };

  return (
    <>
      {/* Status Bar */}
      <StatusBar
        style={styles.StatusBar}
        animated={false}
        backgroundColor="#ffffff"
      />
      <View style={styles.navbar}>
        <TouchableOpacity
          onPress={() => {
            navigation.replace('Doctorhomepage'), setSelectedPatient([]);
          }}>
          <FontAwesomeIcon icon={faArrowLeft} style={styles.icon} />
        </TouchableOpacity>
        {selectedPatient && selectedPatient.length === 0 && (
          <TouchableOpacity
            style={styles.navbarGrp}
            onPress={() => navigation.replace('Upcommingappointments')}>
            <Text style={styles.navbarText}>Select Patient</Text>
            <FontAwesomeIcon icon={faUserPlus} style={styles.icon} />
          </TouchableOpacity>
        )}
        {selectedPatient && (
          <View style={styles.navbarGrp2}>
            <Text style={styles.navbarText2}>{selectedPatient?.firstname}</Text>
            <Text style={styles.navbarText2}>
              {selectedPatient?.mobilenumber}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.container}>
        <View style={styles.prescriptionCategory}>
          <TouchableOpacity
            style={[
              styles.prescriptionCategoryButton,
              prescriptionCategory === 'Medical' && styles.activeButton,
            ]}
            onPress={() => setPrescriptionCategory('Medical')}>
            <Text style={styles.prescriptionCategoryText}>Medical</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.prescriptionCategoryButton,
              prescriptionCategory === 'Ayurvedic' && styles.activeButton,
            ]}
            onPress={() => setPrescriptionCategory('Ayurvedic')}>
            <Text style={styles.prescriptionCategoryText}>Ayurvedic</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          vertical
          style={styles.body}>
          {prescriptionCategory === 'Medical'
            ? prescriptionType &&
              prescriptionType?.map(prescription => {
                return (
                  <TouchableOpacity
                    style={styles.bodyDiv}
                    key={prescription.id}
                    onPress={() => navigationHandler(`${prescription.page}`)}>
                    <Text style={styles.bodyText}>
                      {prescription.prescription}
                    </Text>
                    <FontAwesomeIcon
                      icon={faCirclePlus}
                      color="#cc99ff"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                );
              })
            : prescriptionAyurvedicType &&
              prescriptionAyurvedicType?.map(prescription => {
                return (
                  <TouchableOpacity
                    style={styles.bodyDiv}
                    key={prescription.id}
                    onPress={() => navigationHandler(`${prescription.page}`)}>
                    <Text style={styles.bodyText}>
                      {prescription.prescription}
                    </Text>
                    <FontAwesomeIcon
                      icon={faCirclePlus}
                      color="#cc99ff"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                );
              })}
        </ScrollView>
      </View>
    </>
  );
};

export default CreateRx;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  navbar: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderBottomColor: '#dcdcde',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 18,
  },
  navbarGrp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  body: {backgroundColor: '#ffffff'},
  bodyDiv: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 0.6,
    borderBottomColor: 'lightgrey',
  },
  bodyText: {
    fontWeight: '500',
    letterSpacing: 1,
    color: '#000000',
  },
  navbarText2: {
    fontWeight: '500',
    letterSpacing: 1,
  },
  buttonDiv: {
    alignSelf: 'center',
    padding: 10,
    marginTop: 5,
  },
  button: {
    padding: 10,
    backgroundColor: '#4d4dff',
    borderRadius: 4,
  },
  buttonText: {
    color: '#ffffff',
    letterSpacing: 1,
  },
  prescriptionCategory: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 16,
    gap: 10,
  },
  prescriptionCategoryButton: {
    padding: 10,
    borderRadius: 6,
    width: '40%',
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  prescriptionCategoryText: {
    color: '#000000',
    letterSpacing: 1,
    textAlign: 'center',
    fontWeight: '500',
  },
  activeButton: {
    backgroundColor: '#f0f0f0',
    borderColor: '#f0f0f0',
  },
});
