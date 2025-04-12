import { setError, setLoading, setUser } from '@/redux/slices/userSlice';
import { AppDispatch } from '@/redux/store';


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
              await new Promise(resolve => setTimeout(resolve, 10));
          
              const userData: User = {
                user_id: "12345",
                first_name: "Jean",
                last_name: "Dupont",
                email: "jean.dupont@example.com",
                photo: "https://example.com/photo.jpg",
                active: true,
                language: "fr",
                iso_code: "FR",
                profile: ["CLIENT"],
                otp: false,
                updgradablePlan: true,
                planName: "Premium",
              };
          
              dispatch(setUser(userData));
              dispatch(setLoading(false));
            } catch (error) {
              dispatch(setError("Erreur lors de la récupération des données de l'utilisateur"));
              dispatch(setLoading(false));
            }
          };


} 
