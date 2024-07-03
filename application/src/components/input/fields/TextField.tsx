import React, { ChangeEventHandler } from 'react';

import { compileStyle } from '../../../utilities/style.ts';

interface InputProps {
  label?: string
  value: string
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  placeholder?: string
  className?: string
  textArea?: boolean
  required?: boolean
  readOnly?: boolean

}

// Kept here because in the future it will be factored out by genaric input components
export const TextField: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  className,
  textArea,
  required,
  readOnly
}) => {
  return (
    <div className={compileStyle('mb-6', className)}>
      {label && (
        <label htmlFor={label} className="block text-lg leading-4 mb-2 text-gray-500">
          {label}
        </label>
      )}

      {
        textArea
          ? (
            <textarea
              readOnly={readOnly}
              required={required}
              id={label}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              className="rounded-lg text-lg leading-4 resize-none w-full h-28 border border-gray-300 pl-[0.9rem] pt-3"
            >
            </textarea>
            )
          : (
            <input
              readOnly={readOnly}
              required={required}
              type="text"
              id={label}
              className="rounded-lg text-lg leading-4 pl-[0.9rem] py-[0.7rem] w-full border border-gray-300"
              placeholder={placeholder}
              value={value}
              onChange={onChange}
            />
            )
      }

    </div>
  );
};
