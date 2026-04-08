import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

export function Button({ className, variant = "primary", size = "md", isLoading, children, ...props }) {
  const variants = {
    primary: "bg-primary text-white hover:brightness-110 shadow-[0_4px_14px_0_rgba(99,102,241,0.39)]",
    secondary: "bg-bg-card text-text-main hover:bg-bg-main border border-border-subtle shadow-sm",
    ghost: "bg-transparent text-text-muted hover:text-text-main hover:bg-bg-main/50",
    outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/10",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg font-bold",
  };

  const classes = twMerge(
    "relative inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden",
    variants[variant],
    sizes[size],
    className
  );

  return (
    <motion.button 
      whileHover={{ y: -1 }}
      className={classes} 
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </div>
      ) : children}
    </motion.button>
  );
}
