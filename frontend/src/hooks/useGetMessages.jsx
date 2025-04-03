import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../../redux/messageSlice";

const useGetMessages = () => {
  const { selectedUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser?._id) {
        console.warn("No selected user, skipping message fetch.");
        dispatch(setMessages([]));
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5005/api/v1/message/${selectedUser._id}`, {
          withCredentials: true,
        });
        dispatch(setMessages(res.data || []));
      } catch (error) {
        console.error("Error fetching messages:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        dispatch(setMessages([]));
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedUser, dispatch]);

  return { loading };
};

export default useGetMessages;