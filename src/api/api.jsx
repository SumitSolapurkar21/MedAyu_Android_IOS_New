export const baseurl = 'http://15.206.58.55:1239';
export const loginapi = `${baseurl}/login`;

// boundary .....
export const countryapi = `${baseurl}/getcountry`;
export const stateapi = `${baseurl}/fetchstate`;
export const cityapi = `${baseurl}/fetchcitys`;

// add patients ..
export const addpatientapi = `${baseurl}/AddReceptionOutPatientForMobile`;

// add appointment
export const addappointmentapi = `${baseurl}/AddDirectMobileAppointments`;
export const getappointmentapi = `${baseurl}/See_Appointment_List_Doctor`;

// doctor details ...
export const addopdassessment = `${baseurl}/AddMobileOpdAssessment`;

export const getdepartment = `${baseurl}/FetchReceptionDepartmentDeopdown`;
export const getdoctor = `${baseurl}/DoctorAccDepartmentinAppmtRecpt`;
export const getrooms = `${baseurl}/GetroomnoAccDoctor`;
export const getpatients = `${baseurl}/GetAllHospitalPatients`;
export const getappointmenttimeslotapi = `${baseurl}/GetSchedulerForMobile`;
export const addmobilevitals = `${baseurl}/AddMobileVitals`;
export const fetchmobilecomplaintscategory = `${baseurl}/FetchMobileComplaintsCategory`;
export const addmobilesymptomsdirectly = `${baseurl}/AddMobileSymptomsDirectly`;
export const fetchsysmptomsacccategory = `${baseurl}/FetchSysmptomsAccCategory`;
export const fetchdiseases = `${baseurl}/search_opd_past_history`;
export const fetchmedicines = `${baseurl}/search_prescription_data`;
export const searchdiagnosisdata = `${baseurl}/search_Mobile_Diagnosis_data`;
export const getadviceapi = `${baseurl}/GetMobileOpdTemplate`;

export const generateprescriptionapi = `${baseurl}/
GenerateOpdAssessmentReports`;

export const getopdservicesapi = `${baseurl}/GetOPDServices`;
export const getallbillsformobile = `${baseurl}/GetAllBillsForMobile`;
export const getmobilebillhistory = `${baseurl}/GetMobileBillHistory`;
export const addpatientbill = `${baseurl}/AddMobileBills`;
export const generatepatientbill = `${baseurl}/GenerateBillPdf`;

export const getservicecategoryacctype = `${baseurl}/getservicecategoryacctype`;

export const UpdateMobileOPDServices = `${baseurl}/UpdateMobileOPDServices`;
export const fetchservicetype = `${baseurl}/FetchServiceType`;
export const getserviceitemaccboth = `${baseurl}/getserviceitemaccboth`;
export const GetServiceAmount = `${baseurl}/GetServiceAmount`;
export const AddMobileBills = `${baseurl}/AddMobileBills`;
export const DeleteOpdItem = `${baseurl}/DeleteOpdItem`;
export const EditMobileBills = `${baseurl}/EditMobileBills`;
export const UpdateMobileBills = `${baseurl}/UpdateMobileBills`;
export const AddAttendence = `${baseurl}/AddMobileAttendence`;

export const GenerateOpdAssessmentReportsapi = `${baseurl}/GenerateOpdAssessmentReports`;
export const FetchMobileOpdAssessmentForEditapi = `${baseurl}/FetchMobileOpdAssessmentForEdit`;
