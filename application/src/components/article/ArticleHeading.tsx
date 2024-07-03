import React, { useContext } from 'react';

import { compileStyle } from '../../utilities/style.ts';
import { ReactDOMComponentPropsElement } from '../../utilities/component.ts';

import { ArticleEmphasis, ArticleSignificance } from './Article.tsx';
import { ArticleAttributeContext } from './context/attribute.ts';

export type ArticleHeadingSignificance = ArticleSignificance;
export type ArticleHeadingEmphasis = ArticleEmphasis;

const configuration = {
  style: {
    significance: {
      100: 'text-2xl leading-8',
      200: 'text-2xl leading-10'
    },
    emphasis: {
      100: 'mb-2',
      200: 'mb-2.5'
    }
  }
} as const;

export type ArticleHeadingAttributes = {
  significance: ArticleHeadingSignificance
  emphasis: ArticleHeadingEmphasis
};

export type ArticleHeadingProps = ArticleHeadingAttributes & React.ComponentProps<'h1'>;
export type ArticleHeadingElement = ReactDOMComponentPropsElement<ArticleHeadingProps>;

export const ArticleHeading = React.forwardRef(
  function ArticleHeading({ significance, emphasis, className, children }: ArticleHeadingProps, ref?: React.ForwardedRef<ArticleHeadingElement>) {
    const context = useContext(ArticleAttributeContext);
    if (context) {
      significance = significance || context.significance;
      emphasis = emphasis || context.emphasis;
    }

    return (
      <h1
        className={compileStyle(
          configuration.style.significance[significance],
          configuration.style.emphasis[emphasis],
          className
        )}

        ref={ref}
      >
        {children}
      </h1>
    );
  }
);
