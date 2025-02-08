import React, { useState } from "react";
import { useEffect } from "react";
import InputError from "../Components/InputError";
import InputLabel from "../Components/InputLabel";
import PrimaryButton from "../Components/PrimaryButton";
import TextInput from "../Components/TextInput";
// import { Head, useForm } from "@inertiajs/react";
// import { PageProps } from '@/types'
import AuthenticatedLayout from "../Layouts/AuthenticatedLayout";
import axios from "axios";
// import { usePage } from "@inertiajs/react";
// import toastr from 'toastr'
// import "toastr/build/toastr.min.css";

// Define a type for the keys of the form data object
type FormKey = "name" | "email" | "message";

interface FormErrors {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  //   toastr.options = {
  //     closeButton: true,
  //     debug: false,
  //     newestOnTop: false,
  //     progressBar: false,
  //     positionClass: 'toast-top-center',
  //     preventDuplicates: false,
  //     showDuration: 300,
  //     hideDuration: 1000,
  //     timeOut: 5000,
  //     extendedTimeOut: 1000,
  //     showEasing: 'swing',
  //     hideEasing: 'linear',
  //     showMethod: 'fadeIn',
  //     hideMethod: 'fadeOut'
  //   }

  const [data, setData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: "",
    email: "",
    message: "",
  });
  const [processing, setProcessing] = useState(false);

  //   useEffect(() => {
  //     return () => {
  //       reset("message");
  //     };
  //   }, []);

  useEffect(() => {
    return () => {
      setData((prevData) => ({ ...prevData, message: "" }));
    };
  }, []);

  const handleChange = (name: FormKey, value: string): void => {
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const errors = { name: "", email: "", message: "" };

    // if (!data.name) {
    //   errors.name = 'Name is required'
    // }

    // Validate name (only letters allowed)
    if (!data.name) {
      errors.name = "Name is required";
    } else if (!/^[a-zA-Z\s]*$/.test(data.name)) {
      errors.name = "Name must contain only letters and spaces";
    }

    if (!data.email) {
      errors.email = "Email is required";
    } else if (!validateEmail(data.email)) {
      errors.email = "Valid email is required";
    }

    // if (!data.message) {
    //   errors.message = 'Message is required'
    // }

    // Validate message (not empty and not only numbers)
    if (!data.message) {
      errors.message = "Message is required";
    } else if (/^\d+$/.test(data.message)) {
      errors.message = "Message must not contain only numbers";
    }

    setFormErrors(errors);

    //   Command: toastr['success']('Message Sent Successfully')

    if (!errors.name && !errors.email && !errors.message) {
      try {
        setProcessing(true);
        const response = await axios.post("/contact", data);
        //   toastr.success('Message Sent Successfully')
        setData((prevData) => ({ ...prevData, message: "" }));
      } catch (error) {
        //   toastr.error('Something went wrong')
      } finally {
        setProcessing(false);
      }
    }
  };

  const validateEmail = (email: string): boolean => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  return (
    <AuthenticatedLayout
      //   user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Contact
        </h2>
      }
    >
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg flex flex-col sm:flex-row items-start">
            {" "}
            {/* <Head title="Contact Us" /> */}
            <form onSubmit={handleSubmit} className="max-w-xl w-full">
              <div className="space-y-6">
                <div>
                  <InputLabel htmlFor="name" value="Name" />
                  <TextInput
                    id="name"
                    type="text"
                    name="name"
                    value={data.name}
                    className="mt-1 block w-full"
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                  <InputError message={formErrors.name} className="mt-2" />
                </div>
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
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                  />
                  {formErrors.email && (
                    <div className="text-red-600 text-sm mt-2">
                      {formErrors.email}
                    </div>
                  )}{" "}
                </div>
                <div>
                  <InputLabel htmlFor="message" value="Message" />
                  <textarea
                    id="message"
                    name="message"
                    value={data.message}
                    className="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm mt-1 block w-full"
                    rows={10}
                    cols={50}
                    onChange={(e) => handleChange("message", e.target.value)}
                  />
                  <InputError message={formErrors.message} className="mt-2" />
                </div>
                <div className="flex justify-end">
                  <PrimaryButton disabled={processing}>
                    {processing ? "Submitting..." : "Submit"}
                  </PrimaryButton>
                </div>
              </div>
            </form>
            <div
              className="sm:w-64 mt-8 sm:mt-0 flex justify-center mx-auto"
              style={{ flex: "1" }}
            >
              <div
                className="flex flex-col justify-start"
                style={{ height: "100%" }}
              >
                <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4">
                  {/* Picture */}
                  <img
                    src="travel.webp"
                    alt="Description of the image"
                    className="w-full h-auto mb-4"
                    style={{ width: "300px", height: "300px" }}
                  />

                  <div className="flex items-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="40"
                      width="40"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span> Kochi, Ernakulam </span>
                  </div>
                  <div className="flex items-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="40"
                      width="40"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                    <span> info@yathramithra.com</span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="40"
                      width="40"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                    </svg>
                    <span> +1234567890</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};
export default Contact;
