import { useEffect } from "react";
import { Link } from "react-router-dom";

import MovingBus from "./Components/MovingBus";

const App = () => {
  useEffect(() => {
    fetch("/csrf-cookie", { method: "GET", credentials: "include" })
      .then((response) => {
        if (response.ok) {
          console.log("CSRF cookie set");
        }
      })
      .catch((error) => {
        console.error("Error setting CSRF cookie:", error);
      });
  }, []);

  return (
    <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
      <div className="sm:fixed sm:top-0 sm:right-0 p-6 text-right z-10 flex space-x-4">
        <Link
          to="/login"
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          Register
        </Link>
      </div>

      <MovingBus />
    </div>
  );
};

export default App;
