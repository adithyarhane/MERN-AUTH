import { Mail, ArrowRight, Backpack } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";

const ResetPasswordEmailForm = ({ setIsEmailSent, email, setEmail }) => {
  const { sendResetOtp } = useAuthContext();

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Reset your password
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Enter your email and we’ll send you a verification code.
        </p>
      </div>

      {/* Form */}
      <form className="space-y-6">
        <div className="relative">
          <Mail
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full pl-12 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-black text-sm"
          />
        </div>

        <button
          onClick={(e) => sendResetOtp(e, email, setIsEmailSent)}
          className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
        >
          Send OTP <ArrowRight size={18} />
        </button>
      </form>

      {/* Footer */}
      <p className="text-xs text-gray-400 text-center mt-6">
        We’ll never share your email.
      </p>
    </div>
  );
};

export default ResetPasswordEmailForm;
