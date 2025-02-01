import { useState, useEffect, FormEventHandler } from "react";
import GuestLayout from "../Layouts/GuestLayout";

interface ConfirmPasswordProps {
  status?: string;
}

const ConfirmPassword: React.FC<ConfirmPasswordProps> = () => {
  const [data, setData] = useState({
    password: "",
  });

  const [errors, setErrors] = useState({
    password: "",
  });

  const [processing, setProcessing] = useState(false);

  // Reset password field on unmount
  useEffect(() => {
    return () => {
      setData({ ...data, password: "" });
    };
  }, []);

  const submit: FormEventHandler = async (e) => {
    e.preventDefault();

    setProcessing(true);
    // Mock form submission, replace this with your real API call
    try {
      const response = await fetch("/api/password/confirm", {
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
        // Handle successful password confirmation
        console.log("Password confirmed successfully:", result);
      }
    } catch (error) {
      console.error("Error confirming password:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <GuestLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Confirm Password
          </h2>

          <div className="mb-4 text-sm text-gray-600">
            This is a secure area of the application. Please confirm your
            password before continuing.
          </div>

          <form onSubmit={submit}>
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
                autoComplete="current-password"
                autoFocus
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
              {errors.password && (
                <div className="text-red-600 text-sm mt-2">
                  {errors.password}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end mt-4">
              <button
                type="submit"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={processing}
              >
                {processing ? "Confirming..." : "Confirm"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </GuestLayout>
  );
};

export default ConfirmPassword;
