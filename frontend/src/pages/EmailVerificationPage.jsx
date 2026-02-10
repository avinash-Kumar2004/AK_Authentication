import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { verifyEmail, isLoading, error } = useAuthStore();

  // Handle typing
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste OTP
  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newCode = ["", "", "", "", "", ""];
    pastedData.split("").forEach((digit, index) => {
      newCode[index] = digit;
    });

    setCode(newCode);

    const focusIndex =
      pastedData.length >= 6 ? 5 : pastedData.length;
    inputRefs.current[focusIndex]?.focus();
  };

  // Submit ONLY on button click
  const handleSubmit = async (e) => {
    e.preventDefault();

    const verificationCode = code.join("");
    if (verificationCode.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    try {
      await verifyEmail(verificationCode);
      toast.success("Email verified successfully 🎉");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8"
      >
        <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Verify Your Email
        </h2>

        <p className="text-center text-gray-300 mb-6">
          Enter the 6-digit code sent to your email
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleChange(index, e.target.value)
                }
                onKeyDown={(e) =>
                  handleKeyDown(index, e)
                }
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm font-semibold text-center">
              {error}
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || code.some((d) => !d)}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-lg disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
