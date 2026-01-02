import React, { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ResetPasswordEmailForm from "../components/ResetPasswordEmailForm";
import ResetOtpForm from "../components/ResetOtpForm";
import NewPasswordForm from "../components/NewPasswordForm";
import useTitle from "../components/useTitle";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [resetOtp, setResetOtp] = useState();
  const [isEmailsent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  useTitle("Reset Password");

  return (
    <div className="absolute min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
      {!isEmailsent && (
        <ResetPasswordEmailForm
          setIsEmailSent={setIsEmailSent}
          email={email}
          setEmail={setEmail}
        />
      )}
      {isEmailsent && !isOtpSubmitted && (
        <ResetOtpForm
          setIsOtpSubmitted={setIsOtpSubmitted}
          setResetOtp={setResetOtp}
        />
      )}
      {isEmailsent && isOtpSubmitted && (
        <NewPasswordForm resetOtp={resetOtp} email={email} />
      )}
      <Link to={"/"} className="text-3xl font-bold absolute top-6 left-12">
        🔐 Auth
      </Link>
    </div>
  );
};

export default ResetPassword;
