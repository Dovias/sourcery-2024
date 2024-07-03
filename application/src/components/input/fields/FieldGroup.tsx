import React, { ReactElement } from 'react';

interface InputGroupProps extends React.PropsWithChildren {
  children: ReactElement | ReactElement[]
  className?: string
  heading: string
}

export const FieldGroup: React.FC<InputGroupProps> = ({
  children,
  className,
  heading
}) => {
  return (
    <div
      className={
        'container pb-10 mb-[2rem] border-b border-gray-300 ' + className
      }
    >
      <h2 className="mb-6 capitalize">{heading}</h2>
      <div>{children}</div>
    </div>
  );
};
