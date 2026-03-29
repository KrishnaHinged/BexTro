import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-200 max-w-md w-full">
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800 float-right text-xl"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;