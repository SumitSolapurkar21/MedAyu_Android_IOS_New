import {
  Alert,
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowLeft,
  faIndianRupeeSign,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import UserContext from '../../functions/usercontext';
import {
  DeleteOpdItem,
  EditMobileBills,
  fetchservicetype,
  GetServiceAmount,
  getservicecategoryacctype,
  getserviceitemaccboth,
  UpdateMobileBills,
} from '../../api/api';
import axios from 'axios';
import {Button} from 'react-native-paper';

const EditBillItem = ({route}) => {
  const navigation = useNavigation();
  const {selectedPatient, billId} = route?.params;
  const [editArray, setEditArray] = useState([]);
  const {userData} = useContext(UserContext);

  //service type ....
  const [_serviceTypeSelected, _setServiceTypeSelected] = useState('');
  const [_serviceTypeArray, _setServiceTypeArray] = useState([]);

  //service category ......
  const [_serviceCategorySelected, _setServiceCategorySelected] = useState('');
  const [_serviceCategoryArray, _setServiceCategoryArray] = useState([]);

  //service item ......
  const [_serviceItemSelected, _setServiceItemSelected] = useState('');
  const [_serviceItemArray, _setServiceItemArray] = useState([]);

  const [selectedItemCharge, setSelectedItemCharge] = useState('');

  //backHandler ...
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('fetchData : ', {
          reception_id: userData?._id,
          hospital_id: userData?.hospital_id,
          patient_id: selectedPatient?.patient_id,
          bill_id: billId,
        });
        const res = await axios.post(EditMobileBills, {
          reception_id: userData?._id,
          hospital_id: userData?.hospital_id,
          patient_id: selectedPatient?.patient_id,
          bill_id: billId,
        });

        setEditArray(res.data.data);
        console.log('setEditArray :', res.data.data);
        const {billname_id, outbillingtype_id, servicetype_id} =
          res.data.data[0];

        // Set initial values for dropdowns based on the data
        _setServiceTypeSelected(servicetype_id || '');
        _setServiceCategorySelected(outbillingtype_id || '');
        _setServiceItemSelected(billname_id || '');

        // Extract quantity and set it in formData
        const quantityFromEditArray = res.data.data[0]?.quantity || '';
        setFormData(prevData => ({
          ...prevData,
          quantity: quantityFromEditArray,
        }));
      } catch (error) {
        // console.error(error);
      }
    };

    // Include necessary dependencies in the dependency array
    fetchData();
  }, [
    userData?.hospital_id,
    userData?._id,
    selectedPatient?.patient_id,
    billId,
  ]);

  const [formData, setFormData] = useState({
    totalamount: selectedItemCharge?.amount,
  });

  //
  const handleInputChange = (fieldName, value) => {
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

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

  //   category ...
  useEffect(() => {
    const _fetchservicecategory = async () => {
      try {
        await axios
          .post(getservicecategoryacctype, {
            hospital_id: userData?.hospital_id,
            servicetype_id: _serviceTypeSelected,
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

  useEffect(() => {
    const _fetchserviceitem = async () => {
      try {
        await axios
          .post(getserviceitemaccboth, {
            hospital_id: userData?.hospital_id,
            servicetype_id: _serviceTypeSelected,
            servicecategory_id: _serviceCategorySelected,
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
            service_id: _serviceItemSelected,
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

  // total amount for edit item....
  const _totalamount =
    parseInt(formData.quantity) * parseInt(selectedItemCharge?.amount);

  // bill service array ......
  const servicesArray = [
    {
      amount: selectedItemCharge.amount,
      servicetype: editArray[0]?.servicetype,
      billname: selectedItemCharge.outbillingname,
      outbillingtype: selectedItemCharge.outbillingtype,
      quantity: formData.quantity,
      servicetype_id: _serviceTypeSelected,
      outbillingtype_id: _serviceCategorySelected,
      billname_id: _serviceItemSelected,
    },
  ];

  //edit bill items .....
  const submitBillItemHandler = async () => {
    try {
      await axios
        .post(UpdateMobileBills, {
          bill_id: billId,
          reception_id: userData?._id,
          hospital_id: userData?.hospital_id,
          nettotal: formData.quantity * selectedItemCharge.amount,
          servicesArray,
        })
        .then(res => {
          if (res.data.status === true) {
            Alert.alert(res.data.message);
            navigation.navigate('Billhome');
          } else {
            console.warn(`${res.data.message}`);
          }
        });
    } catch (error) {
      // console.error(error);
    }
  };

  // delete Handler :
  const deleteHandler = async () => {
    try {
      await axios
        .post(DeleteOpdItem, {
          bill_id: billId,
          servicesArray: [servicesArray],
        })
        .then(res => {
          if (res.data.status === true) {
            navigation.navigate('Billhome');
          } else {
            console.error(`${res.data.message}`);
          }
        });
    } catch (error) {
      // console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.navbarText}>Edit Bill</Text>
        </TouchableOpacity>
      </View>

      {/*  */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.cardWrapper}>
          <Text style={styles.label}>Service Type</Text>
          <View style={styles.listWrapper}>
            {_serviceTypeArray &&
              _serviceTypeArray?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={
                    _serviceTypeSelected === item._id
                      ? styles.selectedOption
                      : styles.selectpatientview
                  }
                  onPress={() => _setServiceTypeSelected(item._id)}>
                  <Text style={styles.selectpatientviewtext}>
                    {item?.servicetype}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>

        <View style={styles.cardWrapper}>
          <Text style={styles.label}>Service Category</Text>
          <View style={styles.listWrapper}>
            {_serviceCategoryArray &&
              _serviceCategoryArray?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={
                    _serviceCategorySelected === item._id
                      ? styles.selectedOption
                      : styles.selectpatientview
                  }
                  onPress={() => _setServiceCategorySelected(item._id)}>
                  <Text style={styles.selectpatientviewtext}>
                    {item?.servicecategory}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>

        <View style={styles.cardWrapper}>
          <Text style={styles.label}>Service Item</Text>
          <View style={styles.listWrapper}>
            {_serviceItemArray &&
              _serviceItemArray?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={
                    _serviceItemSelected === item._id
                      ? styles.selectedOption
                      : styles.selectpatientview
                  }
                  onPress={() => _setServiceItemSelected(item._id)}>
                  <Text style={styles.selectpatientviewtext}>
                    {item?.outbillingname}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>

        <View style={styles.grpMain}>
          <View>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              mode="outlined"
              label="Quantity"
              placeholder="Quantity"
              style={styles.input}
              value={formData.quantity}
              onChangeText={text => handleInputChange('quantity', text)}
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
        <Text style={{fontWeight: '600', marginHorizontal: 20, color: 'black'}}>
          Total Amount : &nbsp; &nbsp;
          <FontAwesomeIcon icon={faIndianRupeeSign} size={10} />
          &nbsp; &nbsp;
          {_totalamount || selectedItemCharge?.amount}
        </Text>

        <View style={styles.btngrp}>
          <Button
            style={styles.btn}
            mode="contained"
            onPress={() => {
              submitBillItemHandler();
            }}>
            Update
          </Button>
          <Button
            style={styles.btn}
            mode="contained"
            onPress={() => {
              deleteHandler();
            }}>
            Delete
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditBillItem;

const styles = StyleSheet.create({
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
    padding: 0,
    fontWeight: '400',
  },
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
    marginHorizontal: 20,
    marginTop: 20,
  },
  label: {
    fontWeight: '600',
  },
  btngrp: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 10,
    width: 150,
  },
  grpMain: {
    margin: 20,
    flexDirection: 'row',
    gap: 20,
  },
});
