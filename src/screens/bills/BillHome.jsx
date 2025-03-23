import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Modal,
  ScrollView,
  Pressable,
  BackHandler,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import {Image} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {ToastAndroid} from 'react-native';
import axios from 'axios';
import {Appbar, MD2Colors} from 'react-native-paper';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faAngleDown,
  faArrowLeft,
  faCirclePlus,
  faIndianRupeeSign,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {
  addpatientbill,
  DeleteOpdItem,
  getallbillsformobile,
  getpatients,
} from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dropdown} from 'react-native-element-dropdown';
import {useDispatch, useSelector} from 'react-redux';
import UserContext from '../../functions/usercontext';
import {fetchPatientFunction} from '../../slices/AddpatientSlice';

const BillHome = () => {
  const navigation = useNavigation();
  const [patientArray, setPatientArray] = useState([]);
  const [billPatientData, setBillPatientData] = useState(null);
  const [receivedAmt, setReceivedAmt] = useState('');
  const [discountAmt, setDiscountAmt] = useState('');
  const [discountAmtRs, setDiscountAmtRs] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [displayedPatients, setDisplayedPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const {userData} = useContext(UserContext);
  //   const {uhid, patient_id, reception_id, hospital_id, mobilenumber} =
  //     patientsData;

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

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          await patientBillData();
        } catch (error) {
          console.error('Error:', error);
        }
      };

      fetchData();
    }, [selectedPatient]),
  );
  const patientBillData = async () => {
    await axios
      .post(getallbillsformobile, {
        uhid: selectedPatient?.patientuniqueno,
        patient_id: selectedPatient?.patient_id,
        reception_id: userData?.reception_id,
        hospital_id: userData?.hospital_id,
        mobilenumber: selectedPatient?.mobilenumber,
      })
      .then(res => {
        console.log(res.data);
        setBillPatientData(res.data);
        // return res.data;
      });
  };
  let totalAmtAfterDiscountPercent =
    billPatientData?.totalamount -
    (billPatientData?.totalamount * discountAmt ?? 0) / 100;

  let totalAmtAfterDiscountRupees =
    billPatientData?.totalamount - discountAmtRs ?? 0;

  let TOTAL_AMOUNT =
    discountAmtRs == ''
      ? totalAmtAfterDiscountPercent
      : totalAmtAfterDiscountRupees;

  let totalbalanceTemp = TOTAL_AMOUNT - receivedAmt;

  let totalbalance = parseInt(billPatientData?.totalbalance + totalbalanceTemp);
  let previousbalance = parseInt(billPatientData?.totalbalance);

  let today = new Date();
  let currentDate =
    today.getDate().toString().padStart(2, '0') +
    '-' +
    (today.getMonth() + 1).toString().padStart(2, '0') +
    '-' +
    today.getFullYear();

  let date =
    today.getFullYear() +
    '-' +
    (today.getMonth() + 1).toString().padStart(2, '0') +
    '-' +
    today.getDate().toString().padStart(2, '0');

  const addMobileBillHandler = async () => {
    try {
      const billDataRes = await axios.post(addpatientbill, {
        uhid: selectedPatient?.patientuniqueno,
        patient_id: selectedPatient?.patient_id,
        reception_id: userData?.reception_id,
        hospital_id: userData?.hospital_id,
        invoiceno: billPatientData?.invoiceno,
        totalamount: billPatientData?.totalamount,
        totalbalance: totalbalance,
        OutBillArrayss: billPatientData?.data,
        mobilepaymentdate: date,
        mobilediscountpercentage: discountAmt,
        mobilediscountrupees: discountAmtRs,
        mobilereceiveamount: receivedAmt,
        mobilenumber: selectedPatient?.mobilenumber,
      });
      return billDataRes;
    } catch (error) {
      // console.error(error);
    }
  };
  // delete Handler :
  const deleteHandler = async data => {
    console.log(data);
    const {bill_id, serviceArray} = data;
    try {
      await axios
        .post(DeleteOpdItem, {
          bill_id: bill_id,
          servicesArray: [serviceArray],
        })
        .then(res => {
          res.data.status === true
            ? patientBillData()
            : console.error(`${res.data.message}`);
        });
    } catch (error) {
      // console.error(error);
    }
  };

  // get patients list ....
  useEffect(() => {
    const getpatientsHandler = async (retryCount = 3) => {
      try {
        const response = await axios.post(getpatients, {
          doctor_id: userData?._id,
          hospital_id: userData?.hospital_id,
        });
        if (response.data.data.length > 0) {
          console.log('getpatients : ', response.data.data);
          setPatientArray(response.data.data);
          setLoading(false);
        }
      } catch (error) {
        if (retryCount > 0) {
          setTimeout(() => getpatientsHandler(retryCount - 1), 2000);
        } else {
          Alert.alert('Error fetching patients', error.message);
        }
      }
    };

    getpatientsHandler();
  }, [userData]);

  useEffect(() => {
    if (!Array.isArray(patientArray)) {
      console.error('patientArray is not an array:', patientArray);
      setPatientArray([]); // Ensure it's always an array
      return;
    }

    setDisplayedPatients(patientArray.slice(0, 3));
    setFilteredPatients(patientArray);
  }, [patientArray]);

  const handleSearch = query => {
    setSearchQuery(query);
    if (query.trim() === '') {
      // Show only 3 when search is empty
      setDisplayedPatients(patientArray?.slice(0, 3));
    } else {
      // Filter based on name
      const filtered = patientArray?.filter(patient =>
        patient.firstname.toLowerCase().includes(query.toLowerCase()),
      );
      setDisplayedPatients(filtered); // Show all matching results
    }
  };

  return (
    <>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            animating={true}
            color={MD2Colors.red800}
            size={70}
            style={styles.activityIndicator}
          />
        </View>
      )}
      {/* Header */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.navbarText}>Bills</Text>
        </TouchableOpacity>
      </View>

      <SafeAreaView style={styles.container}>
        <ScrollView vertical showsVerticalScrollIndicator={true}>
          <TextInput
            placeholder="Search patients"
            style={styles.serachinput}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <View style={styles.listWrapper}>
            {displayedPatients.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.selectpatientview}
                onPress={() => setSelectedPatient(item)}>
                <Text style={styles.selectpatientviewtext}>
                  {item?.firstname}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.card}>
            <View style={styles.main}>
              <View>
                <Text style={{color: 'black'}}>Invoice No.</Text>
                <Text>{billPatientData?.invoiceno}</Text>
              </View>
              <View>
                <Text style={{color: 'black', textAlign: 'left'}}>Date</Text>
                <Text>{currentDate}</Text>
              </View>
            </View>
          </View>
          <View style={styles.body}>
            <View style={styles.text}>
              <Text>{billPatientData?.fullname}</Text>
            </View>
            <View style={styles.title}>
              <FontAwesomeIcon icon={faAngleDown} style={styles.icon} />
              <Text style={{color: 'white'}}>Bill Items</Text>
            </View>
            <ScrollView vertical style={styles.scrollView}>
              {billPatientData?.status === false
                ? ToastAndroid.show(
                    `${billPatientData?.message}`,
                    ToastAndroid.SHORT,
                  )
                : billPatientData?.data.map((res, i) => {
                    return (
                      <TouchableOpacity
                        style={styles.billDiv}
                        key={i}
                        onPress={() => {
                          navigation.navigate('BillEditItemForm', {
                            bill_id: res.bill_id,
                          });
                        }}>
                        <View style={styles.billContent}>
                          <Text
                            style={[
                              styles.billTxt,
                              {fontWeight: 'bold', fontSize: 14},
                            ]}>
                            #{res.srno}. {res.outbillingtype}
                          </Text>
                          <Text
                            style={[
                              styles.billTxt,
                              {fontWeight: 'bold', fontSize: 14},
                            ]}>
                            <FontAwesomeIcon
                              icon={faIndianRupeeSign}
                              style={styles.icon}
                            />
                            &nbsp;{res.amount}
                          </Text>
                        </View>
                        <View style={styles.billContent}>
                          <Text style={styles.billTxt}>Item Subtotal</Text>
                          <Text style={styles.billTxt}>
                            {res.quantity} x {res.amount} = &nbsp;
                            <FontAwesomeIcon
                              icon={faIndianRupeeSign}
                              style={styles.icon}
                            />
                            &nbsp;{res.tempfullamount}
                          </Text>
                        </View>
                        <View style={styles.billContent}>
                          <Text style={[styles.billTxt, {color: 'orange'}]}>
                            Discount(%) : 0
                          </Text>
                          <Text style={[styles.billTxt, {color: 'orange'}]}>
                            <FontAwesomeIcon
                              icon={faIndianRupeeSign}
                              style={styles.icon}
                            />
                            &nbsp;0
                          </Text>
                        </View>
                        <View style={styles.billContent}>
                          <Text style={styles.billTxt}>Tax : 0 %</Text>
                          <Text style={styles.billTxt}>
                            <FontAwesomeIcon
                              icon={faIndianRupeeSign}
                              style={styles.icon}
                            />
                            &nbsp;0
                          </Text>
                        </View>
                        <View style={styles.billContent}>
                          <Text
                            style={[
                              styles.billTxt,
                              {fontSize: 14, fontWeight: 'bold'},
                            ]}>
                            {res.billname}
                          </Text>
                        </View>
                        <View style={styles.billContent}>
                          <Text style={styles.billTxt}>Date</Text>
                          <Text style={styles.billTxt}>{res.bill_date}</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() =>
                            deleteHandler({
                              bill_id: res.bill_id,
                              serviceArray: {
                                amount: res.amount,
                                billname: res.billname,
                                outbillingtype: res.outbillingtype,
                              },
                            })
                          }>
                          <FontAwesomeIcon
                            icon={faTrash}
                            color="red"
                            size={18}
                          />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    );
                  })}
            </ScrollView>

            <View style={styles.billGrpBtn}>
              <TouchableOpacity
                style={styles.billAdd}
                onPress={() =>
                  navigation.navigate('BillAddItems', {
                    bill_type: 'ADD',
                    selectedPatient: selectedPatient,
                  })
                }>
                <FontAwesomeIcon icon={faCirclePlus} style={styles.icon} />
                <Text
                  style={{color: '#3763ae', fontWeight: 'bold', fontSize: 14}}>
                  Add Items
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.billSum}>
              <View
                style={[
                  styles.billContent,
                  {
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                    padding: 10,
                  },
                ]}>
                <Text style={[styles.billTxt, {fontWeight: 'bold'}]}>
                  Discount
                </Text>
              </View>
              <View style={[styles.billContent, {marginTop: 6, padding: 10}]}>
                <Text style={[styles.billTxt, {fontSize: 16, marginBottom: 8}]}>
                  Discount
                </Text>
                <View style={{flexDirection: 'row', gap: 6}}>
                  <View style={[styles.billContent, {gap: 0}]}>
                    <View
                      style={[
                        styles.ttAmtTxt,
                        {
                          borderColor: 'orange',
                          borderWidth: 2,
                          borderTopLeftRadius: 6,
                          borderBottomLeftRadius: 6,
                          width: 70,
                        },
                      ]}>
                      <TextInput
                        style={{padding: 1.5}}
                        placeholder="0"
                        autoComplete="off"
                        keyboardType="numeric"
                        textAlign="center"
                        value={discountAmt}
                        onChangeText={e => {
                          setDiscountAmt(e);
                          const rupees =
                            (billPatientData?.totalamount * e) / 100;
                          setDiscountAmtRs(rupees.toFixed(2));
                        }}
                      />
                    </View>
                    <Text
                      style={[
                        styles.billTxt2,
                        {
                          backgroundColor: 'orange',
                          borderTopRightRadius: 6,
                          borderBottomRightRadius: 6,
                          height: 27,
                        },
                      ]}>
                      %
                    </Text>
                  </View>
                  <View style={[styles.billContent, {gap: 0}]}>
                    <View
                      style={[
                        styles.billTxt2,
                        {
                          borderTopLeftRadius: 6,
                          borderBottomLeftRadius: 6,
                          backgroundColor: '#b9cceb',
                          borderColor: '#b9cceb',
                          height: 27,
                        },
                      ]}>
                      <FontAwesomeIcon
                        icon={faIndianRupeeSign}
                        style={styles.icon}
                        size={12}
                      />
                    </View>
                    <View
                      style={[
                        styles.ttAmtTxt,
                        {
                          borderTopRightRadius: 6,
                          borderBottomRightRadius: 6,
                          width: 70,
                          borderColor: '#b9cceb',
                          borderWidth: 2,
                        },
                      ]}>
                      <TextInput
                        style={{padding: 1.5}}
                        placeholder="0"
                        autoComplete="off"
                        keyboardType="numeric"
                        textAlign="center"
                        value={discountAmtRs}
                        onChangeText={e => {
                          setDiscountAmtRs(e);
                          const percentage =
                            (e * 100) / billPatientData?.totalamount;
                          setDiscountAmt(percentage.toFixed(2));
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.ttAmtDiv}>
                <View style={styles.ttAmt}>
                  <Text style={styles.ttAmtlabel}>Total Amount</Text>
                  <View style={styles.amt}>
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      style={styles.icon}
                      size={12}
                    />
                    <Text style={styles.ttAmtTxt}>{TOTAL_AMOUNT || '0'}</Text>
                  </View>
                </View>
                <View style={styles.ttAmt}>
                  <Text style={styles.ttAmtlabel}>Received</Text>
                  <View style={styles.amt}>
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      style={styles.icon}
                      size={12}
                    />
                    <TextInput
                      style={[styles.ttAmtTxt, {paddingBottom: 0}]}
                      placeholder="0.0"
                      autoComplete="off"
                      keyboardType="numeric"
                      textAlign="right"
                      value={receivedAmt}
                      onChangeText={e => setReceivedAmt(e)}
                    />
                  </View>
                </View>
                <View style={styles.ttAmt}>
                  <Text style={[styles.ttAmtlabel, {color: '#15cf84'}]}>
                    Balance Due
                  </Text>
                  <View style={[styles.amt, {borderBottomWidth: 0}]}>
                    <FontAwesomeIcon
                      icon={faIndianRupeeSign}
                      style={styles.icon}
                      size={12}
                    />
                    <Text style={[styles.ttAmtTxt, {color: '#15cf84'}]}>
                      {receivedAmt == ''
                        ? previousbalance || '0'
                        : totalbalance || '0'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Modal Popup */}
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Bill Added Successfully</Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    setModalVisible(!modalVisible),
                      navigation.navigate('BillHistory', {selectedPatient});
                  }}>
                  <Text style={styles.textStyle}>Ok</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
        {/* <HomeButton /> */}
      </SafeAreaView>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[
            styles.submitBtn,
            {backgroundColor: selectedPatient ? 'green' : 'red'},
          ]}
          disabled={selectedPatient ? false : true}
          onPress={() => {
            addMobileBillHandler(), setModalVisible(true);
          }}>
          <Text style={styles.submitBtnTxt}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.submitBtn,
            {backgroundColor: selectedPatient ? 'green' : 'red'},
          ]}
          disabled={selectedPatient ? false : true}
          onPress={() => {
            navigation.navigate('BillHistory', {selectedPatient});
          }}>
          <Text style={styles.submitBtnTxt}>History</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default BillHome;

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Light black background
    zIndex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  container: {flex: 1},
  header: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.2,
    paddingBottom: 12,
  },
  mainHead: {borderBottomWidth: 0.2, paddingBottom: 8},
  main: {
    flexDirection: 'row',
    // marginHorizontal: 50,
    justifyContent: 'space-between',
  },
  body: {
    marginVertical: 14,
  },
  text: {
    borderWidth: 0.5,
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 4,
    marginBottom: 16,
  },
  title: {
    padding: 6,
    marginHorizontal: 20,
    borderRadius: 6,
    paddingBottom: 8,
    backgroundColor: '#42c4fc',
    flexDirection: 'row',
    gap: 10,
  },
  billDiv: {
    backgroundColor: '#e6e7e8',
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 6,
    padding: 12,
    borderWidth: 0.5,
    borderColor: '#f0f0f0',
  },
  billContent: {
    paddingBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
  },
  billTxt: {
    fontSize: 12,
    color: 'black',
  },
  billGrpBtn: {
    marginHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  billAdd: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderColor: '#e6e7e8',
    borderWidth: 2,
    padding: 6,
    borderRadius: 6,
    flex: 0.99,
  },
  billScan: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderColor: '#e6e7e8',
    borderWidth: 2,
    padding: 4,
    borderRadius: 6,
    flex: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 38,
    height: 40,
  },
  billSum: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 6,
    // padding: 12,
  },
  billTxt2: {
    borderWidth: 2,
    borderColor: 'orange',
    padding: 2,
  },
  ttAmtDiv: {
    backgroundColor: '#e6e7e8',
    padding: 10,
  },
  ttAmt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    alignItems: 'center',
  },
  ttAmtlabel: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  ttAmtTxt: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  amt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    borderBottomColor: 'black',
    borderStyle: 'dotted',
    borderBottomWidth: 2,
    width: 100,
    paddingBottom: 0,
  },
  submitBtn: {
    alignSelf: 'center',
    backgroundColor: '#4ea5fc',
    padding: 8,
    marginVertical: 10,
    borderRadius: 4,
    paddingHorizontal: 20,
  },
  submitBtnTxt: {
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  billScroll: {
    height: 220,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Light black background
    zIndex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  // scrollView: {
  //   height: 110,
  // },
  deleteButton: {
    alignSelf: 'flex-end',
    marginVertical: 4,
  },
  card: {
    backgroundColor: 'white',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 4,
    borderRadius: 4,
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 10,
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
    padding: 0,
    fontWeight: '400',
  },
  navbarText: {
    fontSize: 18,
    fontWeight: '500',
  },
  serachinput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    width: '90%',
    margin: 16,
    paddingHorizontal: 10,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderColor: 'lightgrey',
  },
  buttons: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'center',
    gap: 10,
  },

  selectpatientview: {
    backgroundColor: 'green',
    paddingHorizontal: 10,
    padding: 6,
    borderRadius: 10,
  },
  listWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    flexWrap: 'wrap',
    marginHorizontal: 20,
  },
  selectpatientviewtext: {
    color: '#fff',
  },
});
