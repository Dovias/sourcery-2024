import React, { useContext } from 'react';

import { compileStyle } from '../../../utilities/style.ts';
import { ReactDOMComponentPropsElement } from '../../../utilities/component.ts';

import { FooterLayoutAttributeContext } from './context/attribute.ts';

import { FooterLayoutEmphasis, FooterLayoutSignificance } from './FooterLayout.tsx';

export type FooterLayoutParagraphSignificance = FooterLayoutSignificance;
export type FooterLayoutParagraphEmphasis = FooterLayoutEmphasis;

const configuration = {
  style: {
    significance: {
      100: 'mx-3 text-gray-400',
      200: 'text-gray-400'
    },
    emphasis: {
      100: ''
    }
  }
} as const;

export type FooterLayoutParagraphAttributes = {
  significance: FooterLayoutParagraphSignificance
  emphasis: FooterLayoutParagraphEmphasis
};

export type FooterLayoutParagraphProps = FooterLayoutParagraphAttributes & React.ComponentProps<'p'>;
export type FooterLayoutParagraphElement = ReactDOMComponentPropsElement<FooterLayoutParagraphProps>;

export const FooterLayoutParagraph = React.forwardRef(
  function FooterLayoutParagraph({ significance, emphasis, className, ...props }: FooterLayoutParagraphProps, ref?: React.ForwardedRef<FooterLayoutParagraphElement>) {
    const context = useContext(FooterLayoutAttributeContext);
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

        {...props}
      />
    );
  }
);
