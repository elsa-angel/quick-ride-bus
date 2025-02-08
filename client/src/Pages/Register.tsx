import { useState, useEffect, FormEventHandler } from "react";
import { Link } from "react-router-dom";
import GuestLayout from "../Layouts/GuestLayout";
import PrimaryButton from "../Components/PrimaryButton";
import { customFetch } from "../utils/functions";

const Register: React.FC = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [processing, setProcessing] = useState(false);

  // Reset form fields on component unmount
  useEffect(() => {
    return () => {
      setData({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      });
    };
  }, []);

  const submit: FormEventHandler = async (e) => {
    e.preventDefault();

    if (data.password !== data.password_confirmation) {
      setErrors({
        name: "",
        email: "",
        password: "",
        password_confirmation: "Not same password",
      });
      return;
    } else {
      setErrors({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      });
    }

    setProcessing(true);
    // Make the actual API call here for registration
    try {
      const response = await customFetch("/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.errors) {
        setErrors(result.errors);
      } else {
        // Handle successful registration
        console.log("User registered:", result);
        // Redirect or perform additional actions
      }
    } catch (error) {
      console.error("Error registering user:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <GuestLayout>
      {/* <div className="flex items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8"> */}
      <div className="flex items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Register
          </h2>
          <form onSubmit={submit}>
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={data.name}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                autoComplete="name"
                autoFocus
                onChange={(e) => setData({ ...data, name: e.target.value })}
                required
              />
              {errors.name && (
                <div className="text-red-600 text-sm mt-2">{errors.name}</div>
              )}
            </div>

            {/* Email Input */}
            <div className="mt-4">
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
                required
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
                required
                minLength={5}
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
                required
                minLength={5}
              />
              {errors.password_confirmation && (
                <div className="text-red-600 text-sm mt-2">
                  {errors.password_confirmation}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end mt-4">
              <Link
                to="/login"
                className="underline text-sm text-gray-600 hover:text-gray-900"
              >
                Already registered?
              </Link>

              {/* <button
                type="submit"
                className="ms-4 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={processing}
              >
                {processing ? "Registering..." : "Register"}
              </button> */}
              <PrimaryButton className="ms-4" disabled={processing}>
                Register
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </GuestLayout>
  );
};

export default Register;
