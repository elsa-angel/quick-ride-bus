// import "./App.css";

// function App() {
//   return <h1>Home</h1>;
// }

// export default App;

import { Link } from "react-router-dom"; // Or use any routing library you are using.
import MovingBus from "./Components/MovingBus";

const App = () => {
  //   const isAuthenticated = false; // You can use a state or props to check the authentication status.
  const hasLoginRoute = true; // Replace this with actual check for login route
  //   const hasRegisterRoute = true; // Replace this with actual check for register route

  return (
    <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
      {hasLoginRoute && (
        <div className="sm:fixed sm:top-0 sm:right-0 p-6 text-right z-10"></div>
      )}
      <MovingBus />
    </div>
  );
};

export default App;
