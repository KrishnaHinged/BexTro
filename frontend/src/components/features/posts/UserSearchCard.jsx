import { useNavigate } from 'react-router-dom';
import { ROOT_URL } from '../../../api/axios';

const UserSearchCard = ({ user }) => {
    const navigate = useNavigate();

    const profilePhotoUrl = user.profilePhoto?.startsWith("http")
        ? user.profilePhoto
        : user.profilePhoto
            ? `${ROOT_URL}${user.profilePhoto}`
            : `https://ui-avatars.com/api/?name=${user.username || "User"}&background=6366f1&color=fff`;

    return (
        <div 
            onClick={() => navigate(`/user/${user._id}`)}
            className="flex items-center gap-4 p-4 bg-white/40 hover:bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group"
        >
            <div className="relative">
                <img 
                    src={profilePhotoUrl} 
                    onError={(e) => (e.target.src = "https://ui-avatars.com/api/?name=User")}
                    alt={user.username} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200 group-hover:border-indigo-400 transition-colors"
                />
                {user.isPrivate && (
                    <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                        <span className="text-[10px]">🔒</span>
                    </span>
                )}
            </div>
            
            <div className="flex-1 overflow-hidden">
                <h4 className="font-bold text-gray-800 truncate">{user.fullName}</h4>
                <p className="text-xs text-indigo-600 font-semibold truncate">@{user.username}</p>
            </div>

            <div className="flex items-center gap-2">
                {user.connectionStatus === 'connected' ? (
                    <button className="bg-green-100 text-green-700 font-bold px-3 py-1.5 rounded-lg text-xs border border-green-200 pointer-events-none">
                        Connected
                    </button>
                ) : (
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-1.5 rounded-lg text-xs shadow-md active:scale-95 transition-all">
                        View
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserSearchCard;
