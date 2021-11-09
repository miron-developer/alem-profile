import { useState } from "react";

// useInput custom react hook
export const useInput = (initValue = "") => {
  const [value, setValue] = useState(initValue);
  const handleChange = (e) => setValue(e.target.value);
  const resetField = () => setValue("");
  const setCertainValue = (v) => setValue(v);

  return {
    base: {
      value,
      onChange: handleChange,
    },
    resetField,
    setCertainValue,
  };
};
