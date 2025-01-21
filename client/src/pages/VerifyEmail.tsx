import GuestLayout from "../Layouts/GuestLayout";
import PrimaryButton from "../Components/PrimaryButton";
import { Link } from "react-router-dom";
// import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import axios from "axios";

export default function VerifyEmail({ status }: { status?: string }) {
  const [processing, setProcessing] = useState(false); // Track the loading state for the button

  const submit: FormEventHandler = async (e) => {
    e.preventDefault();

    setProcessing(true); // Start loading
    try {
      // Send the request to resend the verification email
      await axios.post("/email/verification-notification"); // Replace with your actual API route
      setProcessing(false); // Stop loading after the request completes
    } catch (error) {
      setProcessing(false); // Stop loading if there is an error
      console.error("Error resending verification email:", error);
    }
  };

  return (
    <GuestLayout>
      {/* <Head title="Email Verification" /> */}
      <Helmet>
        <title>Reset Password</title>
      </Helmet>

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
          <PrimaryButton disabled={processing}>
            {processing ? "Sending..." : "Resend Verification Email"}
          </PrimaryButton>

          <Link
            to="/logout"
            className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            Log Out
          </Link>
        </div>
      </form>
    </GuestLayout>
  );
}
