import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faAngleDown,
  faAngleUp,
  faArrowLeft,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {Divider, RadioButton} from 'react-native-paper';
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

  // Function to calculate Prakruti type based on selected values
  const calculatePrakrutiType = () => {
    const vataFields = [
      'BodyWeightFrame_Vata', 'Skin_Vata', 'Fingernails_Vata', 'Hair_Vata',
      'Forehead_Vata', 'Eyes_Vata', 'Lips_Vata', 'Thirst_Vata', 'Excretions_Vata',
      'VoiceSpeech_Vata', 'WorkingStyle_Vata', 'MentalMakeup_Vata', 'Temperament_Vata',
      'Relationships_Vata', 'WeatherPreferences_Vata', 'MoneyMatters_Vata',
      'Memory_Vata', 'Dreams_Vata', 'Sleep_Vata'
    ];
    
    const pittaFields = [
      'BodyWeightFrame_Pitta', 'Skin_Pitta', 'Fingernails_Pitta', 'Hair_Pitta',
      'Forehead_Pitta', 'Eyes_Pitta', 'Lips_Pitta', 'Thirst_Pitta', 'Excretions_Pitta',
      'VoiceSpeech_Pitta', 'WorkingStyle_Pitta', 'MentalMakeup_Pitta', 'Temperament_Pitta',
      'Relationships_Pitta', 'WeatherPreferences_Pitta', 'MoneyMatters_Pitta',
      'Memory_Pitta', 'Dreams_Pitta', 'Sleep_Pitta'
    ];
    
    const kaphaFields = [
      'BodyWeightFrame_Kapha', 'Skin_Kapha', 'Fingernails_Kapha', 'Hair_Kapha',
      'Forehead_Kapha', 'Eyes_Kapha', 'Lips_Kapha', 'Thirst_Kapha', 'Excretions_Kapha',
      'VoiceSpeech_Kapha', 'WorkingStyle_Kapha', 'MentalMakeup_Kapha', 'Temperament_Kapha',
      'Relationships_Kapha', 'WeatherPreferences_Kapha', 'MoneyMatters_Kapha',
      'Memory_Kapha', 'Dreams_Kapha', 'Sleep_Kapha'
    ];

    let vataCount = 0;
    let pittaCount = 0;
    let kaphaCount = 0;

    // Count selected values for each dosha
    vataFields.forEach(field => {
      if (formData[field] && formData[field] !== '') {
        vataCount++;
      }
    });

    pittaFields.forEach(field => {
      if (formData[field] && formData[field] !== '') {
        pittaCount++;
      }
    });

    kaphaFields.forEach(field => {
      if (formData[field] && formData[field] !== '') {
        kaphaCount++;
      }
    });

    // Create array of doshas with their counts
    const doshaCounts = [
      { name: 'Vatta', count: vataCount },
      { name: 'Pitta', count: pittaCount },
      { name: 'Kapha', count: kaphaCount }
    ];

    // Sort by count in descending order
    doshaCounts.sort((a, b) => b.count - a.count);

    // Filter out doshas with count 0
    const activeDoshas = doshaCounts.filter(dosha => dosha.count > 0);

    if (activeDoshas.length === 0) {
      return '';
    }

    // Create result string in format "Vatta-Pitta-Kapha"
    const result = activeDoshas.map(dosha => dosha.name).join('-');
    
    return result;
  };

  // Update Result whenever formData changes
  useEffect(() => {
    const prakrutiType = calculatePrakrutiType();
    if (prakrutiType !== formData.Result) {
      setFormData(prev => ({
        ...prev,
        Result: prakrutiType,
      }));
    }
  }, [
    formData.BodyWeightFrame_Vata, formData.BodyWeightFrame_Pitta, formData.BodyWeightFrame_Kapha,
    formData.Skin_Vata, formData.Skin_Pitta, formData.Skin_Kapha,
    formData.Fingernails_Vata, formData.Fingernails_Pitta, formData.Fingernails_Kapha,
    formData.Hair_Vata, formData.Hair_Pitta, formData.Hair_Kapha,
    formData.Forehead_Vata, formData.Forehead_Pitta, formData.Forehead_Kapha,
    formData.Eyes_Vata, formData.Eyes_Pitta, formData.Eyes_Kapha,
    formData.Lips_Vata, formData.Lips_Pitta, formData.Lips_Kapha,
    formData.Thirst_Vata, formData.Thirst_Pitta, formData.Thirst_Kapha,
    formData.Excretions_Vata, formData.Excretions_Pitta, formData.Excretions_Kapha,
    formData.VoiceSpeech_Vata, formData.VoiceSpeech_Pitta, formData.VoiceSpeech_Kapha,
    formData.WorkingStyle_Vata, formData.WorkingStyle_Pitta, formData.WorkingStyle_Kapha,
    formData.MentalMakeup_Vata, formData.MentalMakeup_Pitta, formData.MentalMakeup_Kapha,
    formData.Temperament_Vata, formData.Temperament_Pitta, formData.Temperament_Kapha,
    formData.Relationships_Vata, formData.Relationships_Pitta, formData.Relationships_Kapha,
    formData.WeatherPreferences_Vata, formData.WeatherPreferences_Pitta, formData.WeatherPreferences_Kapha,
    formData.MoneyMatters_Vata, formData.MoneyMatters_Pitta, formData.MoneyMatters_Kapha,
    formData.Memory_Vata, formData.Memory_Pitta, formData.Memory_Kapha,
    formData.Dreams_Vata, formData.Dreams_Pitta, formData.Dreams_Kapha,
    formData.Sleep_Vata, formData.Sleep_Pitta, formData.Sleep_Kapha
  ]);

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
                      <Text style={styles.radioText}>Lean</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Light weight" />
                      <Text style={styles.radioText}>Light weight</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Can not gain weight easily but can shed it rapidly" />
                      <Text style={styles.radioText}>
                        Can not gain weight easily but can shed it rapidly
                      </Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="VATA PRAKRUTI" />
                      <Text style={styles.radioText}>VATA PRAKRUTI</Text>
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
                      <Text style={styles.radioText}>Well proportioned frame</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Average weight" />
                      <Text style={styles.radioText}>Average weight</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Can gain as well as shed weight easily" />
                      <Text style={styles.radioText}>Can gain as well as shed weight easily</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="PITTA PRAKRUTI" />
                      <Text style={styles.radioText}>PITTA PRAKRUTI</Text>
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
                      <Text style={styles.radioText}>Board and robust frame</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Heavy bodied" />
                      <Text style={styles.radioText}>Heavy bodied</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Can gain weight easily but can not shed it as fast"  />
                      <Text style={styles.radioText}>
                        Can gain weight easily but can not shed it as fast
                      </Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="KAPHA PRAKRUTI" />
                      <Text style={styles.radioText}>KAPHA PRAKRUTI</Text>
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
                      <Text style={styles.radioText}>dry,rough to touch</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="dull,darkish skin" />
                      <Text style={styles.radioText}>dull,darkish skin</Text>
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
                      <Text style={styles.radioText}>soft,oily,warm to touch</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="golwing skin ,wether fair or dark" />
                      <Text style={styles.radioText}>golwing skin ,wether fair or dark</Text>
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
                      <Text style={styles.radioText}>thick,supple,cool to touch</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="pale skin, whitish complexion" />
                      <Text style={styles.radioText}>pale skin, whitish complexion</Text>
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
                      <Text style={styles.radioText}>rough and brittle</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="small" />
                      <Text style={styles.radioText}>small</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="dull in colour" />
                      <Text style={styles.radioText}>dull in colour</Text>
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
                      <Text style={styles.radioText}>tough</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="medium" />
                      <Text style={styles.radioText}>medium</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="pinkish in colour" />
                      <Text style={styles.radioText}>pinkish in colour</Text>
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
                      <Text style={styles.radioText}>smooth</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="large and wide" />
                      <Text style={styles.radioText}>large and wide</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Whitish in color" />
                      <Text style={styles.radioText}>Whitish in color</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="KAPHA PRAKRUTI" />
                      <Text style={styles.radioText}>VATA PRAKRUTI</Text>
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
                      <Text style={styles.radioText}>dry and coarse</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="curly or difficult to manage , prone to split ends"  />
                      <Text>
                        curly or difficult to manage , prone to split ends
                      </Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="dark brown to black" />
                      <Text style={styles.radioText}>dark brown to black </Text>
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
                      <Text style={styles.radioText}>smooth and fine</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="spare,lending towards early greying or balding" />
                      <Text style={styles.radioText}>
                        spare,lending towards early greying or balding
                      </Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="light to auburn" />
                      <Text style={styles.radioText}>light to auburn</Text>
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
                      <Text style={styles.radioText}>silky and lustrous</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="thick" />
                      <Text style={styles.radioText}>thick</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="medium to brown" />
                      <Text style={styles.radioText}>medium to brown</Text>
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
                      <Text style={styles.radioText}>small</Text>
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
                      <Text style={styles.radioText}>medium</Text>
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
                      <Text style={styles.radioText}>large</Text>
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
                      <Text style={styles.radioText}>small and active</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="brown to dark brown pupils" />
                      <Text style={styles.radioText}>brown to dark brown pupils</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="dull sclerae" />
                      <Text style={styles.radioText}>dull sclerae</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="dry" />
                      <Text style={styles.radioText}>dry</Text>
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
                      <Text style={styles.radioText}>sharp and penetrating</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="light pupils could be brown,green or gray" />
                      <Text style={styles.radioText}>light pupils could be brown,green or gray</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="yellowish sclerae" />
                      <Text style={styles.radioText}>yellowish sclerae</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="medium in size" />
                      <Text style={styles.radioText}>medium in size</Text>
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
                      <Text style={styles.radioText}>moist</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="large and attractive with thick lashes" />
                      <Text style={styles.radioText}>large and attractive with thick lashes</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="bright blue or black pupils" />
                      <Text style={styles.radioText}>bright blue or black pupils</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="clear white sclerae" />
                      <Text style={styles.radioText}>clear white sclerae</Text>
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
                      <Text style={styles.radioText}>thin</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="darkish in colour" />
                      <Text style={styles.radioText}>darkish in colour</Text>
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
                      <Text style={styles.radioText}>medium</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="pinkish in colour" />
                      <Text style={styles.radioText}>pinkish in colour</Text>
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
                      <Text style={styles.radioText}>large</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="pale in colur" />
                      <Text style={styles.radioText}>pale in colur</Text>
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
                      <Text style={styles.radioText}>variables</Text>
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
                      <Text style={styles.radioText}>excessive</Text>
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
                      <Text style={styles.radioText}>scanty</Text>
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
                      <Text style={styles.radioText}>
                        frequently constipated hard and gaseous stools
                      </Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="less sweating and arination" />
                      <Text style={styles.radioText}>less sweating and arination</Text>
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
                      <Text style={styles.radioText}>regular ,soft and loose often buring stools</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="profuse sweating and urination,strong body odour" />
                      <Text style={styles.radioText}>
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
                      <Text style={styles.radioText}>regular ,thick and oily stools</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="moderate sweating and urination" />
                      <Text style={styles.radioText}>moderate sweating and urination</Text>
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
                      <Text style={styles.radioText}>weak, hoarse or shrill voice</Text>
                    </View>

                    <View style={styles.radiosection}>
                      <RadioButton value="talk rapidly rather than clearly" />
                      <Text style={styles.radioText}>talk rapidly rather than clearly</Text>
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
                      <Text style={styles.radioText}>commanding and sharp voice</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="persuasive and motivating" />
                      <Text style={styles.radioText}>persuasive and motivating</Text>
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
                      <Text style={styles.radioText}>gentle and pleasing voice</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="talk less keep secrets within" />
                      <Text style={styles.radioText}>talk less keep secrets within</Text>
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
                      <Text style={styles.radioText}>fast work</Text>
                    </View>

                    <View style={styles.radiosection}>
                      <RadioButton value="starts impulsively, but do not necessarily complete" />
                      <Text style={styles.radioText}>
                        starts impulsively, but do not necessarily complete
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
                      <Text style={styles.radioText}>Determined worker</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="highly task and goal oriented" />
                      <Text style={styles.radioText}>highly task and goal oriented</Text>
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
                      <Text style={styles.radioText}>methodical worker</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="slow to being,but always see a task to compl style={styles.radioText}etion" />
                      <Text style={styles.radioText}>
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
                      <Text style={styles.radioText}>restless and easily distracted</Text>
                    </View>

                    <View style={styles.radiosection}>
                      <RadioButton value="curious mind" />
                      <Text style={styles.radioText}>curious mind</Text>
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
                      <Text style={styles.radioText}>passionate and generative</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="assertive mind" />
                      <Text style={styles.radioText}>assertive mind</Text>
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
                      <Text style={styles.radioText}>calm and stable</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="logical mind" />
                      <Text style={styles.radioText}>logical mind</Text>
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
                      <RadioButton value="Insecure and impatient" />
                      <Text style={styles.radioText}>Insecure and impatient</Text>
                    </View>

                    <View style={styles.radiosection}>
                      <RadioButton value="hardly ever content,always searching" />
                      <Text style={styles.radioText}>hardly ever content,always searching</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="quick in emotional reactions and outbursts" />
                      <Text style={styles.radioText}>quick in emotional reactions and outbursts</Text>
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
                      <RadioButton value="aggressive and impatient" />
                      <Text style={styles.radioText}>aggressive and impatient</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="dominating and cynical" />
                      <Text style={styles.radioText}>dominating and cynical</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="intense emotions of like or dislike,love or hate"  />
                      <Text style={styles.radioText}>
                        intense emotions of like or dislike,love or hate
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
                      Temperament_Kapha: value,
                    }))
                  }
                  value={formData.Temperament_Kapha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="comfortable and patient" />
                      <Text style={styles.radioText}>comfortable and patient</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="laid back" />
                      <Text style={styles.radioText}>laid back</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="show to change" />
                      <Text style={styles.radioText}>show to change</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="do not get angry,have calm endurence" />
                      <Text style={styles.radioText}>do not get angry,have calm endurence</Text>
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
            <Text style={styles.title}>Relationships</Text>
            <FontAwesomeIcon icon={collapse13 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse13 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vata (ether and air)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Relationships_Vata: value,
                    }))
                  }
                  value={formData.Relationships_Vata}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="forgive and forget easily" />
                      <Text style={styles.radioText}>forgive and forget easily</Text>
                    </View>

                    <View style={styles.radiosection}>
                      <RadioButton value="frequently in and out of love" />
                      <Text style={styles.radioText}>frequently in and out of love</Text>
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
                      Relationships_Pitta: value,
                    }))
                  }
                  value={formData.Relationships_Pitta}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="hold grudges for long" />
                      <Text style={styles.radioText}>hold grudges for long</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="enter into intense relationship" />
                      <Text style={styles.radioText}>enter into intense relationship</Text>
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
                      Relationships_Kapha: value,
                    }))
                  }
                  value={formData.Relationships_Kapha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="forgive,but never forget" />
                      <Text style={styles.radioText}>forgive,but never forget</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="deeply attached in love and grounded in family tip"/>
                      <Text style={styles.radioText}>
                        deeply attached in love and grounded in family tip
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
            onPress={() => setCollapse14(!collapse14)}>
            <Text style={styles.title}>Weather Preferences</Text>
            <FontAwesomeIcon icon={collapse14 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse14 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vata (ether and air)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      WeatherPreferences_Vata: value,
                    }))
                  }
                  value={formData.WeatherPreferences_Vata}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="sunny, warm and rainy climate" />
                      <Text style={styles.radioText}>sunny, warm and rainy climate</Text>
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
                      WeatherPreferences_Pitta: value,
                    }))
                  }
                  value={formData.WeatherPreferences_Pitta}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="cool, pleasant climate" />
                      <Text style={styles.radioText}>cool, pleasant climate</Text>
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
                      WeatherPreferences_Kapha: value,
                    }))
                  }
                  value={formData.WeatherPreferences_Kapha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="comfortable anywhere except in humid climate" />
                      <Text style={styles.radioText}>comfortable anywhere except in humid climate</Text>
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
            onPress={() => setCollapse15(!collapse15)}>
            <Text style={styles.title}>Money Matters</Text>
            <FontAwesomeIcon icon={collapse15 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse15 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vata (ether and air)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      MoneyMatters_Vata: value,
                    }))
                  }
                  value={formData.MoneyMatters_Vata}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="spend easily,don't care to earn or save much" />
                      <Text style={styles.radioText}>spend easily,don't care to earn or save much</Text>
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
                      MoneyMatters_Pitta: value,
                    }))
                  }
                  value={formData.MoneyMatters_Pitta}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="plan well before spending" />
                      <Text style={styles.radioText}>plan well before spending</Text>
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
                      MoneyMatters_Kapha: value,
                    }))
                  }
                  value={formData.MoneyMatters_Kapha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="do not spend easily ,like to accumulate" />
                      <Text style={styles.radioText}>do not spend easily ,like to accumulate</Text>
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
            onPress={() => setCollapse16(!collapse16)}>
            <Text style={styles.title}>Memory</Text>
            <FontAwesomeIcon icon={collapse16 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse16 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vata (ether and air)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Memory_Vata: value,
                    }))
                  }
                  value={formData.Memory_Vata}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="quick grasp hut poor retention" />
                      <Text style={styles.radioText}>quick grasp hut poor retention</Text>
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
                      Memory_Pitta: value,
                    }))
                  }
                  value={formData.Memory_Pitta}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="quick grasp and strong retention" />
                      <Text style={styles.radioText}>quick grasp and strong retention</Text>
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
                      Memory_Kapha: value,
                    }))
                  }
                  value={formData.Memory_Kapha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="slow grap but strong retention" />
                      <Text style={styles.radioText}>slow grap but strong retention</Text>
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
            onPress={() => setCollapse17(!collapse17)}>
            <Text style={styles.title}>Dreams</Text>
            <FontAwesomeIcon icon={collapse17 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse17 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vata (ether and air)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Dreams_Vata: value,
                    }))
                  }
                  value={formData.Dreams_Vata}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="anxious and many" />
                      <Text style={styles.radioText}>anxious and many</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="dreams relate to flying jumping climbing,runing" />
                      <Text style={styles.radioText}>
                        dreams relate to flying jumping climbing,runing
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
                      Dreams_Pitta: value,
                    }))
                  }
                  value={formData.Dreams_Pitta}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="moderate in number" />
                      <Text style={styles.radioText}>moderate in number</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="dreams relate to anger, conflict" />
                      <Text style={styles.radioText}>dreams relate to anger, conflict</Text>
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
                      Dreams_Kapha: value,
                    }))
                  }
                  value={formData.Dreams_Kapha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="fewer in number" />
                      <Text style={styles.radioText}>fewer in number</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="dreams relate to romance,water pathos or empathy" />
                      <Text style={styles.radioText}>
                        dreams relate to romance,water pathos or empathy
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
            onPress={() => setCollapse18(!collapse18)}>
            <Text style={styles.title}>Sleep</Text>
            <FontAwesomeIcon icon={collapse18 ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapse18 && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vata (ether and air)</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      Sleep_Vata: value,
                    }))
                  }
                  value={formData.Sleep_Vata}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="less and disturbed" />
                      <Text style={styles.radioText}>less and disturbed</Text>
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
                      Sleep_Pitta: value,
                    }))
                  }
                  value={formData.Sleep_Pitta}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="less but sound" />
                      <Text style={styles.radioText}>less but sound</Text>
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
                      Sleep_Kapha: value,
                    }))
                  }
                  value={formData.Sleep_Kapha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="deep and prolonged" />
                      <Text style={styles.radioText}>deep and prolonged</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.contentOuter}>
            <Text style={styles.text}>Vatta Pitta Kapha</Text>
            <TextInput
                  style={[styles.input, { backgroundColor: '#f5f5f5' }]}
                  value={formData.Result}
                  editable={false}
                 
                />
          </View>
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
                <Text style={styles.recentGroupTitle}>Body Weight and Frame</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Vata :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.BodyWeightFrame_Vata}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Pitta :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.BodyWeightFrame_Pitta}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Kapha :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.BodyWeightFrame_Kapha}
                    </Text>
                  </View>
                </View>
              </View>
              <Divider/>
              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Skin</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Vata :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Skin_Vata}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Pitta :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Skin_Pitta}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Kapha :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Skin_Kapha}
                    </Text>
                  </View>
                </View>
              </View>
              <Divider/>
              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Fingernails</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Vata :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Fingernails_Vata}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Pitta :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Fingernails_Pitta}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Kapha :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Fingernails_Kapha}
                    </Text>
                  </View>
                </View>
              </View>
              <Divider/>
              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Hair</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Vata :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Hair_Vata}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Pitta :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Hair_Pitta}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Kapha :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Hair_Kapha}
                    </Text>
                  </View>
                </View>
              </View>
              <Divider/>
              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Forehead</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Vata :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Forehead_Vata}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Pitta :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Forehead_Pitta}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Kapha :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Forehead_Kapha}
                    </Text>
                  </View>
                </View>
              </View>
              <Divider/>
              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Eyes</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Vata :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Eyes_Vata}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Pitta :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Eyes_Pitta}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Kapha :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Eyes_Kapha}
                    </Text>
                  </View>
                </View>
              </View>
              <Divider/>
              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Lips</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Vata :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Lips_Vata}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Pitta :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Lips_Pitta}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Kapha :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Lips_Kapha}
                    </Text>
                  </View>
                </View>
              </View>
              <Divider/>
              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Thirst</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Vata :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Thirst_Vata}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Pitta :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Thirst_Pitta}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Kapha :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Thirst_Kapha}
                    </Text>
                  </View>
                </View>
              </View>
              <Divider/>
              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Excretions</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Vata :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Excretions_Vata}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Pitta :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Excretions_Pitta}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Kapha :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Excretions_Kapha}
                    </Text>
                  </View>
                </View>
              </View>
              <Divider/>
              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Voice and Speech</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Vata :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.VoiceSpeech_Vata}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Pitta :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.VoiceSpeech_Pitta}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Kapha :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.VoiceSpeech_Kapha}
                    </Text>
                  </View>
                </View>
              </View>
              <Divider/>
              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Working Style</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Vata :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.WorkingStyle_Vata}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Pitta :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.WorkingStyle_Pitta}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Kapha :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.WorkingStyle_Kapha}
                    </Text>
                  </View>
                </View>
              </View>
              <Divider/>
              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Mental Make-Up</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Vata :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.MentalMakeup_Vata}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Pitta :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.MentalMakeup_Pitta}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Kapha :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.MentalMakeup_Kapha}
                    </Text>
                  </View>
                </View>
              </View>
              <Divider/>
              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Temperament</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Vata :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Temperament_Vata}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Pitta :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Temperament_Pitta}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Kapha :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Temperament_Kapha}
                    </Text>
                  </View>
                </View>
              </View>
              <Divider/>
              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Relationships</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Vata :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Relationships_Vata}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Pitta :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Relationships_Pitta}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Kapha :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Relationships_Kapha}
                    </Text>
                  </View>
                </View>
              </View>
              <Divider/>
              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Weather Preferences</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Vata :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.WeatherPreferences_Vata}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Pitta :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.WeatherPreferences_Pitta}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Kapha :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.WeatherPreferences_Kapha}
                    </Text>
                  </View>
                </View>
              </View>
              <Divider/>
              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Money Matters</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Vata :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.MoneyMatters_Vata}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Pitta :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.MoneyMatters_Pitta}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Kapha :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.MoneyMatters_Kapha}
                    </Text>
                  </View>
                </View>
              </View>
              <Divider/>
              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Memory</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Vata :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Memory_Vata}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Pitta :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Memory_Pitta}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Kapha :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Memory_Kapha}
                    </Text>
                  </View>
                </View>
              </View>
              <Divider/>
              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Dreams</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Vata :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Dreams_Vata}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Pitta :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Dreams_Pitta}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Kapha :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Dreams_Kapha}
                    </Text>
                  </View>
                </View>
              </View>

              <Divider/>
              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Sleep</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Vata :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Sleep_Vata}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Pitta :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Sleep_Pitta}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                      Kapha :{' '}
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.Sleep_Kapha}
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
    width: 200,
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
    marginRight: 5
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
  radioText:{
    width: 140,
  }
});
