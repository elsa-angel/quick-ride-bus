import { useEffect } from "react";
import GuestLayout from "../Layouts/GuestLayout";
import InputError from "../Components/InputError";
import InputLabel from "../Components/InputLabel";
import PrimaryButton from "../Components/PrimaryButton";
import TextInput from "../Components/TextInput";
// import { Head, useForm } from "@inertiajs/react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import axios from "axios";

// Define the structure of the form data
type ResetPasswordProps = {
  token: string;
  email: string;
};

export default function ResetPassword({ token, email }: ResetPasswordProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      token: token,
      email: email,
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    // Reset the form fields when the component unmounts
    return () => {
      reset();
    };
  }, [reset]);

  const onSubmit = async (data: any) => {
    try {
      // Send a POST request to reset the password
      await axios.post("/password/reset", data);
      reset(); // Reset form fields on successful submission
    } catch (error) {
      console.error("Password reset failed", error);
    }
  };

  return (
    <GuestLayout>
      {/* <Head title="Reset Password" /> */}
      <Helmet>
        <title>Reset Password</title>
      </Helmet>

      {/* Form with handleSubmit */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <InputLabel htmlFor="email" value="Email" />

          <TextInput
            id="email"
            type="email"
            autoComplete="username"
            {...register("email", { required: "Email is required" })}
            className="mt-1 block w-full"
          />

          <InputError message={errors.email?.message} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="password" value="Password" />

          <TextInput
            id="password"
            type="password"
            autoComplete="new-password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="mt-1 block w-full"
          />

          <InputError message={errors.password?.message} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel
            htmlFor="password_confirmation"
            value="Confirm Password"
          />

          <TextInput
            id="password_confirmation"
            type="password"
            autoComplete="new-password"
            {...register("password_confirmation", {
              required: "Password confirmation is required",
              validate: (value) =>
                value === getValues("password") || "Passwords do not match",
            })}
            className="mt-1 block w-full"
          />

          <InputError
            message={errors.password_confirmation?.message}
            className="mt-2"
          />
        </div>

        <div className="flex items-center justify-end mt-4">
          <PrimaryButton className="ms-4" disabled={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </PrimaryButton>
        </div>
      </form>
    </GuestLayout>
  );
}
