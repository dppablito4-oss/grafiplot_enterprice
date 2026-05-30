
export function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-bg-light dark:ring-offset-bg-dark";
  
  const variants = {
    primary: "bg-brand-red text-white hover:bg-brand-red-hover focus-visible:ring-brand-red",
    secondary: "bg-brand-yellow text-black hover:bg-brand-yellow-light focus-visible:ring-brand-yellow",
    outline: "border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-gray-400",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus-visible:ring-gray-400"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} px-4 py-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
