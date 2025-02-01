import { Link, LinkProps, useLocation } from "react-router-dom";

interface ResponsiveNavLinkProps extends Omit<LinkProps, "to"> {
  active?: boolean;
  className?: string;
  as?: "button" | "a"; // default is 'a', could be 'button'
  onClick?: () => void;
  to?: string; // to is optional only when as is 'button'
}

export default function ResponsiveNavLink({
  active = false,
  className = "",
  children,
  as = "a", // default to 'a' for Link
  to, // to is optional when 'as' is 'button'
  ...props
}: ResponsiveNavLinkProps) {
  const location = useLocation();

  // Check if the current location matches the link's destination
  const isActive = active || location.pathname === to;

  if (as === "button") {
    return (
      <button
        onClick={props.onClick}
        className={`w-full flex items-start ps-3 pe-4 py-2 border-l-4 ${
          isActive
            ? "border-indigo-400 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/50 focus:text-indigo-800 dark:focus:text-indigo-200 focus:bg-indigo-100 dark:focus:bg-indigo-900 focus:border-indigo-700 dark:focus:border-indigo-300"
            : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:text-gray-800 dark:focus:text-gray-200 focus:bg-gray-50 dark:focus:bg-gray-700 focus:border-gray-300 dark:focus:border-gray-600"
        } text-base font-medium focus:outline-none transition duration-150 ease-in-out ${className}`}
      >
        {children}
      </button>
    );
  }

  // Default to rendering a <Link>
  return (
    <Link
      {...props}
      to={to!} // TypeScript will now be happy with 'to' since it's required for 'Link'
      className={`w-full flex items-start ps-3 pe-4 py-2 border-l-4 ${
        isActive
          ? "border-indigo-400 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/50 focus:text-indigo-800 dark:focus:text-indigo-200 focus:bg-indigo-100 dark:focus:bg-indigo-900 focus:border-indigo-700 dark:focus:border-indigo-300"
          : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:text-gray-800 dark:focus:text-gray-200 focus:bg-gray-50 dark:focus:bg-gray-700 focus:border-gray-300 dark:focus:border-gray-600"
      } text-base font-medium focus:outline-none transition duration-150 ease-in-out ${className}`}
    >
      {children}
    </Link>
  );
}
