import { createContext } from 'react';

import { ArticleAttributes } from '../Article.tsx';

export const ArticleAttributeContext = createContext<ArticleAttributes | null>(null);
