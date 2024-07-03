import React from 'react';

import { ReactDOMComponentPropsElement } from '../../../utilities/component.ts';

import { EntryListAttributeContext } from './context/attribute.ts';

import { EntryListEntryIconButton, EntryListEntryIconButtonAttributes, EntryListEntryIconButtonElement, EntryListEntryIconButtonProps } from './EntryListEntryIconButton.tsx';
import { EntryListCategory, EntryListCategoryAttributes, EntryListCategoryElement, EntryListCategoryProps } from './EntryListCategory.tsx';
import { EntryListEntry, EntryListEntryAttributes, EntryListEntryElement, EntryListEntryProps } from './EntryListEntry.tsx';

export type EntryListSignificance = 100 | 200 | 300;
export type EntryListEmphasis = 100 | 200;

export type EntryListAttributes = {
  significance: EntryListSignificance
  emphasis: EntryListEmphasis
};

export type EntryListProps = EntryListAttributes & React.ComponentProps<'ul'>;
export type EntryListElement = ReactDOMComponentPropsElement<EntryListProps>;

export const EntryList = React.forwardRef(
  function EntryList({ significance, emphasis, ...props }: EntryListProps, ref?: React.ForwardedRef<EntryListElement>) {
    return (
      <EntryListAttributeContext.Provider value={{ significance, emphasis }}>
        <ul ref={ref} {...props} />
      </EntryListAttributeContext.Provider>
    );
  }
) as {
  Category: ReturnType<typeof React.forwardRef<EntryListCategoryElement, Omit<EntryListCategoryProps, keyof EntryListCategoryAttributes> & Partial<EntryListCategoryAttributes>>>
  Entry: {
    Icon: {
      Button: ReturnType<typeof React.forwardRef<EntryListEntryIconButtonElement, Omit<EntryListEntryIconButtonProps, keyof EntryListEntryIconButtonAttributes> & Partial<EntryListEntryIconButtonAttributes>>>
    }
  } & ReturnType<typeof React.forwardRef<EntryListEntryElement, Omit<EntryListEntryProps, keyof EntryListEntryAttributes> & Partial<EntryListEntryAttributes>>>
} & ReturnType<typeof React.forwardRef<EntryListElement, EntryListProps>>;

EntryList.Category = EntryListCategory as typeof EntryList.Category;

EntryList.Entry = EntryListEntry as typeof EntryList.Entry;

EntryList.Entry.Icon = {
  Button: EntryListEntryIconButton as typeof EntryList.Entry.Icon.Button
};
