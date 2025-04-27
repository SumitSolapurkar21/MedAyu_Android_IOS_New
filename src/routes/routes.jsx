import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screen ... //
import Login from '../screens/login/login';
import Doctorhomepage from '../screens/roles/doctor/doctorhomepage';
import Addpatients from '../screens/quickactions/addpatients';
import Patientslist from '../screens/bottomnavigation/patientslist';
import Addappointments from '../screens/quickactions/addappointments';
import Appointmentpreview from '../screens/quickactions/appointmentpreview';
import Upcommingappointments from '../screens/quickactions/upcommingappointments';
import CreateRx from '../screens/quickactions/createRx';
import RxPatientslist from '../screens/prescriptions/patientslist';
import Vitals from '../screens/prescriptions/Vitals';
import SystemicExamination from '../screens/prescriptions/SystemicExamination';
import Complaints from '../screens/prescriptions/Complaints';
import Pasthistory from '../screens/prescriptions/Pasthistory';
import Familyhistory from '../screens/prescriptions/Familyhistory';
import Medicinehistory from '../screens/prescriptions/Medicinehistory';
import Personalhistory from '../screens/prescriptions/Personalhistory';
import Obstetricshistory from '../screens/prescriptions/Obstetricshistory';
import Menstrualhistory from '../screens/prescriptions/Menstrualhistory';
import Generalexamination from '../screens/prescriptions/Generalexamination';
import Diagnosis from '../screens/prescriptions/Diagnosis';
import Planofcare from '../screens/prescriptions/Planofcare';
import Advice from '../screens/prescriptions/Advice';
import Treatment from '../screens/prescriptions/Treatment';
import Procedure from '../screens/prescriptions/Procedure';
import Followupdate from '../screens/prescriptions/Followupdate';
import BillHome from '../screens/bills/BillHome';
import BillAddItems from '../screens/bills/AddItems';
import BillHistory from '../screens/bills/BillHistory';
import EditBillItem from '../screens/bills/EditBillItem';
import ApplyAttendance from '../screens/attendence/ApplyAttendence';
import Editcomplaints from '../screens/editprescription/Editcomplaints';
import Editpasthistory from '../screens/editprescription/Editpasthistory';
import Editfamilyhistory from '../screens/editprescription/Editfamilyhistory';
import Editmedicinehistory from '../screens/editprescription/Editmedicinehistory';
import Editpersonalhistory from '../screens/editprescription/Editpersonalhistory';
import Editobstetricshistory from '../screens/editprescription/Editobstetricshistory';
import Editmenstrualhistory from '../screens/editprescription/Editmenstrualhistory';
import Editvitals from '../screens/editprescription/Editvitals';
import Editgeneralexamination from '../screens/editprescription/Editgeneralexamination';
const Stack = createNativeStackNavigator();

export const MyRoutes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Doctorhomepage" component={Doctorhomepage} />
        <Stack.Screen name="Addpatients" component={Addpatients} />
        <Stack.Screen name="Patientslist" component={Patientslist} />
        <Stack.Screen name="Addappointments" component={Addappointments} />
        <Stack.Screen
          name="Appointmentpreview"
          component={Appointmentpreview}
        />
        <Stack.Screen
          name="Upcommingappointments"
          component={Upcommingappointments}
        />
        <Stack.Screen name="CreateRx" component={CreateRx} />
        <Stack.Screen name="RxPatientslist" component={RxPatientslist} />

        {/* Assessment Pages .... */}
        <Stack.Screen name="Vitals" component={Vitals} />
        <Stack.Screen
          name="SystemicExamination"
          component={SystemicExamination}
        />
        <Stack.Screen name="Complaints" component={Complaints} />
        <Stack.Screen name="Pasthistory" component={Pasthistory} />
        <Stack.Screen name="Familyhistory" component={Familyhistory} />
        <Stack.Screen name="Medicinehistory" component={Medicinehistory} />
        <Stack.Screen name="Personalhistory" component={Personalhistory} />
        <Stack.Screen name="Obstetricshistory" component={Obstetricshistory} />
        <Stack.Screen name="Menstrualhistory" component={Menstrualhistory} />
        <Stack.Screen
          name="Generalexamination"
          component={Generalexamination}
        />
        <Stack.Screen name="Diagnosis" component={Diagnosis} />
        <Stack.Screen name="Planofcare" component={Planofcare} />
        <Stack.Screen name="Advice" component={Advice} />
        <Stack.Screen name="Treatment" component={Treatment} />
        <Stack.Screen name="Procedure" component={Procedure} />
        <Stack.Screen name="Followupdate" component={Followupdate} />

        {/*Edit  Assessment Pages .... */}

        <Stack.Screen name="Editcomplaints" component={Editcomplaints} />
        <Stack.Screen name="Editpasthistory" component={Editpasthistory} />
        <Stack.Screen name="Editfamilyhistory" component={Editfamilyhistory} />
        <Stack.Screen name="Editmedicinehistory" component={Editmedicinehistory} />
        <Stack.Screen name="Editpersonalhistory" component={Editpersonalhistory} />
        <Stack.Screen name="Editobstetricshistory" component={Editobstetricshistory} />
        <Stack.Screen name="Editmenstrualhistory" component={Editmenstrualhistory} />
        <Stack.Screen name="Editvitals" component={Editvitals} /> 
        <Stack.Screen name="Editgeneralexamination" component={Editgeneralexamination} />



        {/* Bills Pages .... */}
        <Stack.Screen name="Billhome" component={BillHome} />
        <Stack.Screen name="BillAddItems" component={BillAddItems} />
        <Stack.Screen name="BillHistory" component={BillHistory} />
        <Stack.Screen name="EditBillItems" component={EditBillItem} />

        <Stack.Screen name="ApplyAttendence" component={ApplyAttendance} />

        
      </Stack.Navigator>
    </NavigationContainer>
  );
};
