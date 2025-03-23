import React, {
  useContext,
  useEffect,
  useRef,
  useState,
 
} from 'react';
import {
  View,
  Alert,
  BackHandler,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  Animated,
  TouchableOpacity,
  Image,
  DrawerLayoutAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faUser,
  faFileShield,
  faXmark,
  faShieldHalved,
  faStar,
  faSignOut,
} from '@fortawesome/free-solid-svg-icons';

import doctorImg from '../../../assets/images/doctor.png';
import PrescriptionComponent from '../../../components/doctorhomepage/prescriptionComponent';
import Quickactions from '../../../components/doctorhomepage/quickactions';
import Patientmanagement from '../../../components/doctorhomepage/patientmanagement';
import Bottomtabsnavigation from '../../../components/doctorhomepage/bottomtabsnavigation';
import Virtualclinicmanagement from '../../../components/doctorhomepage/virtualclinicmanagement';
import Gethelp from '../../../components/doctorhomepage/gethelp';
import UserContext from '../../../functions/usercontext';

const Doctorhomepage = ({navigation}) => {
  const {setUserData, userData} = useContext(UserContext);
  const drawer = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const colors = '#07255a';
  const tabs = 'home';

  useEffect(() => {
    const backAction = () => {
      Alert.alert('', 'Are you sure you want to Exit App?', [
        {text: 'Cancel', onPress: () => null, style: 'cancel'},
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  // logout handler ....
  const Logouthandler = async () => {
    AsyncStorage?.removeItem('user');
    setModalVisible(false);
    navigation.navigate('Login');
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const checkUserSignIn = async () => {
      const userToken = await AsyncStorage?.getItem('user');
      if (userToken) {
        const userDatass = JSON.parse(userToken);
        if (userData) setUserData(userDatass);
      }
    };
    checkUserSignIn();
  }, []);

  const navigationView = () => {
    return (
      <View>
        <View style={styles.imgGroup}>
          <FontAwesomeIcon icon={faUser} style={styles.icon1} />
        </View>
        <View style={styles.doctorDetails}>
          <Text style={styles.doctorDetailsText}>{userData?.name}</Text>
          <Text style={styles.doctorDetailsText2}>{userData?.education}</Text>
          <View style={{borderBottomColor: '#dcdcde', borderBottomWidth: 1}} />
          <View style={styles.doctorDetails2}>
            <Text style={styles.doctorDetails2Text}>Specialization</Text>
            <Text style={styles.doctorDetails2Text2}>
              {userData?.specialization}
            </Text>
          </View>
          <TouchableOpacity
            onPress={Logouthandler}
            style={[styles.buttonDiv2, {marginHorizontal: 20}]}>
            <Text style={styles.buttonDiv2Text}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <>
      <DrawerLayoutAndroid
        ref={drawer}
        drawerWidth={300} // Increase width for visibility
        drawerPosition={'left'}
        renderNavigationView={() => navigationView()}>
        <StatusBar style={styles.StatusBar} backgroundColor="#6332cf" />

        {/* Container */}
        <View style={styles.container}>
          <View style={styles.containerHeader}>
            <View style={styles.containerHeaderGrp}>
              <View style={styles.avatar}>
                <Image style={styles.tinyLogo} source={doctorImg} />
              </View>
              <View>
                <Text style={styles.text}>Welcome,</Text>
                <Text style={styles.text2}>{userData?.name}</Text>
              </View>
            </View>
            <View style={styles.containerHeaderGrp}>
              <View style={styles.avatar}>
                <TouchableOpacity onPress={openModal}>
                  <FontAwesomeIcon icon={faFileShield} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Logouthandler()}>
                  <FontAwesomeIcon icon={faSignOut} style={styles.icon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} vertical>
            <View>
              <PrescriptionComponent />
              <Quickactions />
              <Virtualclinicmanagement />
              <Patientmanagement />
              <Gethelp />
            </View>
          </ScrollView>
          <Bottomtabsnavigation colors={colors} tabs={tabs} />
          {modalVisible && (
            <Animated.View
              style={[styles.centeredView, {opacity: fadeAnim}]}
              onPress={closeModal}>
              <View style={styles.modalView}>
                <TouchableOpacity style={styles.buttonDiv} onPress={closeModal}>
                  <FontAwesomeIcon icon={faXmark} style={styles.iconClose} />
                </TouchableOpacity>
                <View style={styles.closeButton} onPress={closeModal}>
                  <FontAwesomeIcon
                    icon={faShieldHalved}
                    style={styles.iconShield}
                  />
                  <Text style={styles.modalText}>MedAyu - Privacy Assured</Text>
                  <View style={styles.modalPoints}>
                    <FontAwesomeIcon icon={faStar} style={styles.starIcon} />
                    <Text style={styles.PolicyText}>
                      MedAyu guarabtees that your data is safe, secure and
                      secret.
                    </Text>
                  </View>
                  <View style={styles.modalPoints}>
                    <FontAwesomeIcon icon={faStar} style={styles.starIcon} />
                    <Text style={styles.PolicyText}>
                      MedAyu guarabtees that your data is safe, secure and
                      secret.
                    </Text>
                  </View>
                  <View style={styles.modalPoints}>
                    <FontAwesomeIcon icon={faStar} style={styles.starIcon} />
                    <Text style={styles.PolicyText}>
                      MedAyu guarabtees that your data is safe, secure and
                      secret.
                    </Text>
                  </View>
                  <View style={styles.modalPoints}>
                    <FontAwesomeIcon icon={faStar} style={styles.starIcon} />
                    <Text style={styles.PolicyText}>
                      MedAyu guarabtees that your data is safe, secure and
                      secret.
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.buttonDiv2}
                  onPress={closeModal}>
                  <Text style={styles.buttonDiv2Text}>
                    Detailed Privacy Policy
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </View>
      </DrawerLayoutAndroid>
    </>
  );
};

export default Doctorhomepage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerHeader: {
    backgroundColor: '#6332cf',
    padding: 10,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  icon: {
    color: '#ffffff',
    padding: 10,
  },
  iconClose: {
    color: 'black',
    padding: 10,
    alignSelf: 'flex-end',
  },
  containerHeaderGrp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    color: '#ffffff',
    fontSize: 10,
  },
  text2: {
    color: '#ffffff',
  },
  tinyLogo: {
    width: 40,
    height: 40,
  },
  avatar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
  },
  navigationContainer: {
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    padding: 16,
    fontSize: 15,
    textAlign: 'center',
  },
  bottomModalView: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  button: {
    width: '50%',
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'solid',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'limegreen',
  },
  buttonText: {
    fontWeight: 'bold',
  },

  modalText: {
    color: '#07255a',
    marginVertical: 16,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  modalView: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 450,
    marginTop: '80%',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  centeredView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonDiv: {
    padding: 8,
  },
  iconShield: {
    padding: 40,
    marginTop: -20,
    alignSelf: 'center',
    color: '#07255a',
  },
  modalPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 18,
    marginVertical: 8,
  },
  starIcon: {
    color: 'orange',
  },
  PolicyText: {
    color: 'black',
  },
  buttonDiv2: {
    backgroundColor: '#2f1d73',
    padding: 16,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonDiv2Text: {
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  imgGroup: {
    borderColor: '#dcdcde',
    borderWidth: 1,
    backgroundColor: '#b679fc',
    padding: 12,
    margin: 20,
    borderRadius: 100,
    height: 100,
    width: 100,
    alignSelf: 'center',
  },
  icon1: {
    color: '#ffffff',
    padding: 20,
    alignSelf: 'center',
    marginTop: 15,
  },
  doctorDetails: {
    marginTop: -10,
    paddingHorizontal: 20,
    height: '72%',
  },
  doctorDetailsText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  doctorDetailsText2: {
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  doctorDetails2: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  doctorDetails2Text2: {
    color: 'green',
  },
  doctorDetails2Text: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});
