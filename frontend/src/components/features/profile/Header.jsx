import { ROOT_URL } from "../../../api/axios";
import { getProfilePhoto } from "../../../utils/getProfilePhoto";

const Header = ({ user, connections }) => (
  <div className="grid grid-rows-2 items-center mb-8 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">

    {/* LEFT SECTION */}
    <div className="flex items-center gap-4">
      <img
        src={
          user.profilePhoto
            ? user.profilePhoto.startsWith("http")
              ? user.profilePhoto
              : `${ROOT_URL}${user.profilePhoto}`
            : `https://ui-avatars.com/api/?name=${user.username}&background=6366f1&color=fff`
        }
        alt="Profile"
        className="w-16 h-16 rounded-full object-cover border border-gray-300"
      />

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {user.fullName}
        </h1>
        <p className="text-gray-500 text-sm">@{user.username}</p>
      </div>
    </div>

    {/* RIGHT SECTION */}
    <div className="grid grid-cols-2 gap-6 justify-items-center mt-6.5">

      {/* STREAK */}
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-500">
          {user.currentStreak || 0}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Day Streak 🔥
        </div>
      </div>

      {/* CONNECTION COUNT */}
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-500">
          {connections?.length || 0}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Connections
        </div>
      </div>

    </div>
  </div>
);

export default Header;