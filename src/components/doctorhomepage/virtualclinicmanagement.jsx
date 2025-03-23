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
  faHospital,
  faIndianRupee,
  faBuildingColumns,
} from '@fortawesome/free-solid-svg-icons';
import {faClock} from '@fortawesome/free-regular-svg-icons';
import {useNavigation} from '@react-navigation/native';

const Virtualclinicmanagement = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.card}>
      <Text style={styles.cardText}>VIRTUAL CLINIC MANAGEMENT</Text>
      <View style={styles.cardBody}>
        {/* <TouchableOpacity style={styles.cardContent}>
                         <View style={styles.contentDiv}>
                              <FontAwesomeIcon icon={faHospital} style={styles.icon} />
                         </View>
                         <Text style={styles.cardContentText} >Clinic</Text>
                         <Text style={styles.cardContentText} >Info</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cardContent}>
                         <View style={styles.contentDiv}>
                              <FontAwesomeIcon icon={faIndianRupee} style={styles.icon} />
                         </View>
                         <Text style={styles.cardContentText} >Consult</Text>
                         <Text style={styles.cardContentText} >Fees</Text>
                    </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => navigation.navigate('ApplyAttendence')}>
          <View style={styles.contentDiv}>
            <FontAwesomeIcon icon={faClock} style={styles.icon} />
          </View>
          <Text style={styles.cardContentText}>Attendence</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.cardContent}>
                         <View style={styles.contentDiv}>
                              <FontAwesomeIcon icon={faBuildingColumns} style={styles.icon} />
                         </View>
                         <Text style={styles.cardContentText} >Bank</Text>
                         <Text style={styles.cardContentText} >Details</Text>
                    </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default Virtualclinicmanagement;

const styles = StyleSheet.create({
  card: {
    borderColor: '#dcdcde',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 14,
    marginTop: 12,
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
    justifyContent: 'space-between',
    marginTop: 20,
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
