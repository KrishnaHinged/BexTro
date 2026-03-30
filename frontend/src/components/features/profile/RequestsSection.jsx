import { getProfilePhoto } from "../../../utils/getProfilePhoto";

const RequestsSection = ({ requests, onAccept, onReject }) => {
  return (
    <div className="space-y-6">
      {/* Received */}
      <div>
        <h2 className="text-2xl font-bold text-white/90 mb-4">
          Received Requests ({requests.received.length})
        </h2>
        <div className="space-y-3">
          {requests.received.map((user) => (
            <div
              key={user._id}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={getProfilePhoto(user.profilePhoto, user.username)}
                  alt="avatar"
                  className="w-12 h-12 rounded-full bg-black/20 object-cover"
                />
                <div>
                  <h4 className="text-white/90 font-bold">{user.fullName}</h4>
                  <span className="text-white/60 text-sm">@{user.username}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onAccept(user._id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Accept
                </button>
                <button
                  onClick={() => onReject(user._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
          {requests.received.length === 0 && (
            <div className="text-center text-white/60 py-8">No pending requests</div>
          )}
        </div>
      </div>

      {/* Sent */}
      <div>
        <h2 className="text-2xl font-bold text-white/90 mb-4">
          Sent Requests ({requests.sent.length})
        </h2>
        <div className="space-y-3">
          {requests.sent.map((user) => (
            <div
              key={user._id}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 flex items-center"
            >
              <img
                src={getProfilePhoto(user.profilePhoto, user.username)}
                alt="avatar"
                className="w-12 h-12 rounded-full bg-black/20 mr-3 object-cover"
              />
              <div>
                <h4 className="text-white/90 font-bold">{user.fullName}</h4>
                <span className="text-white/60 text-sm">@{user.username} — Pending</span>
              </div>
            </div>
          ))}
          {requests.sent.length === 0 && (
            <div className="text-center text-white/60 py-8">No sent requests</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestsSection;