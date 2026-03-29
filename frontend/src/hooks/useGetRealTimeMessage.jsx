import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, markMessagesAsSeen } from "../redux/messageSlice";

const useGetRealTimeMessage = () => {
  const { socket } = useSelector(store => store.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      dispatch(addMessage(newMessage));
    };

    const handleMessagesSeen = ({ receiverId }) => {
        dispatch(markMessagesAsSeen({ receiverId }));
    };

    socket?.on("newMessage", handleNewMessage);
    socket?.on("newCommunityMessage", handleNewMessage);
    socket?.on("messagesSeen", handleMessagesSeen);

    return () => {
      socket?.off("newMessage", handleNewMessage);
      socket?.off("newCommunityMessage", handleNewMessage);
      socket?.off("messagesSeen", handleMessagesSeen);
    };
  }, [socket, dispatch]);
};

export default useGetRealTimeMessage;