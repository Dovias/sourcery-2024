import React from 'react';

import { compileStyle } from '../../../utilities/style.ts';

import { Icon } from '../../icon';
import { TextButton } from '../../input/buttons/TextButton.tsx';

interface SingleImageUploadProps {
  setImage: (image: string) => void
  className?: string
  buttonText?: boolean
  sideButton?: boolean
  gradient?: boolean
  disabled?: boolean
  imageUrl?: string
}

export const SingleImageUpload: React.FC<SingleImageUploadProps> = ({
  setImage,
  className,
  buttonText,
  sideButton,
  gradient,
  imageUrl,
  disabled
}) => {
  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (!e.target.files || !e.target.files[0]) {
      return;
    }

    reader.onloadend = () => {
      setImage(`${reader.result?.toString()}`);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div
      className={compileStyle('relative rounded-lg m-auto', gradient ? 'bg-gradient-to-b from-gray-200 to-gray-400' : 'bg-gray-200', className)}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Uploaded"
          className="size-full rounded-lg object-cover"
        />
      )}
      {sideButton && !disabled && (
        <div className="absolute right-[1.5%] bottom-5 bg-white/[24%] rounded-full transition active:scale-90">
          <label>
            <input
              disabled={disabled}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={uploadImage}
            />
            <Icon
              type="camera"
              className="size-[2.75rem] p-2.5 fill-white cursor-pointer"
            />
            {
              buttonText && (
                <TextButton
                  type="button"
                  name="upload"
                  significance={200}
                  emphasis={200}
                  className="mt-3 pointer-events-none"
                />
              )
            }
          </label>
        </div>
      )}
      <label
        className="absolute cursor-pointer flex flex-col items-center top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4"
      >
        {!disabled
        && (
          <>
            <input
              disabled={disabled}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={uploadImage}
            />
            <Icon
              type="camera"
              className="size-16 p-4 fill-black bg-black/[12%] rounded-full cursor-pointer"
            />
            {buttonText && (
              <TextButton
                type="button"
                name="upload"
                significance={200}
                emphasis={200}
                className="mt-3 pointer-events-none"
              />
            )}
          </>
        )}
      </label>
    </div>
  );
};
