import React, { useState } from 'react';
import { ImageDisplay } from '../ImageDisplay';
import { TextButton } from '../../input/buttons/TextButton';
import { ImageCarousel } from '../ImageCarousel';
import { compileStyle } from '../../../utilities/style';
import { SingleImageUpload } from './SingleImageUpload';

interface ImageUploadProps {
  urls: string[]
  setUrls: (urls: string[]) => void
  className?: string
  disabled?: boolean
}

export const MultipleImageUpload: React.FC<ImageUploadProps> = ({ urls, setUrls, className, disabled }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (!e.target.files || !e.target.files[0]) {
      return;
    }

    reader.onloadend = () => {
      setUrls([...urls, `${reader.result?.toString()}`]);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const updateImage = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const reader = new FileReader();
    if (!e.target.files || !e.target.files[0]) {
      return;
    }

    reader.onloadend = () => {
      const newUrls = [...urls];
      newUrls[index] = `${reader.result?.toString()}`;
      setUrls(newUrls);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const removeImage = (indexToRemove: number) => {
    const newUrls = urls.filter((_, index) => index !== indexToRemove);
    setCurrentImageIndex(index => index === urls.length - 1 && index !== 0 ? index - 1 : index);
    setUrls(newUrls);
  };
  return (
    <div className="relative">
      {
        urls.length !== 0 && !disabled && (
          <div className="flex justify-between text-lg items-center pb-3 mb-4">
            <div className="flex">
              <label className="cursor-pointer flex items-center mr-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => updateImage(e, currentImageIndex)}
                  className="hidden"
                />
                <TextButton
                  name="Change image"
                  significance={300}
                  emphasis={200}
                  className="pointer-events-none"
                />
              </label>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadImage}
                  className="hidden"
                />
                <TextButton
                  name="Add image"
                  significance={300}
                  emphasis={200}
                  className="pointer-events-none"
                />
              </label>
            </div>
            <TextButton name="Delete" emphasis={200} significance={400} type="button" onClick={() => removeImage(currentImageIndex)} />
          </div>
        )
      }
      {
        urls.length === 0 && (
          <SingleImageUpload disabled={disabled} buttonText={true} setImage={image => setUrls([image])} className={className} />
        )
      }
      {urls.length > 0 && (
        <>
          <div>
            <ImageDisplay image64={urls[currentImageIndex]} className={compileStyle('w-full', className)} />
          </div>
          <ImageCarousel
            urls={urls}
            currentImageIndex={currentImageIndex}
            setCurrentImageIndex={setCurrentImageIndex}
            size={100}
          />
        </>
      )}
    </div>
  );
};
