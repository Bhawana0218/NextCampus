import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

const VARIANTS = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-300",
  secondary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-500 disabled:bg-slate-400",
  outline: "border border-slate-200 text-slate-700 hover:bg-slate-50 focus:ring-slate-400 disabled:opacity-50",
  ghost: "text-slate-600 hover:bg-slate-100 focus:ring-slate-400 disabled:opacity-50",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium
        transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:cursor-not-allowed
        ${VARIANTS[variant]}
        ${SIZES[size]}
        ${className}
      `}
    >
      {loading && (
        <svg
          className="animate-spin w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
