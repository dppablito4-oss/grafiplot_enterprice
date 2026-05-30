
export function Card({ children, className = '', ...props }) {
  return (
    <div 
      className={`bg-white dark:bg-[#2a2a2a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`mb-4 pb-4 border-b border-gray-100 dark:border-gray-800 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
}
