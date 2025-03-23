import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCalendarPlus,
  faFileInvoice,
  faScroll,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';

const Quickactions = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.card}>
      <Text style={styles.cardText}>QUICK ACTIONS</Text>
      <View style={styles.cardBody}>
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => navigation.navigate('Addpatients')}>
          <View style={styles.contentDiv}>
            <FontAwesomeIcon icon={faUserPlus} style={styles.icon} />
          </View>
          <Text style={styles.cardContentText}>New</Text>
          <Text style={styles.cardContentText}>Patient</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => navigation.navigate('Addappointments')}>
          <View style={styles.contentDiv}>
            <FontAwesomeIcon icon={faCalendarPlus} style={styles.icon} />
          </View>
          <Text style={styles.cardContentText}>Add</Text>
          <Text style={styles.cardContentText}>Appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => navigation.navigate('CreateRx')}>
          <View style={styles.contentDiv}>
            <FontAwesomeIcon icon={faScroll} style={styles.icon} />
          </View>
          <Text style={styles.cardContentText}>Create</Text>
          <Text style={styles.cardContentText}>RX</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => navigation.navigate('Billhome')}>
          <View style={styles.contentDiv}>
            <FontAwesomeIcon icon={faFileInvoice} style={styles.icon} />
          </View>
          <Text style={styles.cardContentText}>Add</Text>
          <Text style={styles.cardContentText}>Bill</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.cardContent}>
                         <View style={styles.contentDiv}>
                              <FontAwesomeIcon icon={faUserPlus} style={styles.icon} />
                         </View>
                         <Text style={styles.cardContentText} >New</Text>
                         <Text style={styles.cardContentText} >Patient</Text>
                    </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default Quickactions;

const styles = StyleSheet.create({
  card: {
    borderColor: '#dcdcde',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 14,
  },
  cardText: {
    fontWeight: '600',
    fontSize: 12,
    color: 'black',
  },
  icon: {
    color: '#07255a',
    padding: 12,
    textAlign: 'center',
  },
  cardBody: {
    flexDirection: 'row',
    // justifyContent: "space-between",
    marginTop: 20,
    gap: '10%',
  },

  cardContentText: {
    color: '#07255a',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
  contentDiv: {
    backgroundColor: '#dce0e6',
    padding: 10,
    borderRadius: 10,
    width: 45,
    alignSelf: 'center',
    marginBottom: 6,
  },
});
