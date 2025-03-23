import axios from "axios"
import { countryapi } from "../api/api"
import { Alert } from "react-native"


export const Getcountry = async (setCountryArray) => {
     try {
          await axios.post(countryapi).then((response) => {
               const c_data = response.data.data;
               let c_array = c_data.map(res => {
                    return { name: res.name, code: res.code };
               });
             
               return c_array;
          })
     } catch (error) {
          Alert.alert('Error !!', error)
     }
}