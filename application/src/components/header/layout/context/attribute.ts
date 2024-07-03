import { createContext } from 'react';

import { HeaderLayoutAttributes } from '../HeaderLayout.tsx';

export const HeaderLayoutAttributeContext = createContext<HeaderLayoutAttributes | null>(null);
