import { useContext, useEffect, useState } from 'react';
import api from '../axios';
import { jwtDecode } from 'jwt-decode';
import { notificationMessage } from '../App';
import useIndexedDB from "./useIndexedDb";

const useQuery = () => {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [notifMessage, setNotifMessage] = useContext(notificationMessage);
  const [accessToken, setToken] = useState('');
  const { addItem, getAllItems, clearStore } = useIndexedDB();

  useEffect(() => {
    const getToken = async () => {
      const token = await getAllItems('tokens');
      setToken(token?.accessToken);
    }
    getToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (route) => {
    try {
      setIsLoading(true);
      const response = await api.get(`${route}`);
      setResponse(response?.data);
      setIsLoading(false);
    } catch (error) {
      if (error.response) {
        handleError(error);
        setIsLoading(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const postData = async (route, payload) => {
    try {
      setIsLoading(true);
      const response = await api.post(`${route}`, payload);
      setResponse(response?.data);
      setNotifMessage(response.data.message);
      setIsLoading(false);
      return response;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addData = async (route, payload) => {
    try {
      setIsLoading(true);
      const response = await api.post(`${route}`, payload);
      setResponse(response?.data);
      setNotifMessage(response.data.message);
      setIsLoading(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const editData = async (route, id, payload) => {
    try {
      setIsLoading(true);
      const response = await api.post(`${route}/${id}`, payload);
      setResponse(response?.data);
      setNotifMessage(response.data.message);
      setIsLoading(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteData = async (route, id, payload = {}) => {
    try {
      setIsLoading(true);
      const response = await api.post(`${route}/${id}`, payload);
      setResponse(response?.data);
      setNotifMessage(response.data.message);
      setIsLoading(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchData = async (route, id) => {
    try {
      setIsLoading(true);
      const response = await api.get(`${route}/${id}`);
      setSearchResults(response.data);
      setIsLoading(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchItems = async (route, id) => {
    try {
      setIsLoading(true);
      const response = await api.get(`${route}/${id}`);
      setSearchResults(response.data);
      setIsLoading(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const userAuth = async (payload) => {
    try {
      setIsLoading(true);
      const response = await api.post(`/authStaff`, payload, {
        headers: { Authorization: `Bearer ${accessToken}`},
        withCredentials: true
      });
      if (response && response.status === 200 && response.data.accessToken) {
        const tokens = await getAllItems('tokens');
        if (tokens.length > 0) {
          await clearStore('tokens');
        }
        await addItem('tokens', response.data.accessToken, 'accessToken');
        window.location.href = "/dashboard";
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };  
  
  const verifyToken = async () => {
    try {
      setIsLoading(true);
      const response = await api.post('/authToken', { username: jwtDecode(accessToken).username }, {
        headers: { Authorization: `Bearer ${accessToken}`},
        withCredentials: true
      });
      if (response && response.data && response.data.accessToken) {
        addItem('tokens', accessToken, 'accessToken');
      }
      setIsLoading(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const logoutUser = async (payload) => {
    try {
      setIsLoading(true);
      const response = await api.post('/logoutUser', payload, {
        headers: { Authorization: `Bearer ${accessToken}`},
        withCredentials: true
      });
      if (response && response.data && response.data.status === 200) {
        await clearStore('tokens');
        setNotifMessage(response.data.message);
        setResponse(response?.data);
          setIsLoading(false);
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
      }
    } catch (error) {
      handleError(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  const handleError = (error) => {
    if (!error.response) {
      setError('No internet connection');
      setNotifMessage('No internet connection');
    } else {
      setNotifMessage(error.response.data.message);
      setError(`Error: ${error.message}`);
    }
    setIsLoading(false);
    setTimeout(() => {
      setError(null);
      setNotifMessage(null);
    },3000);
  };

  return {
    isLoading,
    response,
    error,
    searchResults,
    setSearchResults,
    fetchData,
    postData,
    addData,
    editData,
    deleteData,
    searchData,
    searchItems,
    userAuth,
    verifyToken,
    logoutUser,
  };
};

export default useQuery;
