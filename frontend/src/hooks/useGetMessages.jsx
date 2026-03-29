import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";
import { ROOT_URL } from "../api/axios";

const useGetMessages = () => {
  const { selectedUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser?._id) {
        dispatch(setMessages([]));
        return;
      }

      try {
        setLoading(true);
        const endpoint = selectedUser.isCommunity 
            ? `${ROOT_URL}/api/v1/message/community/${selectedUser._id}`
            : `${ROOT_URL}/api/v1/message/${selectedUser._id}`;
            
        const res = await axios.get(endpoint, {
          withCredentials: true,
        });
        dispatch(setMessages(res.data || []));
      } catch (error) {
        if (error.response?.status === 403) {
            console.warn("Status 403: Messaging restricted between these users.");
        } else {
            console.error("Error fetching messages:", error.message);
        }
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