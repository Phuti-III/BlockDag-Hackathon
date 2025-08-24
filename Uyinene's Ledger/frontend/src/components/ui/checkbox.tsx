import * as React from "react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", indeterminate, ...props }, ref) => {
    React.useEffect(() => {
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.indeterminate = !!indeterminate;
      }
    }, [ref, indeterminate]);

    return (
      <input
        type="checkbox"
        ref={ref}
        className={`form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary transition ${className}`}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";