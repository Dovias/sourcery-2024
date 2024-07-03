import React from 'react';

import { compileStyle } from '../../../../utilities/style.ts';

import { Article, ArticleElement, ArticleProps } from '../../../article';

export const AuthenticationArticle = React.forwardRef(
  function CenterArticle({ className, children, ...props }: ArticleProps, ref?: React.ForwardedRef<ArticleElement>) {
    return (
      <Article
        className={compileStyle('flex justify-center items-center h-full', className)}
        ref={ref}

        {...props}
      >
        <div className="w-96">
          {children}
        </div>
      </Article>
    );
  }
) as typeof Article;

AuthenticationArticle.Heading = Article.Heading;
AuthenticationArticle.Paragraph = Article.Paragraph;
