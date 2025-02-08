import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Login from "./Pages/Login.tsx";
import Register from "./Pages/Register.tsx";
import ForgotPassword from "./Pages/ForgotPassword.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./Pages/Home.tsx";
import { AuthProvider } from "./Pages/AuthContext.tsx";
import Contact from "./Pages/Contact.tsx";

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
  {
    path: "/home",
    element: <HomePage />,
    errorElement: <div>404 Not Found</div>,
  },
  {
    path: "/contact",
    element: <Contact />,
    errorElement: <div>404 Not Found</div>,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
