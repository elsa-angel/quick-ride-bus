import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Login from "./Pages/Login.tsx";
import Register from "./Pages/Register.tsx";
import ForgotPassword from "./Pages/ForgotPassword.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/login",
    element: <Login canResetPassword={true} />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/password/request",
    element: <ForgotPassword />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <App /> */}
    <RouterProvider router={router} />
  </StrictMode>
);
