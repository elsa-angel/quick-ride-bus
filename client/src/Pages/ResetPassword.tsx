import { useState, useEffect, FormEventHandler } from "react";
import { useNavigate } from "react-router-dom";
import GuestLayout from "../Layouts/GuestLayout";

interface ResetPasswordProps {
  token: string;
  email: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ token, email }) => {
  const [data, setData] = useState({
    token: token,
    email: email,
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  // Reset password fields on component unmount
  useEffect(() => {
    return () => {
      setData({ ...data, password: "", password_confirmation: "" });
    };
  }, []);

  const submit: FormEventHandler = async (e) => {
    e.preventDefault();

    setProcessing(true);
    // Replace with actual API request for password reset
    try {
      const response = await fetch("/api/password/reset", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result.errors) {
        setErrors(result.errors);
      } else {
        // Handle successful password reset
        console.log("Password reset successful:", result);
        navigate("/login"); // Redirect to login page after successful reset
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <GuestLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Reset Password
          </h2>

          <form onSubmit={submit}>
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={data.email}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                autoComplete="username"
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
              {errors.email && (
                <div className="text-red-600 text-sm mt-2">{errors.email}</div>
              )}
            </div>

            {/* Password Input */}
            <div className="mt-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={data.password}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                autoComplete="new-password"
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
              {errors.password && (
                <div className="text-red-600 text-sm mt-2">
                  {errors.password}
                </div>
              )}
            </div>

            {/* Password Confirmation Input */}
            <div className="mt-4">
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="password_confirmation"
                type="password"
                name="password_confirmation"
                value={data.password_confirmation}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                autoComplete="new-password"
                onChange={(e) =>
                  setData({ ...data, password_confirmation: e.target.value })
                }
              />
              {errors.password_confirmation && (
                <div className="text-red-600 text-sm mt-2">
                  {errors.password_confirmation}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end mt-4">
              <button
                type="submit"
                className="ms-4 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={processing}
              >
                {processing ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </GuestLayout>
  );
};

export default ResetPassword;
