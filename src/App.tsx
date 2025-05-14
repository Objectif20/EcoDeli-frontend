import { useEffect, useState } from 'react';
import AppRoutes from './routes/routes';
import './index.css';
import { useDispatch, useSelector } from 'react-redux';
import { getAccessToken } from './api/auth.api';
import { UserApi } from './api/user.api';
import { Spinner } from './components/ui/spinner';
import { AppDispatch, RootState } from './redux/store';
import OneSignalInit from './config/oneSignalInit';
import i18n from './i18n';

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const tokenResponse = await getAccessToken();

        if (tokenResponse?.accessToken) {
          await dispatch(UserApi.getUserData());
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'application", error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [dispatch]);

  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const localLang = localStorage.getItem('i18nextLng')
    if (localLang) {
      i18n.changeLanguage(localLang)
      return
    }

    const userLang = user?.language || 'fr'
    if (userLang !== i18n.language) {
      i18n.changeLanguage(userLang).then(() => {
        localStorage.setItem('i18nextLng', userLang)
      })
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {isAuthenticated && <OneSignalInit />}
      <AppRoutes />
    </>
  );
}

export default App;
