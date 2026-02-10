import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader, Phone, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../component/input";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
  const [loginType, setLoginType] = useState("email"); // email | phone
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!password) return;

    try {
      if (loginType === "email") {
        await login({ email, password });
      } else {
        await login({ phone, password });
      }
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
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Welcome Back
        </h2>

        {/* Email / Phone Toggle */}
        <div className="flex mb-6 bg-gray-900 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setLoginType("email")}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition
              ${
                loginType === "email"
                  ? "bg-green-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => setLoginType("phone")}
            className={`flex-1 py-2 rounded-md text-sm font-semibold transition
              ${
                loginType === "phone"
                  ? "bg-green-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
          >
            Phone
          </button>
        </div>

        <form onSubmit={handleLogin}>
          {loginType === "email" ? (
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          ) : (
            <Input
              icon={Phone}
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/[^0-9]/g, ""))
              }
              required
            />
          )}

          {/* Password */}
          <div className="relative">
            <Input
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-center mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-green-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="text-red-500 font-semibold mb-3">{error}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="w-6 h-6 animate-spin mx-auto" />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
      </div>

      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-gray-400">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
