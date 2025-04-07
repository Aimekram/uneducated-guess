import type { DOMAttributes, InputHTMLAttributes } from "react";

type TextInputProps = {
  label: string;
  placeholder: string;
  type: InputHTMLAttributes<HTMLInputElement>["type"];
  field: {
    name: InputHTMLAttributes<HTMLInputElement>["name"];
    value: InputHTMLAttributes<HTMLInputElement>["value"];
    handleChange: (value: string) => void;
    handleBlur?: DOMAttributes<HTMLInputElement>["onBlur"];
  };
  errorMsg?: string;
  isDisabled?: boolean;
};

export const TextInput = ({
  label,
  placeholder,
  type,
  field,
  errorMsg,
  isDisabled = false,
}: TextInputProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={field.name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={field.name}
        name={field.name}
        value={field.value}
        type={type}
        placeholder={placeholder}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className={`border ${errorMsg ? "border-red-500" : "border-gray-300"} rounded p-2`}
        disabled={isDisabled}
      />
      {errorMsg ? (
        <p className="text-sm text-red-500 mt-1">{errorMsg}</p>
      ) : null}
    </div>
  );
};
