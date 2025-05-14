import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEllipsisVertical, faFilePrescription, faPlus} from '@fortawesome/free-solid-svg-icons';
import {faCalendarDays} from '@fortawesome/free-regular-svg-icons';
import DatePicker from 'react-native-date-picker';
import Bottomtabsnavigation from '../../components/doctorhomepage/bottomtabsnavigation';
import appointmentcalender from '../../assets/images/appointmentcalender.png';
import {fetchAppointmentFunction} from '../../slices/Addappointments';
import UserContext from '../../functions/usercontext';
import {GeneratePdf} from '../../components/GeneratePrescription/GeneratePrescription';

const Upcommingappointments = () => {
  const colors = '#6544b8';
  const tabs = 'calendar';
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState(
    new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    }),
  );
  const [open, setOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [generatingPdfId, setGeneratingPdfId] = useState(null);

  const {userData, setSelectedPatient} = useContext(UserContext);

  // Memoized formattedDate
  const formattedDate = useMemo(
    () =>
      new Date()
        .toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short',
        })
        .replace(',', '') + ' (India Standard Time)',
    [date],
  );

  // Memoized data object
  const data = useMemo(
    () => ({
      depart_id: userData?.depart_id,
      reception_id: userData?._id,
      fromdate: formattedDate,
      todate: formattedDate,
      status: 'Confirmed',
    }),
    [userData, formattedDate],
  );

  // Function to fetch appointments
  const fetchAppointments = useCallback(() => {
    dispatch(fetchAppointmentFunction(data));
  }, [dispatch, data]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const {appointmentdataarray} = useSelector(state => state.appointments);

  // Memoized filtered patients list
  const filteredPatients = useMemo(() => {
    return appointmentdataarray?.filter(patient => {
      const query = searchQuery.toLowerCase();
      return (
        patient.firstname.toLowerCase().includes(query) ||
        patient.mobilenumber.toLowerCase().includes(query)
      );
    });
  }, [appointmentdataarray, searchQuery]);

  // Callback to set today's date
  const handleSetToday = useCallback(() => {
    setDate(
      new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
      }),
    );
  }, []);

  // Callback to set tomorrow's date
  const handleSetTomorrow = useCallback(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(
      tomorrow.toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
      }),
    );
  }, []);

  const dataSelectionHandler = item => {
    setSelectedPatient(item);
    navigation.navigate('CreateRx');
  };

  const handleGeneratePdf = async (item) => {
    try {
      setIsGeneratingPdf(true);
      setGeneratingPdfId(item._id);
      await GeneratePdf(item, userData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert(
        'Error',
        'Failed to generate PDF. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsGeneratingPdf(false);
      setGeneratingPdfId(null);
    }
  };

  return (
    <>
      <StatusBar style={styles.StatusBar} animated backgroundColor="#ffffff" />
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>My first SPOT clinic</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faEllipsisVertical} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <TouchableOpacity
          style={styles.bodySection1}
          onPress={() => setOpen(true)}>
          <DatePicker
            modal
            mode="date"
            open={open}
            date={new Date()}
            onConfirm={selectedDate => {
              setOpen(false);
              setDate(
                selectedDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                }),
              );
            }}
            onCancel={() => setOpen(false)}
          />
          <FontAwesomeIcon icon={faCalendarDays} style={styles.icon2} />
          <Text style={styles.dateText}>{date}</Text>
        </TouchableOpacity>
        <View style={styles.days}>
          <TouchableOpacity style={styles.day} onPress={handleSetToday}>
            <Text style={styles.dayText}>
              Today {appointmentdataarray?.length}
            </Text>
          </TouchableOpacity>
         
        </View>
      </View>
      <View style={styles.container}>
        <TextInput
          name="search"
          placeholder="Search Name or Phone No"
          style={styles.textInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {appointmentdataarray?.length === 0 && (
          <View style={styles.card}>
            <View>
              <Image source={appointmentcalender} style={styles.logo} />
              <Text style={styles.appointmentText}>
                No Upcoming Appointments
              </Text>
            </View>
          </View>
        )}

        {appointmentdataarray?.length > 0 && (
          <FlatList
            data={filteredPatients}
            keyExtractor={item => item._id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.bodyContentDiv}
                onPress={() => {
                  dataSelectionHandler(item);
                }}>
                <View>
                  <View style={styles.section}>
                    <Text
                      style={[
                        styles.sectionText,
                        {fontWeight: '500', color: 'black'},
                      ]}>
                      {item.firstname}
                    </Text>
                    <Text
                      style={[
                        styles.sectionText,
                        {fontWeight: '500', color: 'black'},
                      ]}>
                      ({item.patientgender})
                    </Text>
                  </View>
                  <View
                    style={[styles.section, {justifyContent: 'space-between'}]}>
                    <Text style={styles.sectionText}>{item.mobilenumber}</Text>
                    <Text style={styles.sectionText}>{item.slot_id}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.prescriptionButton}
                  onPress={() => handleGeneratePdf(item)}
                  disabled={isGeneratingPdf}>
                  {isGeneratingPdf && generatingPdfId === item._id ? (
                    <ActivityIndicator size="small" color="red" />
                  ) : (
                    <FontAwesomeIcon icon={faFilePrescription} style={{color: 'red'}} size={24} />
                  )}
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.button2}
            onPress={() => navigation.navigate('Addappointments')}>
            <FontAwesomeIcon icon={faPlus} style={{color: '#ffffff'}} />
          </TouchableOpacity>
        </View>
      </View>
      <Bottomtabsnavigation colors={colors} tabs={tabs} />
    </>
  );
};

export default Upcommingappointments;

const styles = StyleSheet.create({
  prescriptionButton: {
    padding: 8,
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  navbar: {
    backgroundColor: '#ffffff',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    justifyContent: 'space-between',
  },
  icon: {
    padding: 10,
  },
  navbarText: {
    fontSize: 16,
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
    marginHorizontal: 20,
  },
  body: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    borderBottomColor: '#dcdcde',
    borderBottomWidth: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon2: {
    padding: 2,
  },
  dateText: {
    color: 'black',
    letterSpacing: 0.5,
  },
  bodySection1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  days: {
    flexDirection: 'row',
    gap: 6,
  },
  day: {
    backgroundColor: '#efebf0',
    padding: 3,
    borderRadius: 2,
    paddingHorizontal: 10,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
  },
  appointmentText: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    marginTop: 6,
  },
  card: {
    marginTop: '50%',
  },
  buttons: {
    flexDirection: 'column',
    gap: 10,
    padding: 20,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  button2: {
    backgroundColor: '#6544b8',
    padding: 16,
    borderRadius: 40,
  },
  bodyContent: {
    paddingHorizontal: 20,
  },
  bodyContentText: {
    fontSize: 14,
    color: 'black',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  bodyContentDiv: {
    backgroundColor: '#acfabd',
    marginTop: 10,
    borderRadius: 6,
    padding: 6,
    paddingHorizontal: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#059925',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '5%',
  },
  section: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 3,
  },
  sectionText: {
    fontSize: 14,
    color: 'grey',
    letterSpacing: 0.5,
    fontWeight: '500',
  },
});
