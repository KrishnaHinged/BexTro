import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

const PROOF_TYPES = ["image", "video", "blog", "link"];

const ProofModal = ({ challenge, onClose, onSuccess }) => {
  const [proofType, setProofType] = useState("image");
  const [proofFile, setProofFile] = useState(null);
  const [proofText, setProofText] = useState("");
  const [proofURL, setProofURL] = useState("");
  const [proofDescription, setProofDescription] = useState("");
  const [proofPreview, setProofPreview] = useState("");
  const [proofVisibility, setProofVisibility] = useState("public");
  const [submitting, setSubmitting] = useState(false);

  const handleTypeChange = (type) => {
    setProofType(type);
    setProofFile(null);
    setProofText("");
    setProofURL("");
    setProofPreview("");
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    setProofFile(file);
    setProofPreview(file ? URL.createObjectURL(file) : "");
  };

  const handleSubmit = async () => {
    const challengeText = challenge.challengeText || challenge.text;
    if (!challengeText) return toast.error("Invalid challenge data.");
    if (!proofDescription.trim()) return toast.error("Please include a description of your proof.");

    if ((proofType === "image" || proofType === "video") && !proofFile)
      return toast.error("Please upload a proof file.");
    if (proofType === "blog" && !proofText.trim())
      return toast.error("Blog content is required.");
    if (proofType === "link" && !/^https?:\/\//.test(proofURL.trim()))
      return toast.error("A valid URL is required.");

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("challengeText", challengeText);
      if (challenge._id) formData.append("challengeId", challenge._id);
      formData.append("proofType", proofType);
      formData.append("description", proofDescription.trim());
      formData.append("visibility", proofVisibility);
      formData.append("timelineTaken", challenge.timelineDays || 0);

      if (proofType === "image" || proofType === "video") {
        formData.append("proofFile", proofFile);
      } else if (proofType === "blog") {
        formData.append("proofUrl", proofText.trim());
      } else if (proofType === "link") {
        formData.append("proofUrl", proofURL.trim());
      }

      const response = await axios.post("http://localhost:5005/api/v1/posts/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Challenge proof submitted!");
      onSuccess(response.data);
      onClose();
    } catch (error) {
      console.error("Proof submission error", error);
      toast.error(error.response?.data?.message || "Failed to submit proof. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white/90 dark:bg-slate-900 rounded-3xl shadow-2xl max-w-3xl w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
          aria-label="Close proof modal"
        >
          ✕
        </button>

        <h2 className="text-lg font-bold mb-4 text-slate-900">
          Submit Proof for:&nbsp;
          <span className="text-indigo-600">{challenge.challengeText || challenge.text}</span>
        </h2>

        {/* Proof Type Tabs */}
        <div className="flex gap-2 mb-4">
          {PROOF_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                proofType === type
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Visibility */}
        <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 mb-4">
          <label className="text-indigo-900 font-bold text-sm mb-3 block pl-1 flex items-center gap-2">
            Post Visibility
          </label>
          <div className="flex gap-3">
            {[
              { value: "public" , label: "Public Feed" },
              { value: "private", label: "Only Me" },
            ].map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setProofVisibility(value)}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  proofVisibility === value
                    ? "border-indigo-500 bg-white shadow-sm ring-2 ring-indigo-50 text-indigo-700"
                    : "border-transparent text-gray-400 bg-white/40 hover:bg-white/60"
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Proof Input */}
        <div className="space-y-4 mb-4">
          {(proofType === "image" || proofType === "video") && (
            <>
              <label className="block text-sm font-semibold text-slate-700">
                Upload {proofType === "image" ? "Image" : "Video"} Proof
              </label>
              <input
                type="file"
                accept={proofType === "image" ? "image/*" : "video/*"}
                onChange={onFileChange}
                className="block w-full border border-gray-200 rounded-lg p-2"
              />
              {proofPreview && (
                <div className="mt-2">
                  {proofType === "image" ? (
                    <img src={proofPreview} alt="preview" className="max-h-52 w-full object-cover rounded-lg" />
                  ) : (
                    <video controls src={proofPreview} className="max-h-52 w-full rounded-lg" />
                  )}
                </div>
              )}
            </>
          )}

          {proofType === "blog" && (
            <>
              <label className="block text-sm font-semibold text-slate-700">Blog proof (text)</label>
              <textarea
                value={proofText}
                onChange={(e) => setProofText(e.target.value)}
                rows={6}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-indigo-300"
                placeholder="Share what you did and include key insights..."
              />
            </>
          )}

          {proofType === "link" && (
            <>
              <label className="block text-sm font-semibold text-slate-700">
                Project link (GitHub / live demo / docs)
              </label>
              <input
                type="url"
                value={proofURL}
                onChange={(e) => setProofURL(e.target.value)}
                placeholder="https://..."
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-indigo-300"
              />
            </>
          )}

          <label className="block text-sm font-semibold text-slate-700">Description</label>
          <textarea
            value={proofDescription}
            onChange={(e) => setProofDescription(e.target.value)}
            rows={3}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-indigo-300"
            placeholder="Explain what you completed and include outcome details."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-slate-700 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Proof & Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProofModal;