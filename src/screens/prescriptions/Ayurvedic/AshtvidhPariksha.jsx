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

const AshtvidhPariksha = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    nadi_vega: '',
    nadi_character: '',
    nadi_bala: '',
    nadi_gati: '',
    mutra_vega: '',
    mutra_varna: '',
    mutra_sparsha: '',
    mutra_matra: '',
    mutra_gandha: '',
    mala_vega: '',
    mala_samhanan: '',
    mala_varna: '',
    jivha_varna: '',
    jivha_sparsha: '',
    jivha_mukhaswada: '',
    netra_prakashsangya: '',
    netra_drishtimandala: '',
    netra_mukhaswada: '',
    other_shabda: '',
    other_drishtimandala: '',
    other_mukhaswada: '',
  });

  // Section collapse states
  const [collapseNadi, setCollapseNadi] = useState(false);
  const [collapseMutra, setCollapseMutra] = useState(false);
  const [collapseMala, setCollapseMala] = useState(false);
  const [collapseJivha, setCollapseJivha] = useState(false);
  const [collapseNetra, setCollapseNetra] = useState(false);
  const [collapseOther, setCollapseOther] = useState(false);

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
      ashtvidhparikshaArray: patientSympyomsArray,
      api_type: 'OPD-AshtvidhPariksha',

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
              'AshtvidhPariksha Added Successfully',
            );
          else Alert.alert('Error !!', 'AshtvidhPariksha Not Added');
        });
      } catch (error) {
        Alert.alert('Error !!', error);
      }
      navigation.replace('CreateRx');
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
          <Text style={styles.navbarText}>Add Ashtvidh Pariksha</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollviewStyle}>
        {/* Respiratory Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setCollapseNadi(!collapseNadi)}>
            <Text style={styles.title}>Nadi</Text>
            <FontAwesomeIcon icon={collapseNadi ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapseNadi && (
            <>
              {/* Rate */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vega</Text>
                <TextInput
                  style={styles.input}
                  value={formData.nadi_vega}
                  onChangeText={text =>
                    setFormData(prev => ({
                      ...prev,
                      nadi_vega: text,
                    }))
                  }
                />
              </View>

              {/* Character */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Character</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      nadi_character: value,
                    }))
                  }
                  value={formData.nadi_character}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Regular" />
                      <Text>Regular</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Irregular" />
                      <Text>Irregular</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              {/* Bala */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Bala</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      nadi_bala: value,
                    }))
                  }
                  value={formData.nadi_bala}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Pravaram" />
                      <Text>Pravaram</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Madhyam" />
                      <Text>Madhyam</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Heenam" />
                      <Text>Heenam</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              {/* Gati */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Gati</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      nadi_gati: value,
                    }))
                  }
                  value={formData.nadi_gati}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Sarpa" />
                      <Text>Sarpa</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Manduka" />
                      <Text>Manduka</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Hamsa" />
                      <Text>Hamsa</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </>
          )}
        </View>

        {/* Mutra Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setCollapseMutra(!collapseMutra)}>
            <Text style={styles.title}>Mutra</Text>
            <FontAwesomeIcon icon={collapseMutra ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapseMutra && (
            <>
              {/* Rate */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vega</Text>
                <TextInput
                  style={styles.input}
                  value={formData.mutra_vega}
                  onChangeText={text =>
                    setFormData(prev => ({
                      ...prev,
                      mutra_vega: text,
                    }))
                  }
                />
              </View>

              {/* Varna */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Varna</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      mutra_varna: value,
                    }))
                  }
                  value={formData.mutra_varna}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Pandu" />
                      <Text>Pandu</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Rakta" />
                      <Text>Rakta</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Pita" />
                      <Text>Pita</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Aruna" />
                      <Text>Aruna</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Krishna" />
                      <Text>Krishna</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              {/* Sparsha */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Sparsha</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      mutra_sparsha: value,
                    }))
                  }
                  value={formData.mutra_sparsha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Ruksha" />
                      <Text>Ruksha</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Phenil" />
                      <Text>Phenil</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Pichhila" />
                      <Text>Pichhila</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Tailasam" />
                      <Text>Tailasam</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Achha" />
                      <Text>Achha</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Sandra" />
                      <Text>Sandra</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Ushna" />
                      <Text>Ushna</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Shita" />
                      <Text>Shita</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              {/* Matra */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Matra</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      mutra_matra: value,
                    }))
                  }
                  value={formData.mutra_matra}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Bahu" />
                      <Text>Bahu</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Alpa" />
                      <Text>Alpa</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Samayak" />
                      <Text>Samayak</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              {/* Gandha */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Gandha</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      mutra_gandha: value,
                    }))
                  }
                  value={formData.mutra_gandha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Daurgandhya" />
                      <Text>Daurgandhya</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Visragandha" />
                      <Text>Visragandha</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </>
          )}
        </View>

        {/* MALA Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setCollapseMala(!collapseMala)}>
            <Text style={styles.title}>Mala</Text>
            <FontAwesomeIcon icon={collapseMala ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapseMala && (
            <>
              {/* Rate */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vega</Text>
                <TextInput
                  style={styles.input}
                  value={formData.mala_vega}
                  onChangeText={text =>
                    setFormData(prev => ({
                      ...prev,
                      mala_vega: text,
                    }))
                  }
                />
              </View>

              {/* Samhanan */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Samhanan</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      mala_samhanan: value,
                    }))
                  }
                  value={formData.mutra_varna}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Prakrit" />
                      <Text>Prakrit</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Ghadha" />
                      <Text>Ghadha</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Shushka" />
                      <Text>Shushka</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Trutitam" />
                      <Text>Trutitam</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Drava" />
                      <Text>Drava</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Phenil" />
                      <Text>Phenil</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Pichhila" />
                      <Text>Pichhila</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Sandra" />
                      <Text>Sandra</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Apakwa" />
                      <Text>Apakwa</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Sheetal" />
                      <Text>Sheetal</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Puyayukta" />
                      <Text>Puyayukta</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Daurgandhya" />
                      <Text>Daurgandhya</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              {/* Varna */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Varna</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      mala_varna: value,
                    }))
                  }
                  value={formData.mala_varna}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Pita" />
                      <Text>Pita</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Pitabhkrishna" />
                      <Text>Pitabhkrishna</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Krishna" />
                      <Text>Krishna</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Haritabpita" />
                      <Text>Haritabpita</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Shweta" />
                      <Text>Shweta</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Kapish" />
                      <Text>Kapish</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Shyam" />
                      <Text>Shyam</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Sama" />
                      <Text>Sama</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Nirama" />
                      <Text>Nirama</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </>
          )}
        </View>

        {/* JIVHA Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setCollapseJivha(!collapseJivha)}>
            <Text style={styles.title}>Jivha</Text>
            <FontAwesomeIcon icon={collapseJivha ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapseJivha && (
            <>
              {/* Varna */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Varna</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      jivha_varna: value,
                    }))
                  }
                  value={formData.jivha_varna}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Rakta" />
                      <Text>Rakta</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Pitabhkrishna" />
                      <Text>Pitabhkrishna</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Krishna" />
                      <Text>Krishna</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Jivhaliptata" />
                      <Text>Jivhaliptata</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Shweta" />
                      <Text>Shweta</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Shyam" />
                      <Text>Shyam</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              {/* Sparsh */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Sparsha</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      jivha_sparsha: value,
                    }))
                  }
                  value={formData.jivha_sparsha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Khara" />
                      <Text>Khara</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Suptata" />
                      <Text>Suptata</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Pichhil" />
                      <Text>Pichhil</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Sakantaka" />
                      <Text>Sakantaka</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Shushka" />
                      <Text>Shushka</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              {/* Mukhaswada */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Mukhaswada</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      jivha_mukhaswada: value,
                    }))
                  }
                  value={formData.jivha_mukhaswada}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Madhur" />
                      <Text>Madhur</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Katu" />
                      <Text>Katu</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Kashay" />
                      <Text>Kashay</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Madhuramla" />
                      <Text>Madhuramla</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Ghrutpurna-asyata" />
                      <Text>Ghrutpurna-asyata</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </>
          )}
        </View>

        {/* NETRA Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setCollapseNetra(!collapseNetra)}>
            <Text style={styles.title}>Netra</Text>
            <FontAwesomeIcon icon={collapseNetra ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapseNetra && (
            <>
              {/* Drishtimandala */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Drishtimandala</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      netra_drishtimandala: value,
                    }))
                  }
                  value={formData.netra_drishtimandala}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Prakrit" />
                      <Text>Prakrit</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Sankuchit" />
                      <Text>Sankuchit</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Vispharit" />
                      <Text>Vispharit</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              {/* Mukhaswada */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Mukhaswada</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      netra_mukhaswada: value,
                    }))
                  }
                  value={formData.netra_mukhaswada}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Prakrit" />
                      <Text>Prakrit</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Shweta" />
                      <Text>Shweta</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Shhyava" />
                      <Text>Shhyava</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Aruna" />
                      <Text>Aruna</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Pita" />
                      <Text>Pita</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </>
          )}
        </View>

        {/* Other Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setCollapseOther(!collapseOther)}>
            <Text style={styles.title}>Other</Text>
            <FontAwesomeIcon icon={collapseOther ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapseOther && (
            <>
              {/* Shabda */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Shabda</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      other_shabda: value,
                    }))
                  }
                  value={formData.other_shabda}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Ksheen" />
                      <Text>Ksheen</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Gambhir" />
                      <Text>Gambhir</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Snigdha" />
                      <Text>Snigdha</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Gadgad" />
                      <Text>Gadgad</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Ruksha" />
                      <Text>Ruksha</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Minmin" />
                      <Text>Minmin</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              {/* Drishtimandala */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Drishtimandala</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      other_drishtimandala: value,
                    }))
                  }
                  value={formData.other_drishtimandala}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Snigdha" />
                      <Text>Snigdha</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Sheetal" />
                      <Text>Sheetal</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Anushnasheeta" />
                      <Text>Anushnasheeta</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Ruksha" />
                      <Text>Ruksha</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Ushna" />
                      <Text>Ushna</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Shushka" />
                      <Text>Shushka</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              {/* Mukhaswada */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Mukhaswada</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      other_mukhaswada: value,
                    }))
                  }
                  value={formData.other_mukhaswada}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Sthoola" />
                      <Text>Sthoola</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Madhyam" />
                      <Text>Madhyam</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Krisha" />
                      <Text>Krisha</Text>
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
              {/* Nadi */}
              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Nadi</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Vega : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.nadi_vega}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Character :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.nadi_character}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Bala : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.nadi_bala}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Gati : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.nadi_gati}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Mutra */}

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Mutra</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Vega : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.mutra_vega}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Varna : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.mutra_varna}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Sparsha : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.mutra_sparsha}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Matra : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.mutra_matra}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Gandha : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.mutra_gandha}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Mala */}

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Mala</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Vega : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.mala_vega}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Samhanan :</Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.mala_samhanan}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Varna : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.mala_varna}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Jivha */}

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Jivha</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Varna : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.jivha_varna}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Sparsha :</Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.jivha_sparsha}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Mukhaswada :
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.jivha_mukhaswada}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Netra */}

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Netra</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Drishtimandala :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.netra_drishtimandala}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Mukhaswada :
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.netra_mukhaswada}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Other */}
              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Other</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Shabda : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.other_shabda}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Drishtimandala :
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.other_drishtimandala}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Mukhaswada :
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.other_mukhaswada}
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

export default AshtvidhPariksha;

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
    marginRight: 20,
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
