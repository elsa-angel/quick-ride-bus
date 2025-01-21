import GuestLayout from "../Layouts/GuestLayout";
import InputError from "../Components/InputError";
import PrimaryButton from "../Components/PrimaryButton";
import TextInput from "../Components/TextInput";
// import { Head, useForm } from '@inertiajs/react'
// import { FormEventHandler } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import axios from "axios";

// Define form data type
type FormData = {
  email: string;
};

export default function ForgotPassword({ status }: { status?: string }) {
  // Use react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
    },
  });

  // Submit handler
  const submit = async (data: FormData) => {
    try {
      // Use axios to send the request
      const response = await axios.post("/api/password/email", {
        email: data.email,
      });

      // Optionally handle success, such as showing a success message
      console.log("Password reset email sent:", response.data);
    } catch (error) {
      // Optionally handle errors here
      console.error("Error sending password reset email", error);
    }
  };

  return (
    <GuestLayout>
      {/* <Head title="Forgot Password" /> */}
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>

      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Forgot your password? No problem. Just let us know your email address
        and we will email you a password reset link that will allow you to
        choose a new one.
      </div>

      {status && (
        <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">
          {status}
        </div>
      )}

      <form onSubmit={handleSubmit(submit)}>
        <TextInput
          id="email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Invalid email address",
            },
          })}
          className="mt-1 block w-full"
          isFocused={true}
        />
        <InputError message={errors.email?.message} className="mt-2" />

        <div className="flex items-center justify-end mt-4">
          <PrimaryButton className="ms-4" disabled={isSubmitting}>
            Email Password Reset Link
          </PrimaryButton>
        </div>
      </form>
    </GuestLayout>
  );
}
