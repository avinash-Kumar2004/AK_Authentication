// ConfirmationDialog.jsx
import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Check, X } from "lucide-react";

const ConfirmationDialog = ({ isOpen, onConfirm, onCancel, title = "Confirm Action", message = "Are you sure?" }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="bg-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-800 max-w-sm w-full"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-yellow-400" size={24} />
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="flex items-center gap-2 py-2 px-4 bg-gray-700 text-white font-semibold rounded-lg"
          >
            <X size={16} />
            No
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConfirm}
            className="flex items-center gap-2 py-2 px-4 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-lg"
          >
            <Check size={16} />
            Yes
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmationDialog;