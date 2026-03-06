import { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function PrimaryButton({ children, className = "", ...props }: PrimaryButtonProps) {
  return (
    <button
      className={`rounded-xl bg-abseco-orange px-4 py-3 font-medium text-white shadow-orange transition hover:opacity-90 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
