import React from "react";

export const CustomInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ ...props }, ref) => (
  <input
    ref={ref}
    {...props}
    className="w-full px-5 py-2 focus:outline-none focus:ring-2 focus:ring-transparent"
    placeholder="301 0457498"
    required
  />
));

CustomInput.displayName = "CustomInput";
