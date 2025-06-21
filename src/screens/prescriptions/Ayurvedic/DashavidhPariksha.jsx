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

const DashavidhPariksha = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    prakriti: '',
    satmyata_abhyavaharan: '',
    satmyata_jarana: '',
    sarha: '',
    vayas: '',
    desham: '',
    kalatha: '',
    satwa: '',
    sahanan: '',
    pramanata: '',
    shareerbalam: '',
    manasaprakriti: '',
  });

  // Section collapse states
  const [collapseprakriti, setCollapseprakriti] = useState(false);
  const [collapsesatmyata, setCollassesatmyata] = useState(false);
  const [collapseSarha, setCollapseSarha] = useState(false);
  const [collapsevayas, setCollapsevayas] = useState(false);
  const [collapsedesham, setCollapsedesham] = useState(false);
  const [collapsekalatha, setCollapsekalatha] = useState(false);
  const [collapsesatwa, setCollapsesatwa] = useState(false);
  const [collapsesahanan, setCollapsesahanan] = useState(false);
  const [collapsepramanata, setCollapsepramanata] = useState(false);
  const [collapseshareerbalam, setCollapseshareerbalam] = useState(false);
  const [collapsemanasaprakriti, setCollapsemanasaprakriti] = useState(false);

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
      dashavidhparikshaArray: patientSympyomsArray,
      api_type: 'OPD-DashavidhPariksha',

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
              'DashavidhPariksha Added Successfully',
            );
          else Alert.alert('Error !!', 'DashavidhPariksha Not Added');
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
          <Text style={styles.navbarText}>Add Dashavidh Pariksha</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollviewStyle}>
        {/* Respiratory Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setCollapseprakriti(!collapseprakriti)}>
            <Text style={styles.title}>Prakriti</Text>
            <FontAwesomeIcon
              icon={collapseprakriti ? faAngleUp : faAngleDown}
            />
          </TouchableOpacity>
          {collapseprakriti && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Prakriti</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      prakriti: value,
                    }))
                  }
                  value={formData.prakriti}>
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
                      <RadioButton value="Vatakapha" />
                      <Text>Vatakapha</Text>
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
            onPress={() => setCollassesatmyata(!collapsesatmyata)}>
            <Text style={styles.title}>Satmyata</Text>
            <FontAwesomeIcon
              icon={collapsesatmyata ? faAngleUp : faAngleDown}
            />
          </TouchableOpacity>
          {collapsesatmyata && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Abhyavaharan</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      satmyata_abhyavaharan: value,
                    }))
                  }
                  value={formData.satmyata_abhyavaharan}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Uttam" />
                      <Text>Uttam</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Madhyam" />
                      <Text>Madhyam</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Heena" />
                      <Text>Heena</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>

              {/* Jarana */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Jarana</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      satmyata_jarana: value,
                    }))
                  }
                  value={formData.satmyata_jarana}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Manda" />
                      <Text>Manda</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Visham" />
                      <Text>Visham</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Pichhila" />
                      <Text>Pichhila</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Tikshna" />
                      <Text>Tikshna</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Sama" />
                      <Text>Sama</Text>
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
            onPress={() => setCollapseSarha(!collapseSarha)}>
            <Text style={styles.title}>Sarha</Text>
            <FontAwesomeIcon icon={collapseSarha ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapseSarha && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Sarha</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      sarha: value,
                    }))
                  }
                  value={formData.sarha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Twak" />
                      <Text>Twak</Text>
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
                    <View style={styles.radiosection}>
                      <RadioButton value="Ojha" />
                      <Text>Ojha</Text>
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
            onPress={() => setCollapsevayas(!collapsevayas)}>
            <Text style={styles.title}>Vayas</Text>
            <FontAwesomeIcon icon={collapsevayas ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapsevayas && (
            <>
              {/* Vayas */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vayas</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      vayas: value,
                    }))
                  }
                  value={formData.vayas}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Pita" />
                      <Text>Pita</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Shaishav" />
                      <Text>Shaishav</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Balya" />
                      <Text>Balya</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Kaumar" />
                      <Text>Kaumar</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Yuva" />
                      <Text>Yuva</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Madhaya" />
                      <Text>Madhaya</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Vardhakya" />
                      <Text>Vardhakya</Text>
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
            onPress={() => setCollapsedesham(!collapsedesham)}>
            <Text style={styles.title}>Desham</Text>
            <FontAwesomeIcon icon={collapsedesham ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapsedesham && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Jangal</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      desham: value,
                    }))
                  }
                  value={formData.desham}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Jangal" />
                      <Text>Jangal</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Anoop" />
                      <Text>Anoop</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Sadharan" />
                      <Text>Sadharan</Text>
                    </View>
                  </View>
                </RadioButton.Group>
              </View>
            </>
          )}
        </View>

        {/* Kalatha Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setCollapsekalatha(!collapsekalatha)}>
            <Text style={styles.title}>Kalatha</Text>
            <FontAwesomeIcon icon={collapsekalatha ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapsekalatha && (
            <>
              {/* Shabda */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Kalatha</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      kalatha: value,
                    }))
                  }
                  value={formData.kalatha}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Shishir" />
                      <Text>Shishir</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Vasant" />
                      <Text>Vasant</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Greeshma" />
                      <Text>Greeshma</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Varsha" />
                      <Text>Varsha</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Sharad" />
                      <Text>Sharad</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Hemant" />
                      <Text>Hemant</Text>
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
            onPress={() => setCollapsesatwa(!collapsesatwa)}>
            <Text style={styles.title}>Satwa</Text>
            <FontAwesomeIcon icon={collapsesatwa ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapsesatwa && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Satwa</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      satwa: value,
                    }))
                  }
                  value={formData.satwa}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Uttam" />
                      <Text>Uttam</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Madhyam" />
                      <Text>Madhyam</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Heena" />
                      <Text>Heena</Text>
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
            onPress={() => setCollapsesahanan(!collapsesahanan)}>
            <Text style={styles.title}>Sahanan</Text>
            <FontAwesomeIcon icon={collapsesahanan ? faAngleUp : faAngleDown} />
          </TouchableOpacity>
          {collapsesahanan && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Sahanan</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      sahanan: value,
                    }))
                  }
                  value={formData.sahanan}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Uttam" />
                      <Text>Uttam</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Madhyam" />
                      <Text>Madhyam</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Heena" />
                      <Text>Heena</Text>
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
            onPress={() => setCollapsepramanata(!collapsepramanata)}>
            <Text style={styles.title}>Pramanata</Text>
            <FontAwesomeIcon
              icon={collapsepramanata ? faAngleUp : faAngleDown}
            />
          </TouchableOpacity>
          {collapsepramanata && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Pramanata</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      pramanata: value,
                    }))
                  }
                  value={formData.pramanata}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Uttam" />
                      <Text>Uttam</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Madhyam" />
                      <Text>Madhyam</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Heena" />
                      <Text>Heena</Text>
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
            onPress={() => setCollapseshareerbalam(!collapseshareerbalam)}>
            <Text style={styles.title}>Shareer Balam</Text>
            <FontAwesomeIcon
              icon={collapseshareerbalam ? faAngleUp : faAngleDown}
            />
          </TouchableOpacity>
          {collapseshareerbalam && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Shareer Balam</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      shareerbalam: value,
                    }))
                  }
                  value={formData.shareerbalam}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Uttam" />
                      <Text>Uttam</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Madhyam" />
                      <Text>Madhyam</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Heena" />
                      <Text>Heena</Text>
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
            onPress={() => setCollapsemanasaprakriti(!collapsemanasaprakriti)}>
            <Text style={styles.title}>Manasa Prakriti</Text>
            <FontAwesomeIcon
              icon={collapsemanasaprakriti ? faAngleUp : faAngleDown}
            />
          </TouchableOpacity>
          {collapsemanasaprakriti && (
            <>
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Manasa Prakriti</Text>
                <RadioButton.Group
                  onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      manasaprakriti: value,
                    }))
                  }
                  value={formData.manasaprakriti}>
                  <View style={styles.grpradio}>
                    <View style={styles.radiosection}>
                      <RadioButton value="Uttam" />
                      <Text>Uttam</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Madhyam" />
                      <Text>Madhyam</Text>
                    </View>
                    <View style={styles.radiosection}>
                      <RadioButton value="Heena" />
                      <Text>Heena</Text>
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
                <Text style={styles.recentGroupTitle}>Prakriti</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Prakriti : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.prakriti}
                    </Text>
                  </View>
                </View>
              </View>


              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Satmyata</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Abhyavaharan : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.satmyata_abhyavaharan}
                    </Text>
                  </View>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Jarana : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.satmyata_jarana}
                    </Text>
                  </View>
                </View>
              </View>


              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Sarha</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Sarha : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.sarha}
                    </Text>
                  </View>
                </View>
              </View>


              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Vayas</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Vayas : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.vayas}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Desham</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>
                    Desham :
                    </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.desham}
                    </Text>
                  </View>
                  
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Kalatha</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Kalatha : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.kalatha}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Satwa</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Satwa : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.satwa}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Sahanan</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Sahanan : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.sahanan}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Pramanata</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Pramanata : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.pramanata}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Shareer Balam</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Shareer Balam : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.shareerbalam}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.recentGroup}>
                <Text style={styles.recentGroupTitle}>Manasa Prakriti</Text>
                <View style={styles.recentGroupWrapper}>
                  <View style={styles.recentInnerGroup}>
                    <Text style={styles.recentInnerGroupTitle}>Manasa Prakriti : </Text>
                    <Text style={styles.recentInnerGroupText}>
                      {item.manasaprakriti}
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

export default DashavidhPariksha;

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
