import GuestLayout from "../Layouts/GuestLayout";
import InputError from "../Components/InputError";
import InputLabel from "../Components/InputLabel";
import PrimaryButton from "../Components/PrimaryButton";
import TextInput from "../Components/TextInput";
import { Link } from "react-router-dom";
// import { Head, useForm } from "@inertiajs/react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import axios from "axios";

// Define the structure of the form data
type FormData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};
export default function Register() {
  // Use react-hook-form to manage form state
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  // Handle form submission with axios
  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post("/api/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      // Handle success, redirect or show success message
      console.log("Registration successful", response.data);
    } catch (error) {
      console.error("Error during registration", error);
    }
  };

  return (
    <GuestLayout>
      {/* <Head title="Register" /> */}
      <Helmet>
        <title>Register</title>
      </Helmet>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <InputLabel htmlFor="name" value="Name" />

          <TextInput
            id="name"
            type="text"
            {...register("name", { required: "Name is required" })}
            className="mt-1 block w-full"
            autoComplete="name"
            isFocused={true}
          />
          <InputError message={errors.name?.message} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="email" value="Email" />

          <TextInput
            id="email"
            type="email"
            {...register("email", { required: "Email is required" })}
            className="mt-1 block w-full"
            autoComplete="username"
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
            autoComplete="new-password"
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
            {...register("password_confirmation", {
              required: "Password confirmation is required",
              validate: (value) =>
                value === getValues("password") || "Passwords do not match",
            })}
            className="mt-1 block w-full"
            autoComplete="new-password"
          />
          <InputError
            message={errors.password_confirmation?.message}
            className="mt-2"
          />
        </div>

        <div className="flex items-center justify-end mt-4">
          <Link
            to="/login"
            className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
          >
            Already registered?
          </Link>

          <PrimaryButton className="ms-4" disabled={isSubmitting}>
            Register
          </PrimaryButton>
        </div>
      </form>
    </GuestLayout>
  );
}
