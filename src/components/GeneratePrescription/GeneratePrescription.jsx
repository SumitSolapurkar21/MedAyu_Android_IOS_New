import RNPrint from 'react-native-print';
import axios from 'axios';
import {generateprescriptionapi} from '../../api/api';

export const GeneratePdf = async (data, userdata) => {
  console.log('GeneratePdf :', {data, userdata});

  let depart_id = userdata?.depart_id;
  let doctor_id = userdata?._id;
  let mobilenumber = data?.mobilenumber;
  let role = userdata?.role;
  let hospital_id = userdata?.hospital_id;
  let reception_id = userdata?._id;

  let uhid = data?.patientuniqueno;
  let patient_id = data?._id;
  let appoint_id = data?.appoint_id;

  // handlePdfIconClick function ....
  try {
    const patientTreatmentPrescriptionDataRes = await axios.post(
      generateprescriptionapi,
      {
        appoint_id: appoint_id,
        depart_id: depart_id,
        doctor_id: doctor_id,
        mobilenumber: mobilenumber,
        uhid: uhid,
        patient_id: patient_id,
        role: role,
        hospital_id: hospital_id,
        reception_id: reception_id,
      },
    );

    const data =
      patientTreatmentPrescriptionDataRes.data.data.length > 0 &&
      patientTreatmentPrescriptionDataRes.data.data[0];

    const formatDate = dateStr => {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const _opdFollowup = `
      <div class="head-content2">
                         <div class="head-content2-part1">
                              <h3 style="margin: 0;padding: 16px 20px;text-align: left;">FOLLOW UP</h3>
                         </div>

                    </div>

                    <div class="main-part12">

                      ${`
                           <div class="divdata" style="margin-left:20px">
                           <p> Next Followup is on ${formatDate(
                             data?.opdfollowuparray?.followup_date,
                           )} , ${data?.opdfollowuparray?.followup_day}</p>

                           </div>`}

                    </div>`;

    const _complainttableRows = `
      <div class="head-content2">
                         <div class="head-content2-part1">
                              <h3 style="margin: 0;padding: 16px 20px;text-align: left;">COMPLAINTS</h3>
                         </div>

                    </div>

                    <div class="main-part12">

                      ${data?.opdcomplaintArray?.map((res, i) => {
                        return `
                           <div key=${i} class="divdata" style="margin-left:20px">
                           <p>${i + 1}. ${res.symptoms} since ${res.duration} ${
                          res.time
                        }, ${res.frequency}</p>

                           </div>`;
                      })}

                    </div>`;

    const pastHistoryData = `
                    <div class="head-content2">
                                       <div class="head-content2-part1">
                                            <h3 style="margin: 0;
                                                 padding: 16px 20px;text-align: left;">PAST</h3>
                                       </div>

                                  </div>

                                  <div class="main-part12">

                                               ${data?.opdpasthistoryarray?.map(
                                                 (res, i) => {
                                                   return `
                                                        <div key=${i} class="divdata" style="margin-left:20px">
                                                         <p>${i + 1}.
                                                         ${
                                                           res.illnessname
                                                         } since ${
                                                     res.days
                                                   } days ${
                                                     res.months
                                                   } months ${
                                                     res.years
                                                   } years and is ${
                                                     res.treatment_status
                                                   } since ${res.from_date} </p>

                                                        </div>`;
                                                 },
                                               )}

                                  </div>`;

    const familyHistoryData = `
                    <div class="head-content2">
                                       <div class="head-content2-part1">
                                            <h3 style="margin: 0;
                                                 padding: 16px 20px;text-align: left;">FAMILY</h3>
                                       </div>

                                  </div>

                                  <div class="main-part12">

                                               ${data?.opdfamilyhistoryarray?.map(
                                                 (res, i) => {
                                                   return `
                                                       <div key=${i} class="divdata" style="margin-left:20px">
                                                         <p>${i + 1}. ${
                                                     res.illnessname
                                                   } since ${res.days} days ${
                                                     res.months
                                                   } months ${
                                                     res.years
                                                   } years and is ${
                                                     res.treatment_status
                                                   }
                                                         since ${
                                                           res.from_date
                                                         } </p>
                                                        </div>`;
                                                 },
                                               )}

                                  </div>`;

    const medicineHistoryData = `
                                  <div class="head-content2">
                                                     <div class="head-content2-part1">
                                                          <h3 style="margin: 0;
                                                               padding: 16px 20px;text-align: left;">MEDICINE</h3>
                                                     </div>

                                                </div>

                                                <div class="main-part12">

                                                    ${data?.opdmedicinehistoryarray?.map(
                                                      (res, i) => {
                                                        return `
                                                              <div key=${i} class="divdata" style="margin-left:20px">
                                                                   <p>${
                                                                     i + 1
                                                                   }. ${
                                                          res.drugname
                                                        } ${res.dose} since ${
                                                          res.days
                                                        } days ${
                                                          res.months
                                                        } months ${
                                                          res.years
                                                        } years </p>
                                                              </div>
                                                              `;
                                                      },
                                                    )}

                                                </div>`;
    const personalHistoryData = `
                                  <div class="head-content2">
                                                     <div class="head-content2-part1">
                                                          <h3 style="margin: 0;
                                                               padding: 16px 20px;text-align: left;">PERSONAL</h3>
                                                     </div>

                                                </div>

                                                <div class="main-part12">

                                                             ${data?.opdpersonalhistoryarray?.map(
                                                               (res, i) => {
                                                                 return `
                                                                        <div key=${i} class="divdata" style="margin-left:20px">
                                                                             <p>${
                                                                               i +
                                                                               1
                                                                             }. H/o of consuming amount of tea (${
                                                                   res.Tea
                                                                 }) , coffee (${
                                                                   res.Coffee
                                                                 }) daily ,  H/o of consuming amount of Tobacco (${
                                                                   res.Tobacco
                                                                 }) , Smoking (${
                                                                   res.Smoking
                                                                 }),Alcohol (${
                                                                   res.Alcohol
                                                                 }) , Drugs (${
                                                                   res.Drugs
                                                                 }),SoftDrink (${
                                                                   res.SoftDrink
                                                                 }) , Saltyfood (${
                                                                   res.Saltyfood
                                                                 }), ${
                                                                   res.Exercise
                                                                 } Exercise daily   </p>
                                                                        </div>`;
                                                               },
                                                             )}

                                                </div>`;

    const menstrualHistoryData = `
                                          <div class="head-content2">
                                                              <div class="head-content2-part1">
                                                                   <h3 style="margin: 0;
                                                                        padding: 16px 20px;text-align: left;">MENSTRUAL</h3>
                                                              </div>

                                                         </div>

                                                         <div class="main-part12">

                                                                        ${data?.opdmenstrualhistoryarray?.map(
                                                                          (
                                                                            res,
                                                                            i,
                                                                          ) => {
                                                                            return `
                                                                                  <div key=${i} class="divdata" style="margin-left:20px">
                                                                                      <p key=${
                                                                                        i +
                                                                                        1
                                                                                      }>She started menses in 12/03/2010. Periods are ${
                                                                              res.periods
                                                                            } , blood flow is ${
                                                                              res.qualityofbloodflow
                                                                            }, ${
                                                                              res.painduringcycle
                                                                            }-pain during periods. LMP: ${
                                                                              res.lmp
                                                                            } today is day ${
                                                                              res.durations
                                                                            }. </p>
                                                                                  </div>
                                                                                      `;
                                                                          },
                                                                        )}
                                                                   </tbody>
                                                              </table>
                                                         </div>`;

    const vitalHistoryData = `
                           <div class="head-content2">
                                               <div class="head-content2-part1">
                                                    <h3 style="margin: 0;
                                                         padding: 16px 20px;text-align: left;">VITALS</h3>
                                               </div>

                                          </div>

                                          <div class="main-part12">
                                               <table style="border-collapse: collapse;">
                                                    <thead>
                                                         <th>TEMP</th>
                                                         <th>PULSE</th>
                                                         <th>SPO2</th>
                                                         <th>BP</th>
                                                         <th>RR</th>
                                                         <th>GC</th>
                                                    </thead>
                                                    <tbody>
                                                         ${data?.opdvitalshistoryarray?.map(
                                                           (res, i) => {
                                                             return `
                                                                   <tr key=${i}>
                                                                   <td>${res.p_temp} F</td>
                                                                   <td>${res.p_pulse} /min</td>
                                                                   <td>${res.p_spo2} /%</td>
                                                                   <td>${res.p_systolicbp} / ${res.p_diastolicbp} /mmHg</td>
                                                                   <td>${res.p_rsprate}</td>
                                                                   <td>${res.gcss_status}(E${res.eyeopening}V${res.verbalResponse}M${res.motorResponse}</td>
                                                                   </tr>`;
                                                           },
                                                         )}
                                                    </tbody>
                                               </table>
                                          </div>`;
    const generalexaminationHistoryData = `
                                          <div class="head-content2">
                                              <div class="head-content2-part1">
                                                  <h3 style="margin: 0; padding: 16px 20px; text-align: left;">GENERAL EXAMINATION</h3>
                                              </div>
                                          </div>

                                          <div class="main-part12">
                                              ${data?.opdgeneralexaminationhistoryarray
                                                ?.map((res, i) => {
                                                  const presentKeys = [];
                                                  const absentKeys = [];

                                                  for (const [
                                                    key,
                                                    value,
                                                  ] of Object.entries(res)) {
                                                    if (value === 'present') {
                                                      presentKeys.push(
                                                        key.toUpperCase(),
                                                      );
                                                    } else if (
                                                      value === 'absent'
                                                    ) {
                                                      absentKeys.push(
                                                        key.toUpperCase(),
                                                      );
                                                    }
                                                  }

                                                  return `
                                                          <div key=${i} class="divdata" style="margin-left:20px">
                                                              <p><strong>Present:</strong> ${presentKeys.join(
                                                                ', ',
                                                              )}</p>
                                                              <p><strong>Absent:</strong> ${absentKeys.join(
                                                                ', ',
                                                              )}</p>
                                                          </div>`;
                                                })
                                                .join('')}
                                          </div>`;
    const diagnosisHistoryData = `
                                          <div class="head-content2">
                                                              <div class="head-content2-part1">
                                                                   <h3 style="margin: 0;
                                                                        padding: 16px 20px;text-align: left;">DIAGNOSIS</h3>
                                                              </div>

                                                         </div>

                                                         <div class="main-part12">

                                                                        ${data?.opddiagnosishistoryarray?.map(
                                                                          (
                                                                            res,
                                                                            i,
                                                                          ) => {
                                                                            return `
                                                                             <div key=${i} class="divdata" style="margin-left:20px">
                                                                                <p key=${
                                                                                  i +
                                                                                  1
                                                                                }>${
                                                                              res.illnessname
                                                                            } (${
                                                                              res.icdcode
                                                                            })</p>
                                                                              </div>`;
                                                                          },
                                                                        )}

                                                         </div>`;
    // const planofcareHistoryData = `
    //                                                    <div class="head-content2">
    //                                                                        <div class="head-content2-part1">
    //                                                                             <h3 style="margin: 0;
    //                                                                                  padding: 16px 20px;text-align: left;display: flex;flex-wrap : wrap;text-transform: capitalize;">PLAN OF CARE : ${
    //                                                                                    data
    //                                                                                      ?.opdplanofcarehistoryarray
    //                                                                                      ?.length >
    //                                                                                    0
    //                                                                                      ? Object.keys(
    //                                                                                          data
    //                                                                                            .opdplanofcarehistoryarray[0],
    //                                                                                        ).join(
    //                                                                                          ' , ',
    //                                                                                        )
    //                                                                                      : ''
    //                                                                                  }</h3>
    //                                                                        </div>

    //                                                                   </div>`;

    const treatmentHistoryData = `
                                     <div class="head-content2">
                                                         <div class="head-content2-part1">
                                                              <h3 style="margin: 0;
                                                                   padding: 16px 20px;text-align: left;">Prescription</h3>
                                                         </div>

                                                    </div>

                                                    <div class="main-part12">
                                                         <table style="border-collapse: collapse;">
                                                              <thead>
                                                              <th>MEDECINE NAME</th>
                                                              <th>DOSE</th>
                                                              <th>ROUTE</th>
                                                              <th>SCHEDULE</th>
                                                              <th>INSTRUCTION</th>
                                                              <th>DURATION</th>
                                                              </thead>
                                                              <tbody>
                                                                   ${data?.opdtreatmenthistoryarray?.map(
                                                                     (
                                                                       res,
                                                                       i,
                                                                     ) => {
                                                                       return `
                                                                             <tr key=${i}>
                                                                             <td>${res.drugname}</td>
                                                                             <td>${res.dose}</td>
                                                                             <td>${res.route}</td>
                                                                             <td>${res.schedule}</td>
                                                                             <td>${res.anupan}</td>
                                                                             <td>${res.duration}</td>

                                                                             </tr>`;
                                                                     },
                                                                   )}
                                                              </tbody>
                                                         </table>
                                                    </div>`;
    // const procedureHistoryData = `
    //                                               <div class="head-content2">
    //                                                                   <div class="head-content2-part1">
    //                                                                        <h3 style="margin: 0;
    //                                                                             padding: 16px 20px;text-align: left;">PROCEDURE</h3>
    //                                                                   </div>

    //                                                              </div>

    //                                                              <div class="main-part12">
    //                                                                   <table style="border-collapse: collapse;">
    //                                                                        <thead>
    //                                                                        <th>NAME</th>
    //                                                                        <th>TIME</th>
    //                                                                        <th>KIT</th>
    //                                                                        <th>PROCEDURE TYPE</th>
    //                                                                        <th>DAYS</th>
    //                                                                        </thead>
    //                                                                        <tbody>
    //                                                                             ${data?.opdprocedurehistoryarray?.map(
    //                                                                               (
    //                                                                                 res,
    //                                                                                 i,
    //                                                                               ) => {
    //                                                                                 return `
    //                                                                                       <tr key=${i}>
    //                                                                                       <td>${res.procedurename}</td>
    //                                                                                       <td>${res.proceduretime}</td>
    //                                                                                       <td>${res.procedurekit}</td>
    //                                                                                       <td>${res.proceduretype}</td>
    //                                                                                       <td>${res.proceduredays}</td>

    //                                                                                       </tr>`;
    //                                                                               },
    //                                                                             )}
    //                                                                        </tbody>
    //                                                                   </table>
    //                                                              </div>`;

    const adviceHistoryData = `
                                                                   <div class="head-content2">
                                                                                       <div class="head-content2-part1">
                                                                                            <h3 style="margin: 0;
                                                                                                 padding: 16px 20px;text-align: left;">ADVICE :  ${data?.opdadvicehistoryarray?.map(
                                                                                                   (
                                                                                                     res,
                                                                                                     i,
                                                                                                   ) => {
                                                                                                     return `
                                                                                                              <tr key=${i}>
                                                                                                              <td>${res.opdtemplate_text}</td>

                                                                                                              </tr>`;
                                                                                                   },
                                                                                                 )} </h3>
                                                                                       </div>

                                                                                  </div>

                                                                                 `;

    const html = `
  <html>

  <head>
  <meta name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  <style>
  .head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  border-bottom: 1px solid;
  }

  .head-content {
  line-height: 0.5;
  }

  .head-content2-part2 p {
  text-align: right;
  }

  table {
  width: 94%;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 2%;

  }

  /* thead {
  background-color: green;
  } */

  table tr th {
  padding: 6px;
  border: 1px solid black
  }

  table tr td {
  padding: 6px;
  border: 1px solid black;
  text-align: center;
  }

  .main-part1,
  .main-part2,
  .main2 {
  width: 50%;
  }

  .main,
  .main3 {
  display: flex;
  }

  .main2,
  .main-part3,
  .main-part4,
  .main-part5 {
  border: 1px solid black
  }

  .main2,
  .main-part3 p {
  text-align: center;
  margin-top: 0;
  margin-bottom: 0;
  padding: 6px;
  }

  .main2 p:nth-child(odd) {
  background-color: green;
  color: white;
  font-weight: 600;
  }

  .main-part3 p:nth-child(odd) {
  background-color: green;
  color: white;
  font-weight: 600;
  }

  .main-part3-p p {
  text-align: left;
  }

  .main4 p {
  text-align: right;
  margin-left: 20px;
  margin-right: 20px;
  }

  .head-content3 {
  padding: 10px;
  border: 1px solid black;
  border-radius: 6px;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 20px;
  }

  .head-content2-part1 h3 {
  color: black;
  text-align: center;
  }

  .head-content3-part1,
  .head-content3-part2,
  .head-content3-part3 {
  display: flex;
  justify-content: space-between;

  }

  .head-content3-part1 h3,
  .head-content3-part2 h3,
  .head-content3-part3 h3 {
  width: 33%;
  font-size: 16px;
  }

  .head-content h1,
  p {
  text-align: center;
  }
  .main5{
  display: flex;
  justify-content: space-between;
  margin-left: 20px;
  margin-right: 20px;
  border-top: 2px solid green;
  }
  span{
  color: black;
  }
  .divdata p{
  line-height:30px;
  margin-top: 0px;
  margin-bottom: 0px;
  text-align: left;
  padding:0px 20px;
  }
  .main-part12{
  margin-bottom: 10px;
  }
  </style>
  </head>

  <body style="border: 1px solid;">
       <div class="head">
           <div>
                 <img src=${
                   data?.hosp_logo || '../../assets/images/medicalrecord.png'
                 } style="width: 14vw;" />
            </div>
            <div class="head-content">
                 <h1>${data?.hosp_name}</h1>
                 <p>( OPERATED BY MedAyu HEALTHCARE LLP )</p>
                 <p>${data?.hosp_address}</p>
            </div>
            <div class="head-content"></div>
       </div>

  <div class="head-content3">
  <div class="head-content3-part1">
  <h3 style="margin: 0;
  padding: 8px;">UHID NO : <span>${data?.patientuniqueno}</span> </h3>
  <h3 style="margin: 0;
  padding: 8px;">OP NO : <span>${data?.AppArray[0].appoint_id}</span> </h3>
  <h3 style="margin: 0;
  padding: 8px;">DATE : <span>${data?.registerdate}</span> </h3>
  </div>
  <div class="head-content3-part2">
  <h3 style="margin: 0;
  padding: 8px;">NAME : <span>${data?.firstname}</span> </h3>
  <h3 style="margin: 0;
  padding: 8px;">AGE : <span>${data?.patientage}</span></h3>
  <h3 style="margin: 0;
  padding: 8px;">GENDER : <span>${data?.patientgender}</span> </h3>
  </div>
  <div class="head-content3-part3">
  <h3 style="margin: 0;
  padding: 8px; width: 106%;">CONSULTANT NAME : <span>${
    data?.AppArray[0].name
  }</span> </h3>

  <h3 style="margin: 0;width: 50%;
  padding: 8px;">TIME : <span>${data?.AppArray[0].slot_id}</span></h3>
  </div>

  </div>

  ${data?.opdcomplaintArray?.length > 0 ? _complainttableRows : ''}
  ${data?.opdpasthistoryarray?.length > 0 ? pastHistoryData : ''}
  ${data?.opdfamilyhistoryarray?.length > 0 ? familyHistoryData : ''}
  ${data?.opdmedicinehistoryarray?.length > 0 ? medicineHistoryData : ''}
  ${data?.opdpersonalhistoryarray?.length > 0 ? personalHistoryData : ''}
  ${data?.opdmenstrualhistoryarray?.length > 0 ? menstrualHistoryData : ''}
  ${data?.opdvitalshistoryarray?.length > 0 ? vitalHistoryData : ''}
  ${
    data?.opdgeneralexaminationhistoryarray?.length > 0
      ? generalexaminationHistoryData
      : ''
  }
  ${data?.opddiagnosishistoryarray?.length > 0 ? diagnosisHistoryData : ''}
  ${data?.opdtreatmenthistoryarray?.length > 0 ? treatmentHistoryData : ''}
  ${data?.opdadvicehistoryarray?.length > 0 ? adviceHistoryData : ''}
  ${_opdFollowup}

  <br />
  <div class="main4">
  <div style="width: 100%;">
  <p><b>${data?.consultantname || '----------'}</b></p>
  <p>${data?.designation || '----------'} </p>
  <p>REG. NO. 2008/10/3546 </p>
  </div>
  </div>
  <div class="main5">
  <p>${data?.hosp_mobile}</p>
  <p>www.medayu.in </p>
  <p>${data?.hosp_email}</p>
  </div>
  </body>

  </html>`;
    await RNPrint.print({
      html,
    });
  } catch (error) {
    console.error(error);
  }
};
