import React from 'react';

import { compileStyle } from '../../../utilities/style.ts';

import { Article, ArticleElement, ArticleProps } from '../../article/Article.tsx';
import { ActionArticle } from './ActionArticle.tsx';

export const ActionSectionArticle = React.forwardRef(
  function ActionSectionArticle({ className, ...props }: ArticleProps, ref?: React.ForwardedRef<ArticleElement>) {
    return (
      <ActionArticle
        className={compileStyle('max-w-7xl my-20', className)}
        ref={ref}

        {...props}
      />
    );
  }
) as typeof Article;

ActionSectionArticle.Heading = ActionArticle.Heading;
ActionSectionArticle.Paragraph = ActionArticle.Paragraph;
