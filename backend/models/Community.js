import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        
        creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        
        tags: [{ type: String }],
        
        coverColor: { type: String, default: "from-indigo-500 to-purple-600" }, // For frontend gradients
    },
    { timestamps: true }
);

const Community = mongoose.model("Community", communitySchema);

export default Community;
