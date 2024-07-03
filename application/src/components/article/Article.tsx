import React from 'react';
import { compileStyle } from '../../utilities/style.ts';
import { ReactDOMComponentPropsElement } from '../../utilities/component.ts';

import { ArticleAttributeContext } from './context/attribute.ts';

import { ArticleHeading, ArticleHeadingAttributes, ArticleHeadingElement, ArticleHeadingProps } from './ArticleHeading.tsx';
import { ArticleParagraph, ArticleParagraphAttributes, ArticleParagraphElement, ArticleParagraphProps } from './ArticleParagraph.tsx';

export type ArticleSignificance = 100 | 200;
export type ArticleEmphasis = 100 | 200;

const configuration = {
  frame: {
    style: {
      significance: {
        100: '',
        200: ''
      },
      emphasis: {
        100: 'px-10',
        200: 'px-10'
      }
    }
  }
} as const;

export type ArticleAttributes = {
  significance: ArticleSignificance
  emphasis: ArticleEmphasis
};

export type ArticleProps = ArticleAttributes & React.ComponentProps<'article'>;

export type ArticleElement = ReactDOMComponentPropsElement<ArticleProps>;

export const Article = React.forwardRef(
  function Article({ className, children, ...props }: ArticleProps, ref?: React.ForwardedRef<ArticleElement>) {
    return (
      <article
        className={compileStyle(
          configuration.frame.style.significance[props.significance],
          configuration.frame.style.emphasis[props.emphasis],
          className
        )}

        ref={ref}
      >
        <ArticleAttributeContext.Provider value={props}>
          {children}
        </ArticleAttributeContext.Provider>
      </article>
    );
  }
) as {
  Heading: ReturnType<typeof React.forwardRef<ArticleHeadingElement, Omit<ArticleHeadingProps, keyof ArticleHeadingAttributes> & Partial<ArticleHeadingAttributes>>>
  Paragraph: ReturnType<typeof React.forwardRef<ArticleParagraphElement, Omit<ArticleParagraphProps, keyof ArticleParagraphAttributes> & Partial<ArticleParagraphAttributes>>>
} & ReturnType<typeof React.forwardRef<ArticleElement, ArticleProps>>;

Article.Heading = ArticleHeading as typeof Article.Heading;
Article.Paragraph = ArticleParagraph as typeof Article.Paragraph;
