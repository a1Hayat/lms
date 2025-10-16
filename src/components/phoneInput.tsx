import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import React, { useState } from "react";
import { CustomInput } from "./CustomInput";

type Props = {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  className: string;
};

const CustomPhoneInput: React.FC<Props> = ({ value, onChange, className }) => {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (val: string | undefined) => {
    onChange(val);
    if (val && val.length > 5) {
      setError(null);
    }
  };

  return (
    <div className="w-full space-y-1">
      <PhoneInput
        international
        defaultCountry="PK"
        value={value}
        required
        onChange={handleChange}
        className={`flex pl-5 items-center text-xs w-full border focus:ring-1 focus:border-[#F8E8D2] focus:ring-[#F8E8D2] rounded-lg bg-white dark:bg-transparent text-gray-900 dark:text-white focus:outline-none ${className}`}
        countrySelectProps={{
          className:
            "px-3 py-2 bg-white text-xs border-r border-gray-300 focus:outline-none",
        }}
        inputComponent={CustomInput}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default CustomPhoneInput;
