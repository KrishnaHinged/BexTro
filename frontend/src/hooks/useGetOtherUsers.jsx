import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setOtherUser } from '../../redux/userSclice'; // Fixed typo

const useGetOtherUsers = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((store) => store.user); // Check if user is authenticated
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOtherUsers = async () => {
      if (!isAuthenticated) return; // Skip fetching if not authenticated

      setLoading(true);
      setError(null);
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get('http://localhost:5005/api/v1/user/users');
        // console.log('Other users:', res.data);
        dispatch(setOtherUser(res.data));
      } catch (error) {
        console.error('Error fetching other users:', error);
        setError(error.response?.data?.message || 'Failed to fetch other users');
      } finally {
        setLoading(false);
      }
    };

    fetchOtherUsers();
  }, [dispatch, isAuthenticated]); // Add isAuthenticated as a dependency

  return { loading, error };
};

export default useGetOtherUsers;