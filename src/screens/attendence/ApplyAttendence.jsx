import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  BackHandler,
  Alert,
  Button,
  TouchableOpacity,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import axios from 'axios';
import {AddAttendence} from '../../api/api';
import UserContext from '../../functions/usercontext';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';

const ApplyAttendance = () => {
  const navigation = useNavigation();
  const {userData} = useContext(UserContext);
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  const device = useCameraDevice('back');

  const [isCameraVisible, setIsCameraVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsCameraVisible(true);
    }, 100); // Small delay to ensure proper layout
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      if (!isScanned && codes.length > 0) {
        setIsScanned(true);
        const data = codes[0]?.value.split(',');
        if (data.length === 4) {
          AddAttendenceHandler(data[0], data[2], data[3]);
        }
      }
    },
  });

  if (!hasPermission) return <Text>No Camera Permission</Text>;
  if (!device) return <Text>No Camera Device Found</Text>;

  const AddAttendenceHandler = async (logindate, logintime, qrid) => {
    try {
      const response = await axios.post(AddAttendence, {
        reception_id: userData?._id,
        hospital_id: userData?.hospital_id,
        login_time: logintime,
        login_date: logindate,
        location: 'Nagpur',
        qrid: qrid,
      });

      const {message, status} = response.data;
      Alert.alert(message);
      if (status) {
        navigation.navigate('Doctorhomepage');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={18} />
        </TouchableOpacity>
        <Text style={styles.navbarText}>Apply Attendance</Text>
      </View>

      {!isScanned && isCameraVisible ? (
        <View style={styles.cameraWrapper}>
          <View style={styles.cameraContainer}>
            <Camera
              style={styles.camera}
              device={device}
              isActive={true}
              codeScanner={codeScanner}
              torch="off"
            />
          </View>
        </View>
      ) : (
        <View style={styles.rescanContainer}>
          <Text style={styles.scannedText}>QR Code Scanned Successfully!</Text>
          <Button title="Rescan" onPress={() => setIsScanned(false)} />
        </View>
      )}
    </View>
  );
};

export default ApplyAttendance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cameraWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    width: 310,
    height: 310,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(0,0,0,0.8)',
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden', // Prevents overflow issues
  },
  camera: {
    width: '100%', // Ensure it takes full width of the container
    height: '100%', // Ensure it takes full height of the container
  },
  rescanContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannedText: {
    fontSize: 16,
    marginBottom: 10,
  },
  navbar: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomColor: '#dcdcde',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  navbarText: {
    fontSize: 18,
    fontWeight: '500',
  },
});
