import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {RadioButton} from 'react-native-paper';

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

  const backAction = () => {
    navigation.goBack();
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

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Respiratory Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setCollapseNadi(!collapseNadi)}>
            <Text style={styles.title}>Nadi</Text>
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
                      nadi: {
                        ...prev.nadi,
                        character: value,
                      },
                    }))
                  }
                  value={formData.nadi.character}>
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
                      nadi: {
                        ...prev.nadi,
                        bala: value,
                      },
                    }))
                  }
                  value={formData.nadi.bala}>
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
                      nadi: {
                        ...prev.nadi,
                        gati: value,
                      },
                    }))
                  }
                  value={formData.nadi.gati}>
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
          </TouchableOpacity>
          {collapseMutra && (
            <>
              {/* Rate */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Vega</Text>
                <TextInput
                  style={styles.input}
                  value={formData.mutra.vega}
                  onChangeText={text =>
                    setFormData(prev => ({
                      ...prev,
                      mutra: {
                        ...prev.mutra,
                        vega: text,
                      },
                    }))
                  }
                />
              </View>

              {/* Character */}
              <View style={styles.contentOuter}>
                <Text style={styles.text}>Character</Text>
                <RadioButton.Group
                  onValueChange={value => setFormData('nadi.character', value)}
                  value={formData.nadi.character}>
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
                  onValueChange={value => setFormData('nadi.bala', value)}
                  value={formData.nadi.bala}>
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
                  onValueChange={value => setFormData('nadi.gati', value)}
                  value={formData.nadi.gati}>
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
      </ScrollView>
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
});
