import React, { useContext } from 'react';

import { ReactDOMComponentPropsElement } from '../../../utilities/component.ts';
import { compileStyle } from '../../../utilities/style.ts';

import { EntryListAttributeContext } from './context/attribute.ts';

import { EntryListEmphasis, EntryListSignificance } from './EntryList.tsx';
import { Icon } from '../../icon/Icon.tsx';

export type EntryListEntryIconButtonSignificance = EntryListSignificance;
export type EntryListEntryIconButtonEmphasis = EntryListEmphasis;

export type EntryListEntryIconButtonAttributes = {
  icon: Icon

  significance: EntryListEntryIconButtonSignificance
  emphasis: EntryListEntryIconButtonEmphasis
};

const configuration = {
  button: {
    icon: {
      style: {
        significance: {
          100: 'm-auto',
          200: 'm-auto',
          300: 'm-auto'
        },
        emphasis: {
          100: 'size-6',
          200: 'size-6',
          300: 'size-6'
        }
      }
    },
    style: {
      significance: {
        100: 'bg-gray-100 hover:bg-gray-200 active:bg-gray-100 active:scale-95 transition duration-200 rounded-xl',
        200: 'bg-gray-100 hover:bg-gray-200 active:bg-gray-100 active:scale-95 transition duration-200 rounded-xl',
        300: 'bg-gray-100 hover:bg-gray-200 active:bg-gray-100 active:scale-95 transition duration-200 rounded-xl'
      },
      emphasis: {
        100: 'block w-full h-[96px] my-4',
        200: 'block w-full h-[104px] my-4'
      }
    }
  }
} as const;

export type EntryListEntryIconButtonProps = EntryListEntryIconButtonAttributes & Omit<React.ComponentProps<'button'>, 'children'>;
export type EntryListEntryIconButtonElement = ReactDOMComponentPropsElement<EntryListEntryIconButtonProps>;

export const EntryListEntryIconButton = React.forwardRef(
  function EntryListEntryIconButton({ icon, significance, emphasis, className, ...props }: EntryListEntryIconButtonProps, ref?: React.ForwardedRef<EntryListEntryIconButtonElement>) {
    const context = useContext(EntryListAttributeContext);
    if (context) {
      significance = significance || context.significance;
      emphasis = emphasis || context.emphasis;
    }

    return (
      <button
        className={compileStyle(
          configuration.button.style.significance[significance],
          configuration.button.style.emphasis[emphasis],
          className
        )}
        ref={ref}
        {...props}
      >
        <Icon
          type={icon}
          className={compileStyle(
            configuration.button.icon.style.significance[significance],
            configuration.button.icon.style.emphasis[emphasis]
          )}
        />
      </button>
    );
  }
);
