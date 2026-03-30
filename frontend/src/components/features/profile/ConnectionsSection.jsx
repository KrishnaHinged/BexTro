import { useNavigate } from "react-router-dom";
import { getProfilePhoto } from "../../../utils/getProfilePhoto";

const ConnectionsSection = ({ connections }) => {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-2xl font-bold text-white/90 mb-6">
        Your Connections ({connections.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connections.map((user) => (
          <div
            key={user._id}
            onClick={() => navigate(`/user/${user._id}`)}
            className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 flex items-center gap-3 cursor-pointer hover:bg-white/20 transition-all duration-200"
          >
            <img
              src={getProfilePhoto(user.profilePhoto, user.username)}
              alt="avatar"
              className="w-16 h-16 rounded-full bg-black/20 object-cover"
            />
            <div>
              <h4 className="text-white/90 font-bold">{user.fullName}</h4>
              <span className="text-white/60 text-sm">@{user.username}</span>
            </div>
          </div>
        ))}
        {connections.length === 0 && (
          <div className="col-span-full text-center text-white/60 py-12">
            No connections yet. Start connecting with others!
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionsSection;