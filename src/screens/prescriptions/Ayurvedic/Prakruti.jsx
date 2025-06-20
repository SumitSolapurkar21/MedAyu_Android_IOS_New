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

const Prakruti = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    BodyWeightFrame_Vata: '',
    BodyWeightFrame_Pitta: '',
    BodyWeightFrame_Kapha: '',

    Skin_Vata: '',
    Skin_Pitta: '',
    Skin_Kapha: '',

    Fingernails_Vata: '',
    Fingernails_Pitta: '',
    Fingernails_Kapha: '',

    Hair_Vata: '',
    Hair_Pitta: '',
    Hair_Kapha: '',

    Forehead_Vata: '',
    Forehead_Pitta: '',
    Forehead_Kapha: '',

    Eyes_Vata: '',
    Eyes_Pitta: '',
    Eyes_Kapha: '',

    Lips_Vata: '',
    Lips_Pitta: '',
    Lips_Kapha: '',

    Thirst_Vata: '',
    Thirst_Pitta: '',
    Thirst_Kapha: '',

    Excretions_Vata: '',
    Excretions_Pitta: '',
    Excretions_Kapha: '',

    VoiceSpeech_Vata: '',
    VoiceSpeech_Pitta: '',
    VoiceSpeech_Kapha: '',

    WorkingStyle_Vata: '',
    WorkingStyle_Pitta: '',
    WorkingStyle_Kapha: '',

    MentalMakeup_Vata: '',
    MentalMakeup_Pitta: '',
    MentalMakeup_Kapha: '',

    Temperament_Vata: '',
    Temperament_Pitta: '',
    Temperament_Kapha: '',

    Relationships_Vata: '',
    Relationships_Pitta: '',
    Relationships_Kapha: '',

    WeatherPreferences_Vata: '',
    WeatherPreferences_Pitta: '',
    WeatherPreferences_Kapha: '',

    MoneyMatters_Vata: '',
    MoneyMatters_Pitta: '',
    MoneyMatters_Kapha: '',

    Memory_Vata: '',
    Memory_Pitta: '',
    Memory_Kapha: '',

    Dreams_Vata: '',
    Dreams_Pitta: '',
    Dreams_Kapha: '',

    Sleep_Vata: '',
    Sleep_Pitta: '',
    Sleep_Kapha: '',

    Result: '',
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
  const [collapse15, setCollapse15] = useState(false);
  const [collapse16, setCollapse16] = useState(false);
  const [collapse17, setCollapse17] = useState(false);
  const [collapse18, setCollapse18] = useState(false);
  const [collapse19, setCollapse19] = useState(false);

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
      prakrutiArray: patientSympyomsArray,
      api_type: 'OPD-Prakruti',
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
            return Alert.alert('Success !!', 'Prakruti Added Successfully');
          else Alert.alert('Error !!', 'Prakruti Not Added');
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
          <Text style={styles.navbarText}>Add Prakruti</Text>
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
            <Text style={styles.title}>Body Weight and Frame</Text>
            <FontAwesomeIcon icon={collapse1 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse1 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vata (ether and air)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      BodyWeightFrame_Vata: value,
                    }))
                  }
                  value={formData.BodyWeightFrame_Vata}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Lean" />
                      <Text>Lean</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Light weight" />
                      <Text>Light weight</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Can not gain weight easily but can shed it rapidly" />
                      <Text>
                        Can not gain weight easily but can shed it rapidly
                      </Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="VATA PRAKRUTI" />
                      <Text>VATA PRAKRUTI</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Pitta (fire and water)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      BodyWeightFrame_Pitta: value,
                    }))
                  }
                  value={formData.BodyWeightFrame_Pitta}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Well proportioned frame" />
                      <Text>Well proportioned frame</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Average weight" />
                      <Text>Average weight</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Can gain as well as shed weight easily" />
                      <Text>Can gain as well as shed weight easily</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="PITTA PRAKRUTI" />
                      <Text>VATA PRAKRUTI</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Kapha (water and earth)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      BodyWeightFrame_Kapha: value,
                    }))
                  }
                  value={formData.BodyWeightFrame_Kapha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Board and robust frame" />
                      <Text>Board and robust frame</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Heavy bodied" />
                      <Text>Heavy bodied</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Can gain weight easily but can not shed it as fast" />
                      <Text>
                        Can gain weight easily but can not shed it as fast
                      </Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="KAPHA PRAKRUTI" />
                      <Text>VATA PRAKRUTI</Text>
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
            <Text style={styles.title}>Skin</Text>
            <FontAwesomeIcon icon={collapse2 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse2 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vata (ether and air)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Skin_Vata: value,
                    }))
                  }
                  value={formData.Skin_Vata}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="dry,rough to touch" />
                      <Text>dry,rough to touch</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="dull,darkish skin" />
                      <Text>dull,darkish skin</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Pitta (fire and water)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Skin_Pitta: value,
                    }))
                  }
                  value={formData.Skin_Pitta}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="soft,oily,warm to touch" />
                      <Text>soft,oily,warm to touch</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="golwing skin ,wether fair or dark" />
                      <Text>golwing skin ,wether fair or dark</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Kapha (water and earth)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Skin_Kapha: value,
                    }))
                  }
                  value={formData.Skin_Kapha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="thick,supple,cool to touch" />
                      <Text>thick,supple,cool to touch</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="pale skin, whitish complexion" />
                      <Text>pale skin, whitish complexion</Text>
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
            <Text style={styles.title}>Fingernails</Text>
            <FontAwesomeIcon icon={collapse3 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse3 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vata (ether and air)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Fingernails_Vata: value,
                    }))
                  }
                  value={formData.Fingernails_Vata}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="rough and brittle" />
                      <Text>rough and brittle</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="small" />
                      <Text>small</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="dull in colour" />
                      <Text>dull in colour</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Pitta (fire and water)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Fingernails_Pitta: value,
                    }))
                  }
                  value={formData.Fingernails_Pitta}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="tough" />
                      <Text>tough</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="medium" />
                      <Text>medium</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="pinkish in colour" />
                      <Text>pinkish in colour</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Kapha (water and earth)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Fingernails_Kapha: value,
                    }))
                  }
                  value={formData.Fingernails_Kapha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="smooth" />
                      <Text>smooth</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="large and wide" />
                      <Text>large and wide</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Whitish in color" />
                      <Text>Whitish in color</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="KAPHA PRAKRUTI" />
                      <Text>VATA PRAKRUTI</Text>
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
            <Text style={styles.title}>Hair</Text>
            <FontAwesomeIcon icon={collapse4 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse4 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vata (ether and air)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Hair_Vata: value,
                    }))
                  }
                  value={formData.Hair_Vata}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="dry and coarse" />
                      <Text>dry and coarse</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="curly or difficult to manage , prone to split ends" />
                      <Text>
                        curly or difficult to manage , prone to split ends
                      </Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="dark brown to black" />
                      <Text>dark brown to black </Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Pitta (fire and water)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Hair_Pitta: value,
                    }))
                  }
                  value={formData.Hair_Pitta}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="smooth and fine" />
                      <Text>smooth and fine</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="spare,lending towards early greying or balding" />
                      <Text>
                        spare,lending towards early greying or balding
                      </Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="light to auburn" />
                      <Text>light to auburn</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Kapha (water and earth)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Hair_Kapha: value,
                    }))
                  }
                  value={formData.Hair_Kapha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="silky and lustrous" />
                      <Text>silky and lustrous</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="thick" />
                      <Text>thick</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="medium to brown" />
                      <Text>medium to brown</Text>
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
            <Text style={styles.title}>Forehead</Text>
            <FontAwesomeIcon icon={collapse5 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse5 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vata (ether and air)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Forehead_Vata: value,
                    }))
                  }
                  value={formData.Forehead_Vata}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="small" />
                      <Text>small</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Pitta (fire and water)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Forehead_Pitta: value,
                    }))
                  }
                  value={formData.Forehead_Pitta}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="medium" />
                      <Text>medium</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Kapha (water and earth)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Forehead_Kapha: value,
                    }))
                  }
                  value={formData.Forehead_Kapha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="large" />
                      <Text>large</Text>
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
            <Text style={styles.title}>Eyes</Text>
            <FontAwesomeIcon icon={collapse6 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse6 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vata (ether and air)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Eyes_Vata: value,
                    }))
                  }
                  value={formData.Eyes_Vata}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="small and active" />
                      <Text>small and active</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="brown to dark brown pupils" />
                      <Text>brown to dark brown pupils</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="dull sclerae" />
                      <Text>dull sclerae</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="dry" />
                      <Text>dry</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Pitta (fire and water)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Eyes_Pitta: value,
                    }))
                  }
                  value={formData.Eyes_Pitta}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="sharp and penetrating" />
                      <Text>sharp and penetrating</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="light pupils could be brown,green or gray" />
                      <Text>light pupils could be brown,green or gray</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="yellowish sclerae" />
                      <Text>yellowish sclerae</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="medium in size" />
                      <Text>medium in size</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Kapha (water and earth)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Eyes_Kapha: value,
                    }))
                  }
                  value={formData.Eyes_Kapha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="moist" />
                      <Text>moist</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="large and attractive with thick lashes" />
                      <Text>large and attractive with thick lashes</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="bright blue or black pupils" />
                      <Text>bright blue or black pupils</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="clear white sclerae" />
                      <Text>clear white sclerae</Text>
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
            <Text style={styles.title}>Lips</Text>
            <FontAwesomeIcon icon={collapse7 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse7 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vata (ether and air)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Lips_Vata: value,
                    }))
                  }
                  value={formData.Lips_Vata}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="thin" />
                      <Text>thin</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="darkish in colour" />
                      <Text>darkish in colour</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Pitta (fire and water)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Lips_Pitta: value,
                    }))
                  }
                  value={formData.Lips_Pitta}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="medium" />
                      <Text>medium</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="pinkish in colour" />
                      <Text>pinkish in colour</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Kapha (water and earth)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Lips_Kapha: value,
                    }))
                  }
                  value={formData.Lips_Kapha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="large" />
                      <Text>large</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="pale in colur" />
                      <Text>pale in colur</Text>
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
            <Text style={styles.title}>Thirst</Text>
            <FontAwesomeIcon icon={collapse9 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse9 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vata (ether and air)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Thirst_Vata: value,
                    }))
                  }
                  value={formData.Thirst_Vata}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="variables" />
                      <Text>variables</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Pitta (fire and water)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Thirst_Pitta: value,
                    }))
                  }
                  value={formData.Thirst_Pitta}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="excessive" />
                      <Text>excessive</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Kapha (water and earth)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Thirst_Kapha: value,
                    }))
                  }
                  value={formData.Thirst_Kapha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="scanty" />
                      <Text>scanty</Text>
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
            <Text style={styles.title}>Excretions</Text>
            <FontAwesomeIcon icon={collapse9 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse9 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vata (ether and air)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Excretions_Vata: value,
                    }))
                  }
                  value={formData.Excretions_Vata}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="frequently constipated hard and gaseous stools" />
                      <Text>
                        frequently constipated hard and gaseous stools
                      </Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="less sweating and arination" />
                      <Text>less sweating and arination</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Pitta (fire and water)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Excretions_Pitta: value,
                    }))
                  }
                  value={formData.Excretions_Pitta}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="regular ,soft and loose often buring stools" />
                      <Text>regular ,soft and loose often buring stools</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="profuse sweating and urination,strong body odour" />
                      <Text>
                        profuse sweating and urination,strong body odour
                      </Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Kapha (water and earth)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Excretions_Kapha: value,
                    }))
                  }
                  value={formData.Excretions_Kapha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="regular ,thick and oily stools" />
                      <Text>regular ,thick and oily stools</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="moderate sweating and urination" />
                      <Text>moderate sweating and urination</Text>
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
            <Text style={styles.title}>Voice and Speech</Text>
            <FontAwesomeIcon icon={collapse8 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse8 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vata (ether and air)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      VoiceSpeech_Vata: value,
                    }))
                  }
                  value={formData.VoiceSpeech_Vata}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="weak, hoarse or shrill voice" />
                      <Text>weak, hoarse or shrill voice</Text>
                    </View>

                    <View style={styles.radiosection}>
                      <RadioButton value="talk rapidly rather than clearly" />
                      <Text>talk rapidly rather than clearly</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Pitta (fire and water)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      VoiceSpeech_Pitta: value,
                    }))
                  }
                  value={formData.VoiceSpeech_Pitta}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="commanding and sharp voice" />
                      <Text>commanding and sharp voice</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="persuasive and motivating" />
                      <Text>persuasive and motivating</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Kapha (water and earth)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      VoiceSpeech_Kapha: value,
                    }))
                  }
                  value={formData.VoiceSpeech_Kapha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="gentle and pleasing voice" />
                      <Text>gentle and pleasing voice</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="talk less keep secrets within" />
                      <Text>talk less keep secrets within</Text>
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
            <Text style={styles.title}>Working Style</Text>
            <FontAwesomeIcon icon={collapse10 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse10 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vata (ether and air)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      WorkingStyle_Vata: value,
                    }))
                  }
                  value={formData.WorkingStyle_Vata}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="fast work" />
                      <Text>fast work</Text>
                    </View>

                    <View style={styles.radiosection}>
                      <RadioButton value="starts impulsively, but do not necessarily complet" />
                      <Text>
                        starts impulsively, but do not necessarily complet
                      </Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Pitta (fire and water)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      WorkingStyle_Pitta: value,
                    }))
                  }
                  value={formData.WorkingStyle_Pitta}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Determined worker" />
                      <Text>Determined worker</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="highly task and goal oriented" />
                      <Text>highly task and goal oriented</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Kapha (water and earth)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      WorkingStyle_Kapha: value,
                    }))
                  }
                  value={formData.WorkingStyle_Kapha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="methodical worker" />
                      <Text>methodical worker</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="slow to being,but always see a task to completion" />
                      <Text>
                        slow to being,but always see a task to completion
                      </Text>
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
            <Text style={styles.title}>Mental Make-Up</Text>
            <FontAwesomeIcon icon={collapse11 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse11 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vata (ether and air)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      MentalMakeup_Vata: value,
                    }))
                  }
                  value={formData.MentalMakeup_Vata}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="restless and easily distracted" />
                      <Text>restless and easily distracted</Text>
                    </View>

                    <View style={styles.radiosection}>
                      <RadioButton value="curious mind" />
                      <Text>curious mind</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Pitta (fire and water)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      MentalMakeup_Pitta: value,
                    }))
                  }
                  value={formData.MentalMakeup_Pitta}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="passionate and generative" />
                      <Text>passionate and generative</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="assertive mind" />
                      <Text>assertive mind</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Kapha (water and earth)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      MentalMakeup_Kapha: value,
                    }))
                  }
                  value={formData.MentalMakeup_Kapha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="calm and stable" />
                      <Text>calm and stable</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="logical mind" />
                      <Text>logical mind</Text>
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
            <Text style={styles.title}>Temperament</Text>
            <FontAwesomeIcon icon={collapse12 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse12 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vata (ether and air)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Temperament_Vata: value,
                    }))
                  }
                  value={formData.Temperament_Vata}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="restless and easily distracted" />
                      <Text>restless and easily distracted</Text>
                    </View>

                    <View style={styles.radiosection}>
                      <RadioButton value="curious mind" />
                      <Text>curious mind</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Pitta (fire and water)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Temperament_Pitta: value,
                    }))
                  }
                  value={formData.Temperament_Pitta}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="passionate and generative" />
                      <Text>passionate and generative</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="assertive mind" />
                      <Text>assertive mind</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              <View style={styles.contentOuter}>
                <Text style={styles.text}>Kapha (water and earth)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Temperament_Kapha: value,
                    }))
                  }
                  value={formData.Temperament_Kapha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="calm and stable" />
                      <Text>calm and stable</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="logical mind" />
                      <Text>logical mind</Text>
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

export default Prakruti;

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
