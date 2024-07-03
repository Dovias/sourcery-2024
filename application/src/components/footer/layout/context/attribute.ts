import { createContext } from 'react';

import { FooterLayoutAttributes } from '../FooterLayout.tsx';

export const FooterLayoutAttributeContext = createContext<FooterLayoutAttributes | null>(null);
