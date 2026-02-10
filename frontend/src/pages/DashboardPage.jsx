import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/Date";
import { User, ShieldCheck, Phone, Mail, LogOut } from "lucide-react";
import ConfirmationDialog from "../component/ConfirmationDialog";
const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowConfirm(false);
    logout();
  };

  const handleCancelLogout = () => {
    setShowConfirm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl w-full mx-auto mt-12 p-8 bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800"
    >
      {/* HEADER */}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-3xl font-bold text-white">
          {user?.name?.charAt(0)}
        </div>

        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            {user?.name}
            {user?.isVerified && (
              <ShieldCheck className="text-green-400" size={22} />
            )}
          </h2>
          <p className="text-gray-400">Account Dashboard</p>
        </div>
      </div>

      {/* PROFILE INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 bg-gray-800/60 rounded-xl border border-gray-700"
        >
          <h3 className="text-lg font-semibold text-green-400 mb-4">
            Profile Information
          </h3>

          <p className="text-gray-300 flex items-center gap-2 mb-2">
            <Mail size={16} /> {user?.email || "Not provided"}
          </p>

          <p className="text-gray-300 flex items-center gap-2 mb-2">
            <Phone size={16} /> {user?.phone || "Not provided"}
          </p>

          <p className="text-gray-300 flex items-center gap-2">
            <User size={16} /> Role:{" "}
            <span className="ml-1 text-green-400">
              {user?.role || "User"}
            </span>
          </p>
        </motion.div>

        {/* ACCOUNT ACTIVITY */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 bg-gray-800/60 rounded-xl border border-gray-700"
        >
          <h3 className="text-lg font-semibold text-green-400 mb-4">
            Account Activity
          </h3>

          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Joined:</span>{" "}
            {formatDate(user?.createdAt)}
          </p>

          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Last Login:</span>{" "}
            {formatDate(user?.lastLogin)}
          </p>

          <p className="text-gray-300">
            <span className="font-semibold">Status:</span>{" "}
            <span className="text-green-400">Active</span>
          </p>
        </motion.div>
      </div>

      {/* STATS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8"
      >
        <div className="p-4 bg-gray-800/60 rounded-xl border border-gray-700 text-center">
          <p className="text-2xl font-bold text-white">12</p>
          <p className="text-gray-400 text-sm">Logins</p>
        </div>
        <div className="p-4 bg-gray-800/60 rounded-xl border border-gray-700 text-center">
          <p className="text-2xl font-bold text-white">3</p>
          <p className="text-gray-400 text-sm">Sessions</p>
        </div>
        <div className="p-4 bg-gray-800/60 rounded-xl border border-gray-700 text-center">
          <p className="text-2xl font-bold text-white">100%</p>
          <p className="text-gray-400 text-sm">Profile Complete</p>
        </div>
      </motion.div>

      {/* LOGOUT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogoutClick}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 
          bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold 
          rounded-xl shadow-lg"
        >
          <LogOut size={18} />
          Logout
        </motion.button>
      </motion.div>

      <ConfirmationDialog
        isOpen={showConfirm}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
      />
    </motion.div>
  );
};

export default DashboardPage;

