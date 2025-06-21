import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faAngleDown,
  faAngleUp,
  faArrowLeft,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {RadioButton} from 'react-native-paper';
import UserContext from '../../../functions/usercontext';
import {addopdassessment} from '../../../api/api';
import axios from 'axios';

const Samprapti = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    dosha: '',
    dusya: '',
    srotas: '',
    mala: '',
    adhistana: '',
    srotodusthi: '',
    sadhyasadhyatwa: '',
  });

  // Section collapse states
  const [collapsedosha, setCollapsedosha] = useState(false);
  const [collapsedusya, setCollassedusya] = useState(false);
  const [collapsesrotas, setCollapsesrotas] = useState(false);
  const [collapsemala, setCollapsemala] = useState(false);
  const [collapseadhistana, setCollapseadhistana] = useState(false);
  const [collapsesrotodusthi, setCollapsesrotodusthi] = useState(false);
  const [collapsesadhyasadhyatwa, setCollapsesadhyasadhyatwa] = useState(false);

  const {userData, selectedPatient} = useContext(UserContext);
  const [patientSympyomsArray, setPatientSympyomsArray] = useState([]);

  const backAction = () => {
    navigation.goBack();
  };

  // add symptoms for patients .....
  const addPatientSymptomsToArrayHandler = () => {
    setPatientSympyomsArray(prevData => [...prevData, formData]);
  };

  // // submit complaints patient data ...
  const savePatientSymptoms = async () => {
    const data = {
      hospital_id: userData?.hospital_id,
      reception_id: userData?._id,
      sampraptiArray: patientSympyomsArray,
      api_type: 'OPD-Samprapti',

      // patient details below ...
      uhid: selectedPatient?.patientuniqueno,
      mobilenumber: selectedPatient?.mobilenumber,
      patient_id: selectedPatient?._id,
      appoint_id: selectedPatient?.appoint_id,
    };

    if (patientSympyomsArray?.length > 0) {
      try {
        await axios.post(addopdassessment, data).then(res => {
          if (res.data.status === true)
            return Alert.alert('Success !!', 'Samprapti Added Successfully');
          else Alert.alert('Error !!', 'Samprapti Not Added');
        });
      } catch (error) {
        Alert.alert('Error !!', error);
      }
      navigation.goBack();
    } else {
      Alert.alert('Warning !!', 'Add symptoms first');
    }
  };

  // Function to remove a symptom by index
  const removeSymptom = indexToRemove => {
    setPatientSympyomsArray(prevArray =>
      prevArray.filter((_, index) => index !== indexToRemove),
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={backAction}>
          <FontAwesomeIcon icon={faArrowLeft} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.navbarText}>Add Samprapti</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollviewStyle}>
        {/* Respiratory Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setCollapsedosha(!collapsedosha)}>
            <Text style={styles.title}>Dosha</Text>
            <FontAwesomeIcon icon={collapsedosha ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapsedosha && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Dosha</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      dosha: value,
                    }))
                  }
                  value={formData.dosha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Vata" />
                      <Text>Vata</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Pitta" />
                      <Text>Pitta</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Kapha" />
                      <Text>Kapha</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Vatapitta" />
                      <Text>Vatapitta</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Pittakapha" />
                      <Text>Pittakapha</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Tridosha" />
                      <Text>Tridosha</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setCollassedusya(!collapsedusya)}>
            <Text style={styles.title}>Dusya</Text>
            <FontAwesomeIcon icon={collapsedusya ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapsedusya && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Dusya</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      dusya: value,
                    }))
                  }
                  value={formData.dusya}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Rasa" />
                      <Text>Rasa</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Rakta" />
                      <Text>Rakta</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Mansa" />
                      <Text>Mansa</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Meda" />
                      <Text>Meda</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Asthi" />
                      <Text>Asthi</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Majja" />
                      <Text>Majja</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Shukra" />
                      <Text>Shukra</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </>
          )}
        </View>

        {/* Sarha Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setCollapsesrotas(!collapsesrotas)}>
            <Text style={styles.title}>Srotas</Text>
            <FontAwesomeIcon icon={collapsesrotas ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapsesrotas && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Srotas</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      srotas: value,
                    }))
                  }
                  value={formData.srotas}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Pranavahasrotas" />
                      <Text>Pranavahasrotas</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Udakavahasrotas" />
                      <Text>Udakavahasrotas</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Annavahasrotas" />
                      <Text>Annavahasrotas</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Rasavahasrotas" />
                      <Text>Rasavahasrotas</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Raktavahasrotas" />
                      <Text>Raktavahasrotas</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Mansavahasrotas" />
                      <Text>Mansavahasrotas</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Medovahasrotas" />
                      <Text>Medovahasrotas</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Asthivahasrotas" />
                      <Text>Asthivahasrotas</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Majjavahasrotas" />
                      <Text>Majjavahasrotas</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Sukravahasrotas" />
                      <Text>Sukravahasrotas</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Artavavahasrotas" />
                      <Text>Artavavahasrotas</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Mutravahasrotas" />
                      <Text>Mutravahasrotas</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Purishavahasrotas" />
                      <Text>Purishavahasrotas</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Swedavahasrotas" />
                      <Text>Swedavahasrotas</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </>
          )}
        </View>

        {/* collapsevayas Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setCollapsemala(!collapsemala)}>
            <Text style={styles.title}>Mala</Text>
            <FontAwesomeIcon icon={collapsemala ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapsemala && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Mala</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      mala: value,
                    }))
                  }
                  value={formData.mala}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Purisha" />
                      <Text>Purisha</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Mutra" />
                      <Text>Mutra</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Sweda" />
                      <Text>Sweda</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </>
          )}
        </View>

        {/* Desham Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setCollapseadhistana(!collapseadhistana)}>
            <Text style={styles.title}>Adhistana</Text>
            <FontAwesomeIcon
              icon={collapseadhistana ? faAngleUp : faAngleDown}
            />
          </TouchableOpacity>
          {collapseadhistana && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Adhistana</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      adhistana: value,
                    }))
                  }
                  value={formData.adhistana}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Abhyantar" />
                      <Text>Abhyantar</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Madhyam" />
                      <Text>Madhyam</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Bahya" />
                      <Text>Bahya</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setCollapsesrotodusthi(!collapsesrotodusthi)}>
            <Text style={styles.title}>Srotodusthi</Text>
            <FontAwesomeIcon
              icon={collapsesrotodusthi ? faAngleUp : faAngleDown}
            />
          </TouchableOpacity>
          {collapsesrotodusthi && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Srotodusthi</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      srotodusthi: value,
                    }))
                  }
                  value={formData.srotodusthi}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Sanga" />
                      <Text>Sanga</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Granthi" />
                      <Text>Granthi</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Vimargagaman" />
                      <Text>Vimargagaman</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Atipravritti" />
                      <Text>Atipravritti</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </>
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() =>
              setCollapsesadhyasadhyatwa(!collapsesadhyasadhyatwa)
            }>
            <Text style={styles.title}>Sadhyasadhyatwa</Text>
            <FontAwesomeIcon
              icon={collapsesadhyasadhyatwa ? faAngleUp : faAngleDown}
            />
          </TouchableOpacity>
          {collapsesadhyasadhyatwa && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Sadhyasadhyatwa</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      sadhyasadhyatwa: value,
                    }))
                  }
                  value={formData.sadhyasadhyatwa}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Sukhasadhya" />
                      <Text>Sukhasadhya</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Kastasadhya" />
                      <Text>Kastasadhya</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Yappya" />
                      <Text>Yappya</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Asadhya" />
                      <Text>Asadhya</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </>
          )}
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={addPatientSymptomsToArrayHandler}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>

        {patientSympyomsArray?.map((item, index) => (
          <View style={styles.recentDataAddedContainer} key={index}>
            <View style={styles.headerContainer}>
              <Text style={styles.recentDataAddedContainerText}>Symptoms</Text>
              <TouchableOpacity
                style={styles.fontIcon}
                onPress={() => removeSymptom(index)}>
                <FontAwesomeIcon icon={faXmark} color="red" />
              </TouchableOpacity>
            </View>
            <View style={styles.recentDataAddedContainerWrapper}>
              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Dosha</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Dosha : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.dosha}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Dusya</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Dusya : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.dusya}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Srotas</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Srotas : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.srotas}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Mala</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Mala :</Text>
                    <Text style={styles.recentInnerGroupText}>{item.mala}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Adhistana</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Adhistana :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.adhistana}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Srotodusthi</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Srotodusthi :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.srotodusthi}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Sadhyasadhyatwa</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Sadhyasadhyatwa :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.sadhyasadhyatwa}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.loginButton}>
        <TouchableOpacity
          style={[styles.buttonDiv, {backgroundColor: '#1b55f5'}]}
          onPress={savePatientSymptoms}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Samprapti;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
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
  section: {
    padding: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 2,
    borderColor: '#e6e6e6',
    borderWidth: 1.5,
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  contentOuter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#e6e6e6',
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  grpradio: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: 180,
  },
  radiosection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  text: {
    color: '#000000',
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 4,
    width: 60,
    padding: 6,
    borderColor: '#e6e6e6',
    marginHorizontal: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
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
  scrollviewStyle: {
    paddingBottom: 100,
  },
  recentDataAddedContainer: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 4,
    flexDirection: 'column',
    gap: 20,
  },
  recentDataAddedContainerWrapper: {
    flexDirection: 'column',
    gap: 10,
    flexWrap: 'wrap',
  },
  fontIcon: {
    borderWidth: 2,
    borderRadius: 100,
    padding: 6,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'red',
  },
  recentGroupTitle: {
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 6,
    color: '#6926de',
  },
  recentInnerGroupTitle: {
    fontWeight: '500',
  },
  recentInnerGroup: {
    flexDirection: 'row',
    gap: 5,
    flexWrap: 'wrap',
    width: 190,
    // backgroundColor:"red"
  },
  recentGroupWrapper: {
    flexDirection: 'row',
    gap: 5,
    flexWrap: 'wrap',
  },
  recentDataAddedContainerText: {
    fontWeight: '500',
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: '#5cd65c',
    width: 100,
    padding: 6,
    borderRadius: 6,
    marginHorizontal: 10,
    alignSelf: 'flex-end',
  },
  addButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
