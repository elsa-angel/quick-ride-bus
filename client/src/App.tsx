import { useEffect } from "react";

import { Link } from "react-router-dom"; // Or use any routing library you are using.
// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"; // Make sure to import these
import MovingBus from "./Components/MovingBus";
// import Login from "./Pages/Login";

const App = () => {
  useEffect(() => {
    // A simple GET request to set the CSRF cookie
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

  //   const isAuthenticated = false; // You can use a state or props to check the authentication status.
  const hasLoginRoute = true; // Replace this with actual check for login route
  //   const hasRegisterRoute = true; // Replace this with actual check for register route

  return (
    // <Router>
    <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
      {/* Add a link to the login page */}
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

    //   <Routes>
    //     <Route path="/login" element={<Login canResetPassword={true} />} />
    //     {/* Add other routes as needed */}
    //   </Routes>
    // </Router>
  );
};

export default App;
