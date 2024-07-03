import React, { ChangeEventHandler } from 'react';

interface SelectProps {
  label: string
  value: string
  onChange?: ChangeEventHandler<HTMLSelectElement>
  placeholder?: string
  options: { value: string, label: string }[]
  className?: string
  required?: boolean
  disabled?: boolean
}

export const SelectField: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  placeholder,
  options,
  className,
  required,
  disabled
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={label} className="block text-lg text-gray-500 my-1">
        {label}
      </label>

      <select
        disabled={disabled}
        id={label}
        value={value}
        onChange={onChange}
        className={`${className}`}
        required={required}
        onInvalid={(e: React.InvalidEvent<HTMLSelectElement>) =>
          e.target.setCustomValidity('Please select a country from the list')}
        onInput={(e: React.FormEvent<HTMLSelectElement>) => {
          const target = e.target as HTMLSelectElement;
          target.setCustomValidity('');
        }}
      >
        {!value && placeholder && (
          <option value="" disabled={!value} hidden={!!value}>
            {placeholder}
          </option>
        )}

        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

    </div>
  );
};
