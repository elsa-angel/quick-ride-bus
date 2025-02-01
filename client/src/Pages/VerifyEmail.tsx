import { useState, FormEventHandler } from "react";
import { useNavigate } from "react-router-dom";
import GuestLayout from "../Layouts/GuestLayout";

const VerifyEmail: React.FC = () => {
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  const submit: FormEventHandler = async (e) => {
    e.preventDefault();

    setProcessing(true);

    try {
      // Replace with your API request to resend the verification email
      const response = await fetch("/api/email/verification-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.status === "verification-link-sent") {
        setStatus("verification-link-sent");
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Log out the user by sending a POST request to the logout endpoint
      await fetch("/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      navigate("/login"); // Redirect to the login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <GuestLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Email Verification
          </h2>

          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            Thanks for signing up! Before getting started, could you verify your
            email address by clicking on the link we just emailed to you? If you
            didn't receive the email, we will gladly send you another.
          </div>

          {status === "verification-link-sent" && (
            <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">
              A new verification link has been sent to the email address you
              provided during registration.
            </div>
          )}

          <form onSubmit={submit}>
            <div className="mt-4 flex items-center justify-between">
              <button
                type="submit"
                disabled={processing}
                className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {processing ? "Resending..." : "Resend Verification Email"}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              >
                Log Out
              </button>
            </div>
          </form>
        </div>
      </div>
    </GuestLayout>
  );
};

export default VerifyEmail;
