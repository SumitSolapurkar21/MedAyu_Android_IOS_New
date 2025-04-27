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

const Editobstetricshistory = ({route}) => {
  const navigation = useNavigation();
  const {data, userData, selectedPatient} = route?.params || {};

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    g: data?.g || '',
    p: data?.p || '',
    l: data?.l || '',
    a: data?.a || '',
    d: data?.d || '',
    pregnant: data?.pregnant || '',
    breastFeeding: data?.breastFeeding || '',
    conception: data?.conception || '',
    contraception: data?.contraception || '',
    pillsChecked: data?.pillsChecked || '',
    injuctionChecked: data?.injuctionChecked || '',
    otherChecked: data?.otherChecked || '',
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

  // Update patient obstetrics history
  const updatePatientObstetricsHistory = async () => {
    const data = {
      hospital_id: userData?.hospital_id,
      reception_id: userData?._id,
      opdobstetricshistoryarray: [formData],
      api_type: 'OPD-OBSTETRICS-HISTORY',
      uhid: selectedPatient?.patientuniqueno,
      mobilenumber: selectedPatient?.mobilenumber,
      patient_id: selectedPatient?.patient_id,
      appoint_id: selectedPatient?.appoint_id,
    };
    try {
      await axios.post(addopdassessment, data).then(res => {
        if (res.data.status === true) {
          Alert.alert('Success !!', 'Obstetrics History Updated Successfully');
          navigation.goBack();
        } else {
          Alert.alert('Error !!', 'Obstetrics History Not Updated');
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
          <Text style={styles.navbarText}>Edit Obstetrics History</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <ScrollView style={{marginBottom: 100}} vertical showsVerticalScrollIndicator={false}>
          {/* Current Obstetrics History Details */}
          <View style={styles.categoryDiv}>
            <Text style={styles.categoryText}>Current Obstetrics History Details</Text>
            <View style={styles.sympDiv}>
              <View style={styles.sympDivOuter}>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>G / P / L / A / D</Text>
                  <Text>{formData.g} / {formData.p} / {formData.l} / {formData.a} / {formData.d}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Pregnant</Text>
                  <Text>{formData.pregnant}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Breast Feeding</Text>
                  <Text>{formData.breastFeeding}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Planning to Conceive</Text>
                  <Text>{formData.conception}</Text>
                </View>
                <View style={styles.sympDivInner}>
                  <Text style={styles.label}>Contraception</Text>
                  <Text>
                    {formData.contraception === 'no'
                      ? formData.contraception
                      : formData.contraception +
                        ' - ' +
                        formData.pillsChecked +
                        ' , ' +
                        formData.injuctionChecked +
                        ' , ' +
                        formData.otherChecked}
                  </Text>
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
          <TouchableOpacity style={[styles.buttonDiv, {backgroundColor: '#1b55f5'}]} onPress={updatePatientObstetricsHistory}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
        {/* Edit Modal */}
        <Modal visible={isModalVisible} onDismiss={() => setIsModalVisible(false)} contentContainerStyle={styles.bottomModalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalContentHeader}>
              <Text style={[styles.modalText, {marginBottom: 0, fontSize: 18}]}>Edit Obstetrics History</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton1}>
                <FontAwesomeIcon icon={faXmark} color="#FF3B30" style={styles.icon} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={styles.modalDiv}>
                <View>
                  <Text style={styles.modalText}>G</Text>
                  <TextInput
                    style={styles.filterinput}
                    placeholder="G"
                    value={formData.g}
                    onChangeText={text => setFormData(prev => ({...prev, g: text}))}
                  />
                </View>
                <View>
                  <Text style={styles.modalText}>P</Text>
                  <TextInput
                    style={styles.filterinput}
                    placeholder="P"
                    value={formData.p}
                    onChangeText={text => setFormData(prev => ({...prev, p: text}))}
                  />
                </View>
                <View>
                  <Text style={styles.modalText}>L</Text>
                  <TextInput
                    style={styles.filterinput}
                    placeholder="L"
                    value={formData.l}
                    onChangeText={text => setFormData(prev => ({...prev, l: text}))}
                  />
                </View>
                <View>
                  <Text style={styles.modalText}>A</Text>
                  <TextInput
                    style={styles.filterinput}
                    placeholder="A"
                    value={formData.a}
                    onChangeText={text => setFormData(prev => ({...prev, a: text}))}
                  />
                </View>
                <View>
                  <Text style={styles.modalText}>D</Text>
                  <TextInput
                    style={styles.filterinput}
                    placeholder="D"
                    value={formData.d}
                    onChangeText={text => setFormData(prev => ({...prev, d: text}))}
                  />
                </View>
                <View>
                  <Text style={styles.modalText}>Pregnant</Text>
                  <View style={{flexDirection: 'row', gap: 12}}>
                    <TouchableOpacity
                      style={[styles.segButton, formData.pregnant === 'yes' && styles.selectedButton]}
                      onPress={() => setFormData(prev => ({...prev, pregnant: 'yes'}))}>
                      <Text style={styles.segText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.segButton, formData.pregnant === 'no' && styles.selectedButton]}
                      onPress={() => setFormData(prev => ({...prev, pregnant: 'no'}))}>
                      <Text style={styles.segText}>No</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View>
                  <Text style={styles.modalText}>Breast Feeding</Text>
                  <View style={{flexDirection: 'row', gap: 12}}>
                    <TouchableOpacity
                      style={[styles.segButton, formData.breastFeeding === 'yes' && styles.selectedButton]}
                      onPress={() => setFormData(prev => ({...prev, breastFeeding: 'yes'}))}>
                      <Text style={styles.segText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.segButton, formData.breastFeeding === 'no' && styles.selectedButton]}
                      onPress={() => setFormData(prev => ({...prev, breastFeeding: 'no'}))}>
                      <Text style={styles.segText}>No</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View>
                  <Text style={styles.modalText}>Planning to Conceive</Text>
                  <View style={{flexDirection: 'row', gap: 12}}>
                    <TouchableOpacity
                      style={[styles.segButton, formData.conception === 'yes' && styles.selectedButton]}
                      onPress={() => setFormData(prev => ({...prev, conception: 'yes'}))}>
                      <Text style={styles.segText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.segButton, formData.conception === 'no' && styles.selectedButton]}
                      onPress={() => setFormData(prev => ({...prev, conception: 'no'}))}>
                      <Text style={styles.segText}>No</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View>
                  <Text style={styles.modalText}>Contraception</Text>
                  <View style={{flexDirection: 'row', gap: 12}}>
                    <TouchableOpacity
                      style={[styles.segButton, formData.contraception === 'yes' && styles.selectedButton]}
                      onPress={() => setFormData(prev => ({...prev, contraception: 'yes'}))}>
                      <Text style={styles.segText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.segButton, formData.contraception === 'no' && styles.selectedButton]}
                      onPress={() => setFormData(prev => ({...prev, contraception: 'no', pillsChecked: '', injuctionChecked: '', otherChecked: ''}))}>
                      <Text style={styles.segText}>No</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {formData.contraception === 'yes' && (
                  <View style={{flexDirection: 'row', gap: 12, marginTop: 10}}>
                    <TouchableOpacity
                      style={[styles.segButton, formData.pillsChecked === 'Pills' && styles.selectedButton]}
                      onPress={() => setFormData(prev => ({...prev, pillsChecked: prev.pillsChecked === 'Pills' ? '' : 'Pills'}))}>
                      <Text style={styles.segText}>Pills</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.segButton, formData.injuctionChecked === 'Injection' && styles.selectedButton]}
                      onPress={() => setFormData(prev => ({...prev, injuctionChecked: prev.injuctionChecked === 'Injection' ? '' : 'Injection'}))}>
                      <Text style={styles.segText}>Injection</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.segButton, formData.otherChecked === 'Other' && styles.selectedButton]}
                      onPress={() => setFormData(prev => ({...prev, otherChecked: prev.otherChecked === 'Other' ? '' : 'Other'}))}>
                      <Text style={styles.segText}>Other</Text>
                    </TouchableOpacity>
                  </View>
                )}
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

export default Editobstetricshistory;

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
    padding: 4,
    paddingHorizontal: 16,
    borderColor: '#e6e6e6',
    borderWidth: 1.4,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    marginBottom: 6,
    minWidth: 60,
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