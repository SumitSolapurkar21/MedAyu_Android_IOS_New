import React, {useContext, useState, useEffect} from 'react';
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft, faCalendarDays} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import UserContext from '../../functions/usercontext';
import DatePicker from 'react-native-date-picker';
import {addopdassessment} from '../../api/api';
import axios from 'axios';

const Editfollowup = ({route}) => {
  const navigation = useNavigation();
  const {userData, selectedPatient} = useContext(UserContext);
  const {data} = route?.params;

  const [selectedDate, setSelectedDate] = useState(new Date(data?.followup_date));
  const [numberInput, setNumberInput] = useState(data?.followup_days || '');
  const [day, setDay] = useState(data?.followup_day || '');
  const [open, setOpen] = useState(false);
  const [unit, setUnit] = useState('Day'); // "Day", "Week", or "Month"

  // Function to get the day of the week
  const getDayOfWeek = date => {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days[date.getDay()];
  };

  // Function to calculate the next date based on unit and number of days
  const calculateDate = (baseDate, number, unit) => {
    const newDate = new Date(baseDate);
    if (unit === 'Day') {
      newDate.setDate(baseDate.getDate() + parseInt(number || 0, 10));
    } else if (unit === 'Week') {
      newDate.setDate(baseDate.getDate() + parseInt(number || 0, 10) * 7);
    } else if (unit === 'Month') {
      newDate.setMonth(baseDate.getMonth() + parseInt(number || 0, 10));
    }
    return newDate;
  };

  const handleUnitChange = newUnit => {
    setUnit(newUnit);
    const newDate = calculateDate(new Date(), numberInput, newUnit);
    setSelectedDate(newDate);
  };

  const handleDateChange = date => {
    setSelectedDate(date);
    const diffInDays = Math.floor((date - new Date()) / (1000 * 60 * 60 * 24));
    setNumberInput(diffInDays.toString());
  };

  const SubmitHandler = async () => {
    const data = {
      followup_date: selectedDate.toISOString().split('T')[0],
      followup_days: numberInput || '0',
      followup_day: day,
    };

    try {
      await axios
        .post(addopdassessment, {
          hospital_id: userData?.hospital_id,
          reception_id: userData?._id,
          opdfollowuparray: data,
          api_type: 'OPD-FOLLOW-UP',
          uhid: selectedPatient?.patientuniqueno,
          mobilenumber: selectedPatient?.mobilenumber,
          patient_id: selectedPatient?.patient_id,
          appoint_id: selectedPatient?.appoint_id
        })
        .then(res => {
          if (res.data.status === true) {
            Alert.alert('Success !!', 'Follow up date Updated Successfully');
            navigation.goBack();
          } else {
            Alert.alert('Error !!', 'Follow up date Not Updated');
          }
        });
    } catch (error) {
      Alert.alert('Error !!', error.message);
    }
  };

  // Update day whenever selectedDate changes
  useEffect(() => {
    setDay(getDayOfWeek(selectedDate));
  }, [selectedDate]);

  

  return (
    <>
      <StatusBar
        style={styles.StatusBar}
        animated={false}
        backgroundColor="#ffffff"
      />

      {/* Header */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.navbarText}>Edit Follow up date</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* Current Follow-up Details */}
        <View style={styles.categoryDiv}>
          <Text style={styles.categoryText}>Current Follow-up Details</Text>
          <View style={styles.sympDiv}>
            <View style={styles.sympDivOuter}>
              <View style={styles.sympDivInner}>
                <Text style={styles.label}>Follow-up Date</Text>
                <Text>{data?.followup_date}</Text>
              </View>
              <View style={styles.sympDivInner}>
                <Text style={styles.label}>Days</Text>
                <Text>{data?.followup_days}</Text>
              </View>
              <View style={styles.sympDivInner}>
                <Text style={styles.label}>Day</Text>
                <Text>{data?.followup_day}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Number Input */}
        <View style={styles.number}>
          <TextInput
            style={styles.numberInput}
            keyboardType="numeric"
            placeholder="0"
            value={numberInput}
            onChangeText={text => {
              setNumberInput(text);
              const newDate = calculateDate(new Date(), text, unit);
              setSelectedDate(newDate);
            }}
          />
        </View>

        {/* Unit Selector */}
        <View style={styles.cardContainer}>
          {['Day', 'Week', 'Month'].map(item => (
            <TouchableOpacity
              key={item}
              style={[
                styles.card,
                unit === item && {backgroundColor: '#dce0e6'},
              ]}
              onPress={() => handleUnitChange(item)}>
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date Picker */}
        <View>
          <TouchableOpacity
            style={styles.segButton}
            onPress={() => setOpen(true)}>
            <FontAwesomeIcon icon={faCalendarDays} style={styles.icon} />
            <Text style={styles.segText}>
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </TouchableOpacity>

          <DatePicker
            modal
            mode="date"
            open={open}
            date={selectedDate}
            onConfirm={date => {
              setOpen(false);
              handleDateChange(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </View>

        {/* Save Button */}
        <View style={styles.loginButton}>
          <TouchableOpacity
            onPress={SubmitHandler}
            style={[styles.buttonDiv, {backgroundColor: '#1b55f5'}]}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default Editfollowup;

const styles = StyleSheet.create({
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
    padding: 9,
    fontWeight: '400',
  },
  navbarText: {
    fontSize: 18,
    color: 'black',
    fontWeight: '400',
  },
  container: {
    flex: 1,
    backgroundColor: '#f7f7fc',
  },
  number: {
    backgroundColor: '#dce0e6',
    padding: 10,
    borderRadius: 10,
    margin: 26,
    alignSelf: 'center',
    width: '40%',
  },
  numberInput: {
    fontSize: 36,
    textAlign: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: '2%',
  },
  card: {
    borderWidth: 1,
    padding: 4,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderColor: '#dcdcde',
  },
  segButton: {
    justifyContent: 'center',
    marginVertical: '10%',
    flexDirection: 'row',
    gap: 20,
  },
  segText: {
    fontSize: 16,
    fontWeight: '500',
  },
  categoryDiv: {
    padding: 10,
  },
  categoryText: {
    fontWeight: '500',
    letterSpacing: 0.5,
    fontSize: 16,
    color: '#000000',
    marginBottom: 6,
  },
  sympDiv: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 4,
    borderColor: '#e6e6e6',
    borderWidth: 1.5,
    marginBottom: 10,
  },
  label: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
  },
  sympDivOuter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  sympDivInner: {
    flex: 1,
    minWidth: '45%',
  },
});