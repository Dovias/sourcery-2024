import React, { useContext } from 'react';

import { compileStyle } from '../../utilities/style.ts';
import { ReactDOMComponentPropsElement } from '../../utilities/component.ts';

import { ArticleEmphasis, ArticleSignificance } from './Article.tsx';
import { ArticleAttributeContext } from './context/attribute.ts';

export type ArticleParagraphSignificance = ArticleSignificance;
export type ArticleParagraphEmphasis = ArticleEmphasis;

const configuration = {
  style: {
    significance: {
      100: 'text-gray-600',
      200: 'text-black'
    },
    emphasis: {
      100: 'text-lg leading-5',
      200: 'text-lg leading-5'
    }
  }
} as const;

export type ArticleParagraphAttributes = {
  significance: ArticleParagraphSignificance
  emphasis: ArticleParagraphEmphasis
};

export type ArticleParagraphProps = ArticleParagraphAttributes & React.ComponentProps<'p'>;
export type ArticleParagraphElement = ReactDOMComponentPropsElement<ArticleParagraphProps>;

export const ArticleParagraph = React.forwardRef(
  function ArticleParagraph({ significance, emphasis, className, children }: ArticleParagraphProps, ref?: React.ForwardedRef<ArticleParagraphElement>) {
    const context = useContext(ArticleAttributeContext);
    if (context) {
      significance = significance || context.significance;
      emphasis = emphasis || context.emphasis;
    }

    return (
      <p
        className={compileStyle(
          configuration.style.significance[significance],
          configuration.style.emphasis[emphasis],
          className
        )}

        ref={ref}
      >
        {children}
      </p>
    );
  }
);
