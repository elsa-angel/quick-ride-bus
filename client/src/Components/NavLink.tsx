import { NavLink as RouterNavLink } from "react-router-dom";

interface NavLinkProps {
  className?: string;
  children: React.ReactNode;
  to: string; // 'to' prop for routing
}

export default function NavLink({
  className = "",
  children,
  ...props
}: NavLinkProps) {
  return (
    <RouterNavLink
      {...props}
      className={({ isActive }) =>
        "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none " +
        (isActive
          ? "border-indigo-400 dark:border-indigo-600 text-gray-900 dark:text-gray-100 focus:border-indigo-700 "
          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700 ") +
        className
      }
    >
      {children}
    </RouterNavLink>
  );
}
