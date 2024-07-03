import React, { Dispatch, SetStateAction } from 'react';
import { ImageDisplay } from './ImageDisplay';
import { KeyStylesheet, compileStyle } from '../../utilities/style';
import { Icon } from '../icon/Icon.tsx';

type ImageCarouselSize = 100 | 200;

const imageCarouselStyles: KeyStylesheet<ImageCarouselSize> = {
  100: ['w-16', 'h-16'],
  200: ['w-32', 'h-32']
};

interface ImageCarouselProps {
  urls: string[]
  currentImageIndex: number
  setCurrentImageIndex: Dispatch<SetStateAction<number>>
  size: ImageCarouselSize
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ urls, currentImageIndex, setCurrentImageIndex, size }) => {
  return (
    <div className="flex py-1">
      <button type="button" onClick={() => setCurrentImageIndex(index => index === 0 ? index : index - 1)}>
        <Icon
          type="tailless-arrow-right"
          className={compileStyle(
            'size-6 rotate-180 transition hover:scale-125 active:scale-100',
            currentImageIndex === 0 ? 'fill-gray-400' : undefined
          )}
        />
      </button>
      <div className="w-full p-0 m-0 overflow-x-hidden overflow-y-hidden">
        <div
          className="transition-all flex flex-shrink-0 overflow-x-visible"
          style={{ transform: `translateX(-${5 * currentImageIndex}rem)`, minWidth: `${5 * urls.length}rem` }}
        >
          {
            urls.map((url, index) => (
              <div
                className="mx-2 cursor-pointer transition-all"
                onClick={() => setCurrentImageIndex(index)}
                key={index}
              >
                <ImageDisplay
                  image64={url}
                  className={compileStyle(imageCarouselStyles[size], `border-2 ${index === currentImageIndex ? 'border-black' : ''}`)}
                />
              </div>
            ))
          }
        </div>
      </div>
      <button type="button" onClick={() => setCurrentImageIndex(index => index === urls.length - 1 ? index : index + 1)}>
        <Icon
          type="tailless-arrow-right"
          className={compileStyle(
            'size-6 transition hover:scale-125 active:scale-100',
            currentImageIndex === urls.length - 1 ? 'fill-gray-400' : undefined
          )}
        />
      </button>
    </div>
  );
};
