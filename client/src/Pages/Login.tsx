import { useState, useEffect, FormEventHandler } from "react";
import GuestLayout from "../Layouts/GuestLayout";
import PrimaryButton from "../Components/PrimaryButton";
import Authenticated from "../Layouts/AuthenticatedLayout";
import { customFetch } from "../utils/functions";

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

const Login: React.FC<LoginProps> = ({ status, canResetPassword }) => {
  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [processing, setProcessing] = useState(false);

  // Reset password field on unmount
  useEffect(() => {
    return () => {
      setData((prevData) => ({ ...prevData, password: "" }));
    };
  }, []);

  const submit: FormEventHandler = async (e) => {
    e.preventDefault();

    setProcessing(true);
    // Mock form submission, replace this with your real API call
    try {
      const response = await customFetch("/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.errors) {
        setErrors(result.errors);
      } else {
        // Handle successful login
        console.log("Login successful", result);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <GuestLayout>
      {/* <Authenticated> */}
      {/* <div className="relative top-[calc(100vh/5)] flex items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8"> */}
      <div className="flex items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Log in
          </h2>
          {/* 
          {status && (
            <div className="mb-4 font-medium text-sm text-green-600">
              {status}
            </div>
          )} */}

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
                autoFocus
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
                autoComplete="current-password"
                onChange={(e) => setData({ ...data, password: e.target.value })}
              />
              {errors.password && (
                <div className="text-red-600 text-sm mt-2">
                  {errors.password}
                </div>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="block mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  checked={data.remember}
                  onChange={(e) =>
                    setData({ ...data, remember: e.target.checked })
                  }
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-between mt-4">
              {canResetPassword && (
                <a
                  href="/password/request"
                  className="underline text-sm text-gray-600 hover:text-gray-900"
                >
                  Forgot your password?
                </a>
              )}

              {/* Submit Button */}
              {/* <button
                type="submit"
                className="w-full mt-4 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={processing}
              >
                {processing ? "Logging in..." : "Log in"}
              </button> */}
              <PrimaryButton className="ms-4" disabled={processing}>
                Log in
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
      {/* </Authenticated> */}
    </GuestLayout>
  );
};

export default Login;
