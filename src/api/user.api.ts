import { setError, setLoading, setUser } from '@/redux/slices/userSlice';
import { AppDispatch } from '@/redux/store';
import axiosInstance from './axiosInstance';


export interface User {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    photo: string | null;
    active: boolean;
    language: string;
    iso_code: string;
    profile: string[];
    otp?: boolean | false;
    updgradablePlan?: boolean | false;
    planName?: string;
  }

export class UserApi{

        static getUserData = () => async (dispatch: AppDispatch) => {
            dispatch(setLoading(true));
          
            try {
              const response = await axiosInstance.get("/client/profile/me");

              if (response && response.data) {
              const userData = response.data;
              dispatch(setUser(userData));
              } else {
              throw new Error("Invalid response data");
              }
            } catch (error) {
              console.error("Error fetching user data:", error);
              dispatch(setError("Erreur lors de la récupération des données de l'utilisateur"));
            } finally {
              dispatch(setLoading(false));
            }
          };


          static async isFirstLogin () {
              const response = await axiosInstance.get("/client/theme/firstLogin/check");
              if (response.data.firstLogin === true) {
                  return true;
              } else {
                  return false;
              }
          }

          static async addFirstLogin () {
            const response = await axiosInstance.post("/client/theme/firstLogin/");
            if (response.status === 200) {
                return true;
            }
            return false;
          }



} 
