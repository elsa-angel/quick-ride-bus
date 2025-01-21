// import { Link, Head, useForm } from "react-router-dom";
// import { PageProps } from "@/types";
// import { useEffect, useState } from "react";
import { useState } from "react";
import InputLabel from "../Components/InputLabel";
import TextInput from "../Components/TextInput";
import axios from "axios";
// import { useForm } from "react-hook-form";

// import moment from "moment";

import { useNavigate } from "react-router-dom";
// import ScheduleList from "@/Pages/ScheduleList";

let schedules: any = [];

export default function BusSearchForm({
  isAuthenticated,
  auth,
}: /*props here*/ any) {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    // date: new Date().toLocaleDateString('en-CA'),
    //time: moment().format('HH:mm')
  });

  const [formErrors, setFormErrors] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
  });

  const [isSchedulesAvailable, setSchedulesAvailable] = useState(false);

  const navigate = useNavigate();

  // const { post } = useForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear the error for the field being edited
    setFormErrors({
      ...formErrors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await axios.post(
      isAuthenticated ? "/schedule_search" : "/schedule_search_g",
      formData
    );

    if (response?.data) {
      schedules = response.data;
      setSchedulesAvailable(true);
      navigate("/schedule_list");
    }
  };

  const getMinTime = (selectedDate: any) => {
    const now = new Date();
    const today = new Date().toISOString().split("T")[0];

    // Create a new date object for the minimum time (5 minutes from now)
    const minTime = new Date(now.getTime() + 5 * 60 * 1000);
    const minTimeString = minTime.toTimeString().split(" ")[0].substring(0, 5);

    if (selectedDate === today) {
      // If today's date is selected, return the minimum time (5 minutes from now)
      return minTimeString;
    }

    // For any future date, return the earliest time (00:00)
    return "00:00";
  };

  return (
    <div className="mt-16">
      {!isSchedulesAvailable && (
        <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg mb-6 lg:mb-8">
          {/* Booking form */}
          <form
            className="flex flex-col sm:flex-row sm:space-x-4"
            onSubmit={handleSubmit}
          >
            {/* From */}
            <div className="mb-4 flex-1">
              <InputLabel
                htmlFor="from"
                className="text-gray-700 dark:text-gray-300"
                value="From:"
              />
              <TextInput
                type="text"
                id="from"
                name="from"
                className="form-input mt-1 block w-full"
                placeholder="Your Departure City"
                value={formData.from}
                onChange={handleChange}
                required
              />
            </div>
            {/* To */}
            <div className="mb-4 flex-1">
              <InputLabel
                htmlFor="to"
                className="text-gray-700 dark:text-gray-300"
                value="To:"
              />
              <TextInput
                type="text"
                id="to"
                name="to"
                className="form-input mt-1 block w-full"
                placeholder="Your Destination City"
                value={formData.to}
                onChange={handleChange}
                required
              />
            </div>
            {/* Date */}
            <div className="mb-4 flex-1">
              <InputLabel
                htmlFor="date"
                className="text-gray-700 dark:text-gray-300"
                value="Date"
              />
              <TextInput
                type="date"
                id="date"
                name="date"
                className="form-input mt-1 block w-full"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            {/* Time */}
            <div className="mb-4 flex-1">
              <InputLabel
                htmlFor="time"
                className="text-gray-700 dark:text-gray-300"
                value="Time:"
              />
              <TextInput
                type="time"
                id="time"
                name="time"
                className="form-input mt-1 block w-full"
                value={formData.time}
                onChange={handleChange}
                min={getMinTime(formData.date)}
                required
              />
            </div>
            {/* Submit button */}
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 self-end sm:self-center"
            >
              Search
            </button>
          </form>
        </div>
      )}
      {/* {isSchedulesAvailable && (
        <ScheduleList auth={auth} schedules={schedules} />
      )} */}
    </div>
  );
}
