import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAccessToken } from '../api/auth.api';
import { AppDispatch } from '../redux/store';
import { UserApi } from '@/api/user.api';
import { RootState } from '../redux/store';

interface PrivateProfileRoutesProps {
  requiredProfile: string;
}

const PrivateProfileRoutes: React.FC<PrivateProfileRoutesProps> = ({ requiredProfile }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchAccessToken = async () => {
      const response = await getAccessToken();

      if (response.accessToken) {
        setIsAuthenticated(true);

        dispatch(UserApi.getUserData())
          .then(() => {
            setLoading(false);
          })
          .catch((error) => {
            console.error("Erreur lors de la récupération des données de l'utilisateur:", error);
            setLoading(false);
          });
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    fetchAccessToken();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user?.profile.includes(requiredProfile)) {
    return <Navigate to="/auth/login" />;
  }

  return (
      <Outlet />
  );
};

export default PrivateProfileRoutes;
