import { Eye, EyeOff, Lock } from "lucide-react";
import Input from "./input";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

const CreatePasswordStep = ({
  password,
  setPassword,
  showPassword,
  setShowPassword,
  onBack,
  error,
}) => {
  return (
    <>
      <div className="relative">
        <Input
          icon={Lock}
          type={showPassword ? "text" : "password"}
          placeholder="Create Password"
          value={password}
          required
          minLength={8}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <PasswordStrengthMeter password={password} />

      <button
        type="button"
        onClick={onBack}
        className="mt-2 text-sm text-gray-400 hover:text-green-400"
      >
        ← Back
      </button>
    </>
  );
};

export default CreatePasswordStep;
