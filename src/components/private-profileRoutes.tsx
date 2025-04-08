import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAccessToken } from '../api/auth.api';
import { AppDispatch } from '../redux/store';
import { UserApi } from '@/api/user.api';
import { RootState } from '../redux/store';

interface PrivateProfileRoutesProps {
  requiredProfile: string;
  requireAuth?: boolean;
}

const PrivateProfileRoutes: React.FC<PrivateProfileRoutesProps> = ({ requiredProfile, requireAuth = true }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchData = async () => {
      if (requireAuth) {
        const response = await getAccessToken();

        if (response.accessToken) {
          setIsAuthenticated(true);
          dispatch(UserApi.getUserData()).finally(() => setLoading(false));
        } else {
          setIsAuthenticated(false);
          setLoading(false);
        }
      } else {
        dispatch(UserApi.getUserData()).finally(() => setLoading(false));
      }
    };

    fetchData();
  }, [dispatch, requireAuth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (requireAuth && (!isAuthenticated || !user?.profile.includes(requiredProfile))) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
};

export default PrivateProfileRoutes;
