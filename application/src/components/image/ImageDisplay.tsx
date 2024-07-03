import React from 'react';

interface ImageDisplayProps {
  image64: string
  className?: string
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ image64, className }) => {
  return (
    <img
      src={image64}
      className={`object-cover rounded-xl ${className} ${
            image64 && image64 !== '' ? '' : 'invisible'
      }`}
    />
  );
};
