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
import React, {useState, useEffect, useRef} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import {Modal} from 'react-native-paper';
import axios from 'axios';
import {addopdassessment} from '../../api/api';
import {Formik} from 'formik';

const Editadvice = ({route}) => {
  const navigation = useNavigation();
  const formikRef = useRef(null);
  const {data, userData, selectedPatient} = route?.params;

  // input state ...
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Initialize form data with the passed data
  const [formData, setFormData] = useState({
    opdtemplate_text: data?.opdtemplate_text || '',
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

  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  // Update patient advice
  const updatePatientAdvice = async (values) => {
    const data = {
      hospital_id: userData?.hospital_id,
      reception_id: userData?._id,
      opdadvicehistoryarray: [{
        ...formData,
        opdtemplate_text: values.opdtemplate_text
      }],
      api_type: 'OPD-ADVICE',
      uhid: selectedPatient?.patientuniqueno,
      mobilenumber: selectedPatient?.mobilenumber,
      patient_id: selectedPatient?.patient_id,
      appoint_id: selectedPatient?.appoint_id,
    };

    try {
      await axios.post(addopdassessment, data).then(res => {
        if (res.data.status === true) {
          Alert.alert('Success !!', 'Advice Updated Successfully');
          navigation.goBack();
        } else {
          Alert.alert('Error !!', 'Advice Not Updated');
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
          <Text style={styles.navbarText}>Edit Advice</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <ScrollView
          style={{marginBottom: 70}}
          vertical
          showsVerticalScrollIndicator={false}>
          {/* Current Advice Details */}
          <View style={styles.categoryDiv}>
            <Text style={styles.categoryText}>Current Advice Details</Text>
            <View style={styles.sympDiv}>
              <View style={styles.sympDivOuter}>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Advice</Text>
                  <Text>{formData.opdtemplate_text}</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.loginButton}>
          <TouchableOpacity
            style={[styles.buttonDiv, {backgroundColor: '#1b55f5'}]}
            onPress={toggleModal}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Edit Advice Modal */}
        <Modal
          visible={isModalVisible}
          onDismiss={toggleModal}
          contentContainerStyle={styles.bottomModalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalContentHeader}>
              <Text style={[styles.modalText, {marginBottom: 0, fontSize: 18}]}>
                Edit Advice
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
            <Formik
              innerRef={formikRef}
              initialValues={{
                opdtemplate_text: formData.opdtemplate_text,
              }}
              onSubmit={(values, {resetForm}) => {
                updatePatientAdvice(values);
                toggleModal();
                resetForm();
              }}>
              {({handleBlur, handleSubmit, values, setFieldValue}) => {
                return (
                  <>
                    <View style={styles.modalDiv}>
                      <Text style={styles.modalText}>Advice</Text>
                      <TextInput
                        style={styles.filterinput}
                        placeholder="Enter Advice"
                        value={values.opdtemplate_text}
                        onChangeText={text => {
                          setFieldValue('opdtemplate_text', text);
                        }}
                        onBlur={handleBlur('opdtemplate_text')}
                        multiline
                        numberOfLines={4}
                      />
                    </View>

                    <TouchableOpacity
                      onPress={handleSubmit}
                      style={[styles.closeButton1, {backgroundColor: '#5cd65c'}]}>
                      <Text style={styles.buttonText}>Update</Text>
                    </TouchableOpacity>
                  </>
                );
              }}
            </Formik>
          </View>
        </Modal>
      </View>
    </>
  );
};

export default Editadvice;

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
    padding: 10,
    paddingHorizontal: 12,
    borderColor: '#e6e6e6',
    borderWidth: 1.4,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    marginBottom: 6,
    width: '100%',
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
    flexDirection: 'column',
    gap: 4,
    width: '100%',
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