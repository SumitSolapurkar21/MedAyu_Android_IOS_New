import { createContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
     // ....... //
     const [userData, setUserData] = useState([]);
     const [selectedPatient, setSelectedPatient] = useState([]);
     const [patientAppointment, setPatientAppointment] = useState([]);
     const [selectedPatientAppointment, setSelectedPatientAppointment] = useState([]);

     const contextValue = {
          userData,
          setUserData,
          selectedPatient,
          setSelectedPatient,
          patientAppointment,
          setPatientAppointment,
          selectedPatientAppointment, 
          setSelectedPatientAppointment
     };

     return (
          <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
     );
};

export default UserContext;
