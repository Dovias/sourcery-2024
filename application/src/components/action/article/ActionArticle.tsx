import React from 'react';

import { compileStyle } from '../../../utilities/style.ts';

import { Article, ArticleElement, ArticleProps } from '../../article/Article.tsx';

export const ActionArticle = React.forwardRef(
  function ActionArticle({ className, ...props }: ArticleProps, ref?: React.ForwardedRef<ArticleElement>) {
    return (
      <Article
        className={compileStyle('mx-auto', className)}
        ref={ref}

        {...props}
      />
    );
  }
) as typeof Article;

ActionArticle.Heading = Article.Heading;
ActionArticle.Paragraph = Article.Paragraph;
