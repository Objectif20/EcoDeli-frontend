import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getAccessToken } from '../api/auth.api';  
import { AppDispatch } from '../redux/store';
import Layout from '@/pages/features/layout';
import { UserApi } from '@/api/user.api';

type PrivateRouteProps = {
  requireAuth?: boolean;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ requireAuth = true }) => {
  const [loading, setLoading] = useState(true); 
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  const dispatch = useDispatch<AppDispatch>();  

  useEffect(() => {
    const fetchData = async () => {
      if (requireAuth) {
        const response = await getAccessToken();
        if (response.accessToken) {
          setIsAuthenticated(true);
          dispatch(UserApi.getUserData())
            .finally(() => setLoading(false));
        } else {
          setIsAuthenticated(false);
          setLoading(false);
        }
      } else {
        dispatch(UserApi.getUserData())
          .finally(() => setLoading(false));
      }
    };
    
    fetchData();
  }, [dispatch, requireAuth]); 

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default PrivateRoute;
