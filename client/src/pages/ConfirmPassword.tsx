import { useEffect } from "react";
import GuestLayout from "../Layouts/GuestLayout";
import InputError from "../Components/InputError";
import InputLabel from "../Components/InputLabel";
import PrimaryButton from "../Components/PrimaryButton";
import TextInput from "../Components/TextInput";
// import { Head, useForm } from '@inertiajs/react'
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function ConfirmPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      password: "", // Default value for password
    },
  });

  useEffect(() => {
    return () => {
      reset({ password: "" }); // Reset the password when component unmounts
    };
  }, [reset]);

  // Submit handler
  const onSubmit = async (data: any) => {
    try {
      // Send the POST request to confirm the password (adjust the API route)
      await axios.post("/password/confirm", { password: data.password });

      // Reset form after successful submission (optional)
      reset({ password: "" });
    } catch (error) {
      console.error("Password confirmation failed:", error);
    }
  };

  return (
    <GuestLayout>
      {/* <Head title="Confirm Password" /> */}
      <Helmet>
        <title>Confirm Password</title>
      </Helmet>

      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        This is a secure area of the application. Please confirm your password
        before continuing.
      </div>

      {/* Form with handleSubmit */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-4">
          <InputLabel htmlFor="password" value="Password" />

          <TextInput
            id="password"
            type="password"
            className="mt-1 block w-full"
            isFocused={true}
            {...register("password", { required: "Password is required" })}
          />

          {/* Display error if password is invalid */}
          <InputError message={errors.password?.message} className="mt-2" />
        </div>

        <div className="flex items-center justify-end mt-4">
          <PrimaryButton className="ms-4" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Confirm"}
          </PrimaryButton>
        </div>
      </form>
    </GuestLayout>
  );
}
