import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const useGetAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5005/api/v1/user/admin/all', { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      toast.error('Admin Fetch Failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure? This action is permanent.")) return;
    try {
      await axios.delete(`http://localhost:5005/api/v1/user/admin/${userId}`, { withCredentials: true });
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success("User deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const updateRole = async (userId, role) => {
    try {
      await axios.patch(`http://localhost:5005/api/v1/user/admin/${userId}/role`, { role }, { withCredentials: true });
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role } : u));
      toast.success(`Role updated to ${role}`);
    } catch (err) {
      toast.error("Role update failed");
    }
  };

  return { users, loading, error, deleteUser, updateRole, refresh: fetchUsers };
};

export default useGetAdminUsers;
