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

const SrotasPariksha = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    Pranavahasrotas: '',
    Udakvahasrotas: '',
    Annavahasrotas: '',
    Rasavahasrotas: '',
    Raktavahasrotas: '',
    Mansavahasrotas: '',
    Medovahasrotas: '',
    Asthivahasrotas: '',
    Majjavahasrotas: '',
    Shukravahasrotas: '',
    Artavavahasrotas: '',
    Mutravahasrotas: '',
    Purishvahasrotas: '',
    Swedavahasrotas: '',
  });

  // Section collapse states
  const [collapse1, setCollapse1] = useState(false);
  const [collapse2, setCollapse2] = useState(false);
  const [collapse3, setCollapse3] = useState(false);
  const [collapse4, setCollapse4] = useState(false);
  const [collapse5, setCollapse5] = useState(false);
  const [collapse6, setCollapse6] = useState(false);
  const [collapse7, setCollapse7] = useState(false);
  const [collapse8, setCollapse8] = useState(false);
  const [collapse9, setCollapse9] = useState(false);
  const [collapse10, setCollapse10] = useState(false);
  const [collapse11, setCollapse11] = useState(false);
  const [collapse12, setCollapse12] = useState(false);
  const [collapse13, setCollapse13] = useState(false);
  const [collapse14, setCollapse14] = useState(false);

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
      srotasparikshaArray: patientSympyomsArray,
      api_type: 'OPD-SrotasPariksha',

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
            return Alert.alert(
              'Success !!',
              'Srotas Pariksha Added Successfully',
            );
          else Alert.alert('Error !!', 'Srotas Pariksha Not Added');
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
          <Text style={styles.navbarText}>Add Srotas Pariksha</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollviewStyle}>
        {/* Respiratory Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setCollapse1(!collapse1)}>
            <Text style={styles.title}>Dosha</Text>
            <FontAwesomeIcon icon={collapse1 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse1 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Pranavahasrotas</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Pranavahasrotas: value,
                    }))
                  }
                  value={formData.Pranavahasrotas}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Alpaswasa" />
                      <Text>Alpaswasa</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Kupitswasa" />
                      <Text>Kupitswasa</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Atisaranaswasa" />
                      <Text>Atisaranaswasa</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Abhikshnaswasa" />
                      <Text>Abhikshnaswasa</Text>
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
            onPress={() => setCollapse2(!collapse2)}>
            <Text style={styles.title}>Udakvahasrotas</Text>
            <FontAwesomeIcon icon={collapse2 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse2 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Udakvahasrotas</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Udakvahasrotas: value,
                    }))
                  }
                  value={formData.Udakvahasrotas}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Jivhashosha" />
                      <Text>Jivhashosha</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Kanthashosha" />
                      <Text>Kanthashosha</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Aushtashosha" />
                      <Text>Aushtashosha</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Trishna" />
                      <Text>Trishna</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Talushosha" />
                      <Text>Talushosha</Text>
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
            onPress={() => setCollapse3(!collapse3)}>
            <Text style={styles.title}>Annavahasrotas</Text>
            <FontAwesomeIcon icon={collapse3 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse3 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Annavahasrotas</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Annavahasrotas: value,
                    }))
                  }
                  value={formData.Annavahasrotas}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Anannabhilasha" />
                      <Text>Anannabhilasha</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Avipaka" />
                      <Text>Avipaka</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Aruchi" />
                      <Text>Aruchi</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Chhardi" />
                      <Text>Chhardi</Text>
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
            onPress={() => setCollapse4(!collapse4)}>
            <Text style={styles.title}>Rasavahasrotas</Text>
            <FontAwesomeIcon icon={collapse4 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse4 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Rasavahasrotas</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Rasavahasrotas: value,
                    }))
                  }
                  value={formData.Rasavahasrotas}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Mukhvairasya" />
                      <Text>Mukhvairasya</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Jwara" />
                      <Text>Jwara</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Arasyata" />
                      <Text>Arasyata</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Pandu" />
                      <Text>Pandu</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Hrillhas" />
                      <Text>Hrillhas</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Avasada" />
                      <Text>Avasada</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Gaurav" />
                      <Text>Gaurav</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Klaibya" />
                      <Text>Klaibya</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Tandra" />
                      <Text>Tandra</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Klaibya" />
                      <Text>Klaibya</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Angamarda" />
                      <Text>Angamarda</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Agnimandya" />
                      <Text>Agnimandya</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Valaya" />
                      <Text>Valaya</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Palitya" />
                      <Text>Palitya</Text>
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
            onPress={() => setCollapse5(!collapse5)}>
            <Text style={styles.title}>Raktavahasrotas</Text>
            <FontAwesomeIcon icon={collapse5 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse5 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Raktavahasrotas</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Raktavahasrotas: value,
                    }))
                  }
                  value={formData.Raktavahasrotas}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Pidika" />
                      <Text>Pidika</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Vidradhi" />
                      <Text>Vidradhi</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Raktapitta" />
                      <Text>Raktapitta</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Charmaroga" />
                      <Text>Charmaroga</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Mukhapaka" />
                      <Text>Mukhapaka</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Kamala" />
                      <Text>Kamala</Text>
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
            onPress={() => setCollapse6(!collapse6)}>
            <Text style={styles.title}>Mansavahasrotas</Text>
            <FontAwesomeIcon icon={collapse6 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse6 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Mansavahasrotas</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Mansavahasrotas: value,
                    }))
                  }
                  value={formData.Mansavahasrotas}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Arbuda" />
                      <Text>Arbuda</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Upajivhika" />
                      <Text>Upajivhika</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Alaji" />
                      <Text>Alaji</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Putimansa" />
                      <Text>Putimansa</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Adhimansa" />
                      <Text>Adhimansa</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Gandamala" />
                      <Text>Gandamala</Text>
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
            onPress={() => setCollapse7(!collapse7)}>
            <Text style={styles.title}>Medovahasrotas</Text>
            <FontAwesomeIcon icon={collapse7 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse7 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Medovahasrotas</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Medovahasrotas: value,
                    }))
                  }
                  value={formData.Medovahasrotas}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Maladhikya" />
                      <Text>Maladhikya</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Tandra" />
                      <Text>Tandra</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Hastapadadaha" />
                      <Text>Hastapadadaha</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Alasya" />
                      <Text>Alasya</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Hastapadasuptata" />
                      <Text>Hastapadasuptata</Text>
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
            onPress={() => setCollapse8(!collapse8)}>
            <Text style={styles.title}>Asthivahasrotas</Text>
            <FontAwesomeIcon icon={collapse8 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse8 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Asthivahasrotas</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Asthivahasrotas: value,
                    }))
                  }
                  value={formData.Asthivahasrotas}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Adhyasthi" />
                      <Text>Adhyasthi</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Asthishula" />
                      <Text>Asthishula</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Adhidanta" />
                      <Text>Adhidanta</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Dantashula" />
                      <Text>Dantashula</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Khalitya" />
                      <Text>Khalitya</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Palitya" />
                      <Text>Palitya</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Nakhau" />
                      <Text>Nakhau</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Vicar" />
                      <Text>Vicar</Text>
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
            onPress={() => setCollapse9(!collapse9)}>
            <Text style={styles.title}>Majjavahasrotas</Text>
            <FontAwesomeIcon icon={collapse9 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse9 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Majjavahasrotas</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Majjavahasrotas: value,
                    }))
                  }
                  value={formData.Majjavahasrotas}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Parvashula" />
                      <Text>Parvashula</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Murchha" />
                      <Text>Murchha</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Bhrama" />
                      <Text>Bhrama</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Mithhyagyan" />
                      <Text>Mithhyagyan</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Timir" />
                      <Text>Timir</Text>
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
            onPress={() => setCollapse10(!collapse10)}>
            <Text style={styles.title}>Shukravahasrotas</Text>
            <FontAwesomeIcon icon={collapse10 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse10 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Shukravahasrotas</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Shukravahasrotas: value,
                    }))
                  }
                  value={formData.Shukravahasrotas}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Klaibya" />
                      <Text>Klaibya</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Garbhapata" />
                      <Text>Garbhapata</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Aharshanam" />
                      <Text>Aharshanam</Text>
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
            onPress={() => setCollapse11(!collapse11)}>
            <Text style={styles.title}>Artavavahasrotas</Text>
            <FontAwesomeIcon icon={collapse11 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse11 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Artavavahasrotas</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Artavavahasrotas: value,
                    }))
                  }
                  value={formData.Artavavahasrotas}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Alpartava" />
                      <Text>Alpartava</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Atyartava" />
                      <Text>Atyartava</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Anartava" />
                      <Text>Anartava</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Vandhyatwa" />
                      <Text>Vandhyatwa</Text>
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
            onPress={() => setCollapse12(!collapse12)}>
            <Text style={styles.title}>Mutravahasrotas</Text>
            <FontAwesomeIcon icon={collapse12 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse12 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Mutravahasrotas</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Mutravahasrotas: value,
                    }))
                  }
                  value={formData.Mutravahasrotas}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Bahumutrata" />
                      <Text>Bahumutrata</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Abhikshana" />
                      <Text>Abhikshana</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Atibandhata" />
                      <Text>Atibandhata</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Bahulamutrata" />
                      <Text>Bahulamutrata</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Alpalpamutra" />
                      <Text>Alpalpamutra</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Sashulamutra" />
                      <Text>Sashulamutra</Text>
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
            onPress={() => setCollapse13(!collapse13)}>
            <Text style={styles.title}>Purishvahasrotas</Text>
            <FontAwesomeIcon icon={collapse13 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse13 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Purishvahasrotas</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Purishvahasrotas: value,
                    }))
                  }
                  value={formData.Purishvahasrotas}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Alpalpa" />
                      <Text>Alpalpa</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Atidrava" />
                      <Text>Atidrava</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Sashula" />
                      <Text>Sashula</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Grathita" />
                      <Text>Grathita</Text>
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
            onPress={() => setCollapse14(!collapse14)}>
            <Text style={styles.title}>Swedavahasrotas</Text>
            <FontAwesomeIcon icon={collapse14 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse14 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Swedavahasrotas</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Swedavahasrotas: value,
                    }))
                  }
                  value={formData.Swedavahasrotas}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Asweda" />
                      <Text>Asweda</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Lomaharsha" />
                      <Text>Lomaharsha</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Atisweda" />
                      <Text>Atisweda</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Angaparidaha" />
                      <Text>Angaparidaha</Text>
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
                <Text style={styles.recentGroupTitle}>Pranavahasrotas</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Pranavahasrotas :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Pranavahasrotas}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Udakvahasrotas</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Udakvahasrotas :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Udakvahasrotas}
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
                <Text style={styles.recentGroupTitle}>Annavahasrotas</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Annavahasrotas :
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Annavahasrotas}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Rasavahasrotas</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Rasavahasrotas :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Rasavahasrotas}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Raktavahasrotas</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Raktavahasrotas :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Raktavahasrotas}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Mansavahasrotas</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Mansavahasrotas :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Mansavahasrotas}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Medovahasrotas</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Medovahasrotas :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Medovahasrotas}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Asthivahasrotas</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Asthivahasrotas :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Asthivahasrotas}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Majjavahasrotas</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Majjavahasrotas :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Majjavahasrotas}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Shukravahasrotas</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Shukravahasrotas :
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Shukravahasrotas}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Artavavahasrotas</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Artavavahasrotas :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Artavavahasrotas}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Mutravahasrotas</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Mutravahasrotas :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Mutravahasrotas}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Purishvahasrotas</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Purishvahasrotas :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Purishvahasrotas}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Swedavahasrotas</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Swedavahasrotas :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Swedavahasrotas}
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

export default SrotasPariksha;

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
