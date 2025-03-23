import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {
  BackHandler,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  PanResponder,
  Alert,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Bottomtabsnavigation from '../../components/doctorhomepage/bottomtabsnavigation';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faEllipsisVertical,
  faFilePrescription,
  faFilter,
  faMagnifyingGlass,
  faUserPlus,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {faCommentDots} from '@fortawesome/free-regular-svg-icons';
import {fetchPatientFunction} from '../../slices/AddpatientSlice';
import {useDispatch, useSelector} from 'react-redux';
import UserContext from '../../functions/usercontext';
import {GeneratePdf} from '../../components/GeneratePrescription/GeneratePrescription';

const screenHeight = Dimensions.get('window').height;

const Patientslist = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {userData} = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');

  const colors = '#6544b8';
  const tabs = 'patients';

  // State and Ref for managing the bottom sheet
  const [isFilterVisible, setFilterVisible] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Back handler
  useEffect(() => {
    const backAction = () => {
      if (isFilterVisible) {
        closeFilter();
        return true;
      } else {
        navigation.goBack();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [isFilterVisible]);

  // PanResponder to handle drag down to close
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 0;
      },
      onPanResponderMove: (_, gestureState) => {
        animatedValue.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          closeFilter();
        } else {
          Animated.spring(animatedValue, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  // Function to open the filter bottom sheet
  const openFilter = () => {
    if (isFilterVisible === true) {
      Animated.timing(animatedValue, {
        toValue: screenHeight * 0.4,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setFilterVisible(false));
    } else {
      setFilterVisible(true);
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  // Function to close the filter bottom sheet
  const closeFilter = () => {
    Animated.timing(animatedValue, {
      toValue: screenHeight * 0.4,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setFilterVisible(false));
  };

  const _data = {
    hospital_id: userData?.hospital_id,
    doctor_id: userData?._id,
  };

  // get patients list ....
  useEffect(() => {
    const fetchData = async () => {
      const result = await dispatch(fetchPatientFunction(_data));
      if (result.payload) {
        return result.payload;
      } else {
        Alert.alert('Error !!', 'Something went wrong');
      }
    };

    fetchData();
  }, [dispatch, userData?.hospital_id, userData?._id]); // Run only when userData changes

  const {patientdataarray} = useSelector(state => state.addpatient);

  // Filtering patients based on search query
  const filteredPatients = useMemo(() => {
    return patientdataarray?.filter(patient => {
      const query = searchQuery.toLowerCase();
      return (
        patient.firstname.toLowerCase().includes(query) ||
        patient.mobilenumber.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, patientdataarray]);

  const PatientItem = React.memo(
    ({item}) => {
      return (
        <View style={styles.section}>
          <View style={styles.body}>
            <View style={styles.content}>
              <View style={styles.p_details}>
                <Text style={styles.p_name}>{item.firstname}</Text>
              </View>
              <Text>{item.mobilenumber}</Text>
            </View>
            {/* <View style={styles.content1}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => GeneratePdf(item, userData)}>
                <FontAwesomeIcon
                  icon={faFilePrescription}
                  style={styles.icon3}
                />
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      );
    },
    (prevProps, nextProps) => {
      // Only re-render if the item data is different
      return (
        prevProps.item.firstname === nextProps.item.firstname &&
        prevProps.item.mobilenumber === nextProps.item.mobilenumber
      );
    },
  );

  return (
    <>
      {/* Status Bar */}
      <StatusBar
        style={styles.StatusBar}
        animated={true}
        backgroundColor="#ffffff"
      />
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>My first SPOT clinic</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faEllipsisVertical} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <TextInput
          name="roomno"
          placeholder="Search Name or Phone No"
          style={styles.textInput}
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />

        <View style={styles.filter}>
          <TouchableOpacity onPress={openFilter}>
            <FontAwesomeIcon icon={faFilter} style={styles.icon2} />
          </TouchableOpacity>
          <Text style={styles.filtertext}>Recently Added</Text>
        </View>
        <FlatList
          data={filteredPatients}
          renderItem={({item}) => <PatientItem item={item} />}
        />

        {/* Bottom Sheet for Filter */}
        {isFilterVisible && (
          <Animated.View
            style={[
              styles.bottomSheet,
              {
                transform: [
                  {
                    translateY: animatedValue.interpolate({
                      inputRange: [0, screenHeight * 0.4],
                      outputRange: [0, screenHeight * 0.4],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
              },
            ]}
            {...panResponder.panHandlers}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalText}>Custom Filter</Text>
                <TouchableOpacity onPress={() => closeFilter()}>
                  <FontAwesomeIcon icon={faXmark} style={styles.icon4} />
                </TouchableOpacity>
              </View>
              <View style={styles.modalBody}>
                <Text style={styles.modalBodyText}>Visit Date</Text>
                <View style={styles.modalDiv}>
                  <TouchableOpacity style={styles.selectionDiv}>
                    <Text style={styles.selectionDivText}>Today</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.selectionDiv}>
                    <Text style={styles.selectionDivText}>This Month</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.selectionDiv}>
                    <Text style={styles.selectionDivText}>Last 3 Months</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[styles.modalBody, {marginTop: 20}]}>
                <Text style={styles.modalBodyText}>Gender</Text>
                <View style={styles.modalDiv}>
                  <TouchableOpacity style={styles.selectionDiv}>
                    <Text style={styles.selectionDivText}>Male</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.selectionDiv}>
                    <Text style={styles.selectionDivText}>Female</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.selectionDiv}>
                    <Text style={styles.selectionDivText}>Other</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {patientdataarray?.length === 0 && (
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button1}>
              <FontAwesomeIcon icon={faMagnifyingGlass} style={styles.icon4} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button2}
              onPress={() => navigation.push('Addpatients')}>
              <FontAwesomeIcon icon={faUserPlus} style={{color: '#ffffff'}} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* Bottom Tabs Navigation */}
      <Bottomtabsnavigation colors={colors} tabs={tabs} />
    </>
  );
};

export default Patientslist;

const styles = StyleSheet.create({
  iconButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#dcdcde',
  },
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
    justifyContent: 'space-between',
  },
  icon: {
    padding: 10,
  },
  icon2: {
    color: 'lightgrey',
    padding: 10,
  },
  navbarText: {
    fontSize: 18,
    color: 'black',
    fontWeight: '500',
    letterSpacing: 1,
  },
  textInput: {
    borderWidth: 0.5,
    borderRadius: 4,
    marginVertical: 10,
    padding: 6,
    backgroundColor: '#f7fbff',
    borderColor: '#f7fbff',
    color: 'black',
    marginHorizontal: 14,
  },
  filter: {
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  filtertext: {
    fontSize: 12,
    color: '#ffffff',
    padding: 6,
    backgroundColor: '#267dff',
    letterSpacing: 0.5,
    borderRadius: 4,
  },
  section: {
    padding: 10,
    paddingHorizontal: 20,
  },
  icon3: {
    color: '#42adff',
    padding: 10,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  status: {
    backgroundColor: '#63E6BE',
    padding: 4,
    borderRadius: 4,
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: 0.5,
    fontSize: 10,
  },
  content1: {
    flexDirection: 'row',
    gap: 20,
  },
  p_details: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 6,
  },
  p_name: {
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#36cf3b',
    padding: 10,
    borderRadius: 4,
    marginTop: '20%',
  },
  button1: {
    backgroundColor: '#ebe9f0',
    padding: 16,
    borderRadius: 40,
  },
  button2: {
    backgroundColor: '#6544b8',
    padding: 16,
    borderRadius: 40,
  },
  buttons: {
    flexDirection: 'column',
    gap: 10,
    padding: 20,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: screenHeight * 0.4,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  modalContent: {
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  icon4: {
    padding: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectionDiv: {
    padding: 4,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ebedf0',
  },
  modalDiv: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  selectionDivText: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 10,
  },
  modalBodyText: {
    fontWeight: '600',
    fontSize: 14,
    marginVertical: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
