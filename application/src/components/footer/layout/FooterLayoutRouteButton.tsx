import React, { useContext } from 'react';
import { Link, LinkProps } from 'react-router-dom';

import { compileStyle } from '../../../utilities/style.ts';
import { ReactDOMComponentPropsElement } from '../../../utilities/component.ts';

import { AppRoutes } from '../../../routes';

import { FooterLayoutAttributeContext } from './context/attribute.ts';

import { FooterLayoutEmphasis, FooterLayoutSignificance } from './FooterLayout.tsx';

export type FooterLayoutRouteButtonSignificance = FooterLayoutSignificance;
export type FooterLayoutRouteButtonEmphasis = FooterLayoutEmphasis;

const configuration = {
  style: {
    significance: {
      100: 'mx-3 text-gray-400 transition duration-100 hover:underline active:scale-90',
      200: 'text-gray-400 transition duration-100 hover:underline active:scale-90'
    },
    emphasis: {
      100: ''
    }
  }
} as const;

export type FooterLayoutRouteButtonAttributes = {
  significance: FooterLayoutRouteButtonSignificance
  emphasis: FooterLayoutRouteButtonEmphasis

  route: AppRoutes
};

export type FooterLayoutRouteButtonProps = FooterLayoutRouteButtonAttributes & Omit<LinkProps, 'to'>;
export type FooterLayoutRouteButtonElement = ReactDOMComponentPropsElement<FooterLayoutRouteButtonProps>;

export const FooterLayoutRouteButton = React.forwardRef(
  function FooterLayoutRouteButton({ significance, emphasis, route, className, ...props }: FooterLayoutRouteButtonProps, ref?: React.ForwardedRef<FooterLayoutRouteButtonElement>) {
    const context = useContext(FooterLayoutAttributeContext);
    if (context) {
      significance = significance || context.significance;
      emphasis = emphasis || context.emphasis;
    }

    return (
      <Link
        className={compileStyle(
          configuration.style.significance[significance],
          configuration.style.emphasis[emphasis],
          className
        )}
        to={route}
        ref={ref}

        {...props}
      />
    );
  }
);
