import React, { useContext } from 'react';

import { compileStyle } from '../../../utilities/style.ts';

import { EntryListAttributeContext } from './context/attribute.ts';

import { EntryListEmphasis, EntryListSignificance } from './EntryList.tsx';
import { ReactDOMComponentPropsElement } from '../../../utilities/component.ts';

export type EntryListEntrySignificance = EntryListSignificance;
export type EntryListEntryEmphasis = EntryListEmphasis;

export type EntryListEntryAttributes = {
  significance: EntryListEntrySignificance
  emphasis: EntryListEntryEmphasis
};

const configuration = {
  style: {
    significance: {
      100: 'border-b border-gray-300 entry last-of-type:border-b-0',
      200: 'border-b border-gray-300',
      300: 'rounded-xl border border-gray-300'
    },
    emphasis: {
      100: 'py-4',
      200: 'mb-4 p-6'
    }
  }
} as const;

export type EntryListEntryProps = EntryListEntryAttributes & React.ComponentProps<'li'>;
export type EntryListEntryElement = ReactDOMComponentPropsElement<EntryListEntryProps>;

export const EntryListEntry = React.forwardRef(
  function EntryListEntry({ significance, emphasis, className, ...props }: EntryListEntryProps, ref?: React.ForwardedRef<EntryListEntryElement>) {
    const context = useContext(EntryListAttributeContext);
    if (context) {
      significance = significance || context.significance;
      emphasis = emphasis || context.emphasis;
    }

    return (
      <li
        className={compileStyle(
          configuration.style.significance[significance],
          configuration.style.emphasis[emphasis],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
