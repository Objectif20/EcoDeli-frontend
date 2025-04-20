import { useEffect, useState } from 'react';
import AppRoutes from './routes/routes';
import './index.css';
import { useDispatch } from 'react-redux';
import { getAccessToken } from './api/auth.api';
import { UserApi } from './api/user.api';
import { Spinner } from './components/ui/spinner';
import { AppDispatch } from './redux/store';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const tokenResponse = await getAccessToken();

        if (tokenResponse?.accessToken) {
          await dispatch(UserApi.getUserData());
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'application", error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;
