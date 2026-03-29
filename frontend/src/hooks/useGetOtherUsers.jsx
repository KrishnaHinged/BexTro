import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setOtherUser } from "../redux/userSlice"; 
import { ROOT_URL } from "../api/axios";

const useGetOtherUsers = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((store) => store.user); // Check if user is authenticated
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
  
    const fetchOtherUsers = async () => {
      if (!isAuthenticated) return;
  
      setLoading(true);
      setError(null);
      try {
        axios.defaults.withCredentials = true;
        const [userRes, commRes] = await Promise.all([
          axios.get(`${ROOT_URL}/api/v1/user/users`, { signal: controller.signal }),
          axios.get(`${ROOT_URL}/api/v1/communities/my-communities`, { signal: controller.signal })
        ]);

        const communityList = commRes.data.map(c => ({
            _id: c._id,
            fullName: c.name,
            username: `${c.memberCount} Members`,
            profilePhoto: `https://avatar.iran.liara.run/public/job/designer?username=${c.name}`,
            isCommunity: true
        }));

        dispatch(setOtherUser([...communityList, ...userRes.data]));
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request cancelled', error.message);
        } else {
          console.error('Error fetching other users:', error);
          setError(error.response?.data?.message || 'Failed to fetch other users');
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchOtherUsers();
  
    return () => controller.abort(); // Cleanup
  
  }, [dispatch, isAuthenticated]);
  
  return { loading, error };
};

export default useGetOtherUsers;