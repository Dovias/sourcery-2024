import { createContext } from 'react';

import { EntryListAttributes } from '../EntryList.tsx';

export const EntryListAttributeContext = createContext<EntryListAttributes | null>(null);
