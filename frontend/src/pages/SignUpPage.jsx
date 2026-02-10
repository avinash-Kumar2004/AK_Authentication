import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader, Mail, Phone, User } from "lucide-react";
import Input from "../component/input";
import CreatePasswordStep from "../component/CreatePasswordStep";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isPasswordStep = location.pathname.includes("create-password");

  const { signup, error, isLoading } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 🔒 Route Guard
  useEffect(() => {
    if (
      isPasswordStep &&
      (!name || !email || phone.length !== 10 || !dob || !gender)
    ) {
      navigate("/signup");
    }
  }, [isPasswordStep, name, email, phone, dob, gender, navigate]);

  const isStep1Valid =
    name && email && phone.length === 10 && dob && gender;

  const handleSignUp = async (e) => {
    e.preventDefault();

    // STEP 1 → Next page
    if (!isPasswordStep) {
      if (!isStep1Valid) return;
      navigate("/signup/create-password");
      return;
    }

    // STEP 2 → Final submit
    if (password.length < 8) return;

    try {
      await signup(name, email, phone, dob, password, gender);
      navigate("/verify-email");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Create Account
        </h2>

        <p className="text-center text-sm text-gray-400 mb-6">
          Step {isPasswordStep ? 2 : 1} of 2
        </p>

        <form onSubmit={handleSignUp}>
          {/* STEP 1 */}
          {!isPasswordStep && (
            <>
              <Input
                icon={User}
                placeholder="Full Name"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                icon={Mail}
                type="email"
                placeholder="Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                icon={Phone}
                type="tel"
                placeholder="Phone (10 digit)"
                value={phone}
                maxLength={10}
                required
                onChange={(e) =>
                  setPhone(
                    e.target.value.replace(/[^0-9]/g, "").slice(0, 10)
                  )
                }
              />

              {phone.length > 0 && phone.length !== 10 && (
                <p className="text-xs text-red-500 mt-1">
                  Phone number must be 10 digits
                </p>
              )}

              <div className="mb-6">
                <label className="text-sm text-gray-400">
                  Date of Birth
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full mt-1 py-2 px-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div className="mb-6">
                <label className="text-sm text-gray-400">Gender</label>
                <select
                  value={gender}
                  required
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full mt-1 py-2 px-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </>
          )}

          {/* STEP 2 */}
          {isPasswordStep && (
            <CreatePasswordStep
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              onBack={() => navigate("/signup")}
              error={error}
            />
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={
              isLoading ||
              (!isPasswordStep && !isStep1Valid) ||
              (isPasswordStep && password.length < 8)
            }
            className={`mt-4 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg ${
              isLoading ||
              (!isPasswordStep && !isStep1Valid) ||
              (isPasswordStep && password.length < 8)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto" />
            ) : !isPasswordStep ? (
              "Next"
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>
      </div>

      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 text-center">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUpPage;
