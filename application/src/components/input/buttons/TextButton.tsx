import React, { MouseEventHandler } from 'react';

import {
  Style,
  KeyStylesheet,
  compileStyle
} from '../../../utilities/style.ts';

export type TextButtonSignificance = 100 | 200 | 300 | 400 | 500 | 600;
export type TextButtonEmphasis = 100 | 200 | 300 | 400 | 500 | 600;
export type TextButtonType = 'button' | 'submit';

const buttonSignificance: KeyStylesheet<TextButtonSignificance> = {
  100: ['transition', 'ease-out', 'duration-100', 'hover:scale-105', 'active:scale-100'],
  200: ['border', 'border-gray-300', 'rounded-full', 'transition-all', 'ease-out', 'duration-200', 'hover:bg-gray-200', 'active:bg-white'],
  300: ['border', 'border-black', 'font-semibold', 'rounded-full', 'transition-all', 'ease-out', 'duration-200', 'hover:bg-gray-200', 'active:bg-white'],
  400: ['bg-black', 'rounded-full', 'text-white', 'transition', 'ease-out', 'duration-200', 'box-border', 'hover:scale-105', 'active:scale-100'],
  500: ['bg-blue-200', 'rounded-full', 'text-white', 'transition', 'ease-out', 'duration-200', 'box-border', 'hover:scale-105', 'active:scale-100'],
  600: ['bg-blue-300', 'rounded-full', 'text-white', 'transition', 'ease-out', 'duration-200', 'box-border', 'hover:scale-105', 'active:scale-100']
};

const buttonEmphasis: KeyStylesheet<TextButtonEmphasis> = {
  100: ['px-3', 'py-0.5', 'text-lg'],
  200: ['px-5', 'py-1', 'text-lg', 'font-semibold'],
  300: ['px-4', 'py-1.5', 'text-lg'],
  400: ['px-8', 'py-1.5', 'text-lg', 'font-semibold'],
  500: ['px-9', 'py-2', 'text-lg', 'font-semibold'],
  600: ['px-10', 'py-2.5', 'text-lg', 'font-semibold']
};

export interface TextButtonProps {
  name: string
  significance: TextButtonSignificance
  emphasis: TextButtonEmphasis
  type?: TextButtonType
  className?: Style
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export const TextButton: React.FC<TextButtonProps> = ({ name, significance, emphasis, className, type, onClick }: TextButtonProps) => {
  return (
    <button
      className={compileStyle(buttonSignificance[significance], buttonEmphasis[emphasis], className)}
      type={type || 'submit'}
      onClick={onClick}
    >
      {name}
    </button>
  );
};
