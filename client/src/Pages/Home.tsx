import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
// import BusSearchForm from "../Components/BusSearchForm";
import Authenticated from "../Layouts/AuthenticatedLayout";
import { useAuth } from "../Pages/AuthContext";

const HomePage = ({}) => {
  const location = useLocation();

  const [currentLocation, setCurrentLocation] = useState(location?.pathname);

  useEffect(() => {
    console.log(location?.pathname);
    setCurrentLocation(location?.pathname);
  }, [location]);

  // const { isAuthenticated, logout } = useAuth();
  const { authUser } = useAuth();
  console.log(authUser);

  return (
    <Authenticated
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          {/* {currentLocation?.endsWith('dashboard')
          ? 'Dashboard'
          :  */}
          {currentLocation?.endsWith("schedule_list")
            ? "Schedules List"
            : "Home"}
        </h2>
      }
    >
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              Welcome {authUser.name}!
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* <BusSearchForm isAuthenticated={true} auth={auth} /> */}
        </div>
      </div>
    </Authenticated>
  );
};

export default HomePage;
