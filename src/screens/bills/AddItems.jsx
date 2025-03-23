import {
  Alert,
  BackHandler,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';

import {Button, Dialog, Portal} from 'react-native-paper';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {Dropdown} from 'react-native-element-dropdown';
import {
  faArrowLeft,
  faIndianRupeeSign,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fetchservicetype,
  getopdservicesapi,
  GetServiceAmount,
  getservicecategoryacctype,
  getserviceitemaccboth,
  UpdateMobileOPDServices,
} from '../../api/api';
import UserContext from '../../functions/usercontext';

const BillAddItems = ({route}) => {
  const navigation = useNavigation();
  const {userData} = useContext(UserContext);
  const {bill_type, selectedPatient} = route.params;
  const [itemQuantity, setItemQuantity] = useState('1');
  const [tax, setTax] = useState('');

  const [opdServices, setOpdServices] = useState([]);
  const [selectedItemCharge, setSelectedItemCharge] = useState('');

  //diaglog...
  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  //backHandler ...
  useEffect(() => {
    const backAction = () => {
      navigation.goBack('EpatientDetails');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const taxList = [
    {
      label: 'With Tax',
      value: '1',
    },
    {
      label: 'Without Tax',
      value: '2',
    },
  ];

  console.log(selectedPatient);

  // api ....
  useEffect(() => {
    const GetOPDServices = async () => {
      try {
        const GetOPDServicesRes = await axios.post(getopdservicesapi, {
          hospital_id: userData?.hospital_id,
        });

        const data = GetOPDServicesRes.data.servicesArray || [];

        console.log({data});
        setOpdServices(data);
      } catch (error) {
        console.error('Error : ', error);
      }
    };
    GetOPDServices();
  }, []);

  //service type ....
  const [_serviceTypeSelected, _setServiceTypeSelected] = useState(null);
  const [_serviceTypeArray, _setServiceTypeArray] = useState([]);

  useEffect(() => {
    const _fetchservicetype = async (retryCount = 3) => {
      try {
        await axios
          .post(fetchservicetype, {
            hospital_id: userData?.hospital_id,
          })
          .then(res => {
            console.log('servicetype : ', res.data.data);
            _setServiceTypeArray(res.data.data);
          });
      } catch (error) {
        if (retryCount > 0) {
          setTimeout(() => _fetchservicetype(retryCount - 1), 2000);
        } else {
          Alert.alert('Error fetching patients', error.message);
        }
      }
    };
    if (userData?.hospital_id !== '' || undefined || null) _fetchservicetype();
  }, []);

  //service category ......

  const [_serviceCategorySelected, _setServiceCategorySelected] =
    useState(null);
  const [_serviceCategoryArray, _setServiceCategoryArray] = useState([]);

  useEffect(() => {
    const _fetchservicecategory = async () => {
      try {
        await axios
          .post(getservicecategoryacctype, {
            hospital_id: userData?.hospital_id,
            servicetype_id: _serviceTypeSelected?._id,
          })
          .then(res => {
            console.log('_fetchservicecategory', res.data);
            _setServiceCategoryArray(res.data.data);
          });
      } catch (error) {
        // console.error(error);
      }
    };
    if (_serviceTypeSelected !== '' || undefined || null)
      _fetchservicecategory();
  }, [_serviceTypeSelected]);

  //service item ......
  const [_serviceItemDropdown, _setServiceItemDropdown] = useState(false);
  const [_serviceItemSelected, _setServiceItemSelected] = useState(null);
  const [_serviceItemArray, _setServiceItemArray] = useState([]);

  useEffect(() => {
    const _fetchserviceitem = async () => {
      try {
        await axios
          .post(getserviceitemaccboth, {
            hospital_id: userData?.hospital_id,
            servicetype_id: _serviceTypeSelected?._id,
            servicecategory_id: _serviceCategorySelected?._id,
          })
          .then(res => {
            console.log('getserviceitemaccboth : ', res.data.data);
            _setServiceItemArray(res.data.data);
          });
      } catch (error) {
        // console.error(error);
      }
    };
    _fetchserviceitem();
  }, [_serviceTypeSelected, _serviceCategorySelected]);

  useEffect(() => {
    const serviceAmountRes = async () => {
      try {
        await axios
          .post(GetServiceAmount, {
            service_id: _serviceItemSelected?._id,
          })
          .then(res => {
            console.log('GetServiceAmount', res.data);
            setSelectedItemCharge(res.data);
          });
      } catch (error) {
        // console.error(error);
      }
    };
    if (_serviceItemSelected != '' || undefined) serviceAmountRes();
  }, [_serviceItemSelected]);

  // while add data ....
  const servicesArray = [
    {
      amount: selectedItemCharge.amount,
      billname: selectedItemCharge.outbillingname,
      billname_id: _serviceItemSelected?._id,
      outbillingtype: selectedItemCharge.outbillingtype,
      outbillingtype_id: _serviceCategorySelected?._id,
      quantity: itemQuantity,
      servicetype: _serviceTypeSelected?.servicetype,
      servicetype_id: _serviceTypeSelected?._id,
    },
  ];

  console.log({servicesArray});
  //   // while edit data .......
  //   const servicesArray2 = [
  //     {
  //       amount: selectedItemCharge.amount,
  //       billname: selectedItemCharge.outbillingname,
  //       outbillingtype: selectedItemCharge.outbillingtype,
  //       bill_id: billHistoryArray,
  //     },
  //   ];

  // submit Bill Item Handler .......

  const submitBillItemHandler = async () => {
    console.log('submitBillItemHandler ; ', {
      reception_id: userData?._id,
      hospital_id: userData?.hospital_id,
      fullname: selectedPatient?.firstname,
      firstname: selectedPatient?.firstname,
      mobilenumber: selectedPatient?.mobilenumber,
      patient_id: selectedPatient?.patient_id,
      uhid: selectedPatient?.patientuniqueno,
      nettotal: itemQuantity * selectedItemCharge.amount,
      servicesArray,
    });
    await axios
      .post(UpdateMobileOPDServices, {
        reception_id: userData?._id,
        hospital_id: userData?.hospital_id,
        fullname: userData?.firstname,
        firstname: userData?.firstname,
        mobilenumber: selectedPatient?.mobilenumber,
        patient_id: selectedPatient?.patient_id,
        uhid: selectedPatient?.patientuniqueno,
        nettotal: itemQuantity * selectedItemCharge.amount,
        servicesArray,
      })
      .then(res => {
        console.log('submit res 22222 : ', res.data);
        if (res.data.status === true) {
          Alert.alert("Data Updated")
          navigation.goBack();
        } else {
          console.warn(`${res.data.message}`);
        }
      });

    // showDialog(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={18} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.navbarText}>Add Bill</Text>
        </TouchableOpacity>
      </View>
      {/* card 1 */}
      <View style={styles.card}>
        <View style={styles.cardWrapper}>
          <Text style={styles.label}>Service Type</Text>
          <View style={styles.listWrapper}>
            {_serviceTypeArray &&
              _serviceTypeArray?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={
                    _serviceTypeSelected?.servicetype === item.servicetype
                      ? styles.selectedOption
                      : styles.selectpatientview
                  }
                  onPress={() => _setServiceTypeSelected(item)}>
                  <Text style={styles.selectpatientviewtext}>
                    {item?.servicetype}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
        {_serviceCategoryArray?.length > 0 && (
          <View style={styles.cardWrapper}>
            <Text style={styles.label}>Service Category</Text>
            <View style={styles.listWrapper}>
              {_serviceCategoryArray &&
                _serviceCategoryArray?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={
                      _serviceCategorySelected?.servicecategory ===
                      item.servicecategory
                        ? styles.selectedOption
                        : styles.selectpatientview
                    }
                    onPress={() => _setServiceCategorySelected(item)}>
                    <Text style={styles.selectpatientviewtext}>
                      {item?.servicecategory}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        )}
        {_serviceItemArray?.length > 0 && (
          <View style={styles.cardWrapper}>
            <Text style={styles.label}>Service Item</Text>
            <View style={styles.listWrapper}>
              {_serviceItemArray &&
                _serviceItemArray?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={
                      _serviceItemSelected?.outbillingname ===
                      item.outbillingname
                        ? styles.selectedOption
                        : styles.selectpatientview
                    }
                    onPress={() => _setServiceItemSelected(item)}>
                    <Text style={styles.selectpatientviewtext}>
                      {item?.outbillingname}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        )}

        {/* </View> */}
        <View style={styles.grpMain}>
          <View>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              mode="outlined"
              label="Quantity"
              placeholder="Quantity"
              style={styles.input}
              value={itemQuantity}
              onChangeText={e => setItemQuantity(e)}
              keyboardType="numeric"
            />
          </View>
          <View>
            <Text style={styles.label}>Rate(Price/Unit)</Text>
            <TextInput
              mode="outlined"
              label="Rate(Price/Unit)"
              placeholder="Rate(Price/Unit)"
              style={styles.input}
              value={selectedItemCharge.amount}
              editable={false}
            />
          </View>
        </View>
        <View style={styles.grpMain1}>
          <View>
            <Text style={styles.label}>Tax</Text>
            <View style={styles.listWrapper}>
              {taxList &&
                taxList?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={
                      tax?.value === item.value
                        ? styles.selectedOption
                        : styles.selectpatientview
                    }
                    onPress={() => setTax(item)}>
                    <Text style={styles.selectpatientviewtext}>
                      {item?.label}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </View>
        <Text style={{fontWeight: '600', marginTop: 20, color: 'black'}}>
          Total Amount : &nbsp; &nbsp;
          <FontAwesomeIcon icon={faIndianRupeeSign} size={10} />
          &nbsp; &nbsp;
          {itemQuantity * selectedItemCharge.amount || '0.00'}
        </Text>
      </View>

      {/* dialog box */}
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Success</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Data Updated !</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                hideDialog(),
                  navigation.goBack(),
                  bill_type === 'ADD'
                    ? navigation.replace('BillLayout')
                    : navigation.replace('BillEditItems');
              }}>
              Done
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Button
        style={{
          position: 'absolute',
          bottom: 0,
          alignSelf: 'center',
          marginVertical: 10,
        }}
        mode="contained"
        onPress={() => {
          submitBillItemHandler();
        }}>
        Save
      </Button>
    </View>
  );
};

export default BillAddItems;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    marginTop: 10,
    marginHorizontal: 12,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 4,
    borderRadius: 8,
    padding: 6,
    paddingBottom: 10,
  },

  grpMain: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    marginBottom: 20,
  },
  dropdown: {
    marginBottom: 8,
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
  icon: {},
  navbarText: {
    fontSize: 18,
    fontWeight: '500',
  },
  listWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 10,
  },
  selectpatientviewtext: {
    color: '#fff',
  },
  selectpatientview: {
    backgroundColor: 'green',
    paddingHorizontal: 10,
    padding: 4,
    borderRadius: 10,
  },
  selectedOption: {
    backgroundColor: 'orange',
    paddingHorizontal: 10,
    padding: 4,
    borderRadius: 10,
  },
  cardWrapper: {
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    // width: '100%',
    paddingHorizontal: 10,
  },
  label: {
    fontWeight: '600',
  },
});
