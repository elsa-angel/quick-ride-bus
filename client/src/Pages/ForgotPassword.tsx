import { useState, FormEventHandler } from "react";
import GuestLayout from "../Layouts/GuestLayout";
import PrimaryButton from "../Components/PrimaryButton";

interface ForgotPasswordProps {
  status?: string;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ status }) => {
  const [data, setData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({
    email: "",
  });

  const [processing, setProcessing] = useState(false);

  const submit: FormEventHandler = async (e) => {
    e.preventDefault();

    setProcessing(true);
    // Mock form submission, replace this with your real API call
    try {
      const response = await fetch("/api/password/email", {
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
        // Handle successful password reset request
        console.log("Password reset link sent:", result);
      }
    } catch (error) {
      console.error("Error sending password reset email:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <GuestLayout>
      <div className="flex items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Forgot Password
          </h2>

          <div className="mb-4 text-sm text-gray-600">
            Forgot your password? No problem. Just let us know your email
            address and we will email you a password reset link that will allow
            you to choose a new one.
          </div>

          {status && (
            <div className="mb-4 font-medium text-sm text-green-600">
              {status}
            </div>
          )}

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
                autoComplete="email"
                autoFocus
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
              {errors.email && (
                <div className="text-red-600 text-sm mt-2">{errors.email}</div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end mt-4">
              {/*  <button
                type="submit"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={processing}
              >
                {processing ? "Sending..." : "Email Password Reset Link"}
              </button> */}
              <PrimaryButton className="ms-4" disabled={processing}>
                Email Password Reset Link
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </GuestLayout>
  );
};

export default ForgotPassword;
