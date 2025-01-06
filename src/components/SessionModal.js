import React from 'react';

const Modal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h3 className="text-xl font-semibold">{message}</h3>
        <div className="mt-4 flex justify-end">
          <button
              className="px-3 py-1 bg-gray-100 text-md text-gray-700 font-semibold rounded hover:bg-emerald-200 transition"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
