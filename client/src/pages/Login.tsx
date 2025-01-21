import { useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Checkbox from "../Components/Checkbox";
import GuestLayout from "../Layouts/GuestLayout";
import InputError from "../Components/InputError";
import InputLabel from "../Components/InputLabel";
import PrimaryButton from "../Components/PrimaryButton";
import TextInput from "../Components/TextInput";
import { Link } from "react-router-dom";
// import { Head, useForm } from "@inertiajs/react";
import { Helmet } from "react-helmet-async";
import axios from "axios";

type FormData = {
  email: string;
  password: string;
  remember: boolean;
};

export default function Login({
  status,
  canResetPassword,
}: {
  status?: string;
  canResetPassword: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const submit: SubmitHandler<FormData> = async (data) => {
    try {
      // Submit form data to backend (replace with your login API route)
      const response = await axios.post("/api/login", data);
      // Handle successful response (redirect, show success message, etc.)
      console.log(response.data);
    } catch (error) {
      // Handle error
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    // Clean up after unmount to reset fields
    return () => {
      setValue("password", "");
    };
  }, [setValue]);

  return (
    <GuestLayout>
      {/* <Head title="Log in" /> */}
      <Helmet>
        <title>Log in</title>
      </Helmet>

      {status && (
        <div className="mb-4 font-medium text-sm text-green-600">{status}</div>
      )}

      <form onSubmit={handleSubmit(submit)}>
        <div>
          <InputLabel htmlFor="email" value="Email" />

          <TextInput
            id="email"
            type="email"
            {...register("email", { required: "Email is required" })}
            className="mt-1 block w-full"
            autoComplete="username"
            isFocused={true}
          />

          <InputError message={errors.email?.message} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="password" value="Password" />

          <TextInput
            id="password"
            type="password"
            {...register("password", { required: "Password is required" })}
            className="mt-1 block w-full"
            autoComplete="current-password"
          />
          <InputError message={errors.password?.message} className="mt-2" />
        </div>

        <div className="block mt-4">
          <label className="flex items-center">
            <Controller
              control={control}
              name="remember"
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value} // `checked` should be boolean
                  onChange={(e) => field.onChange(e.target.checked)} // Handle change
                  value="on" // Set `value` to a string for checkboxes
                />
              )}
            />
            <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
              Remember me
            </span>
          </label>
        </div>

        <div className="flex items-center justify-end mt-4">
          {canResetPassword && (
            <Link
              to="/password/request"
              className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              Forgot your password?
            </Link>
          )}

          <PrimaryButton className="ms-4" disabled={isSubmitting}>
            Log in
          </PrimaryButton>
        </div>
      </form>
    </GuestLayout>
  );
}
