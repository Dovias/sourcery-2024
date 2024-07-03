import React from 'react';
import { Outlet } from 'react-router-dom';

import { compileStyle } from '../../../utilities/style.ts';
import { ReactDOMComponentPropsElement } from '../../../utilities/component.ts';

import { FooterLayoutAttributeContext } from './context/attribute.ts';

import { FooterLayoutRouteButton, FooterLayoutRouteButtonAttributes, FooterLayoutRouteButtonElement, FooterLayoutRouteButtonProps } from './FooterLayoutRouteButton.tsx';
import { FooterLayoutParagraph, FooterLayoutParagraphAttributes, FooterLayoutParagraphElement, FooterLayoutParagraphProps } from './FooterLayoutParagraph.tsx';

export type FooterLayoutSignificance = 100 | 200;
export type FooterLayoutEmphasis = 100;

const configuration = {
  container: {
    style: {
      significance: {
        100: 'flex flex-col justify-between min-h-[inherit]',
        200: 'flex flex-col justify-between min-h-[inherit]'
      },
      emphasis: {
        100: ''
      }
    }
  },
  frame: {
    style: {
      significance: {
        100: '',
        200: 'bg-white border-t border-gray-300'
      },
      emphasis: {
        100: ''
      }
    }
  },
  content: {
    style: {
      significance: {
        100: 'flex justify-center items-center min-h-18 mx-6',
        200: 'flex justify-between items-center min-h-18 mx-6'
      },
      emphasis: {
        100: ''
      }
    }
  }
} as const;

export type FooterLayoutAttributes = {
  significance: FooterLayoutSignificance
  emphasis: FooterLayoutEmphasis
};

export type FooterLayoutProps = FooterLayoutAttributes & React.ComponentProps<'div'>;
export type FooterLayoutElement = ReactDOMComponentPropsElement<FooterLayoutProps>;

export const FooterLayout = React.forwardRef(
  function FooterLayout({ className, children, ...props }: FooterLayoutProps, ref?: React.ForwardedRef<FooterLayoutElement>) {
    return (
      <div
        className={compileStyle(
          configuration.container.style.significance[props.significance],
          configuration.container.style.emphasis[props.emphasis],
          className
        )}
        ref={ref}
        {...props}
      >
        {/* TODO: Move this styling into configuration object */}
        <div className="flex flex-1">
          <div className="w-full">
            <Outlet />
          </div>
        </div>
        <footer className={compileStyle(
          configuration.frame.style.significance[props.significance],
          configuration.frame.style.emphasis[props.emphasis]
        )}
        >
          <div className={compileStyle(
            configuration.content.style.significance[props.significance],
            configuration.content.style.emphasis[props.emphasis]
          )}
          >
            <FooterLayoutAttributeContext.Provider value={props}>
              {children}
            </FooterLayoutAttributeContext.Provider>
          </div>
        </footer>
      </div>
    );
  }
) as ReturnType<typeof React.forwardRef<FooterLayoutElement, FooterLayoutProps>> & {
  Route: {
    Button: ReturnType<typeof React.forwardRef<FooterLayoutRouteButtonElement, Omit<FooterLayoutRouteButtonProps, keyof FooterLayoutRouteButtonAttributes> & Partial<FooterLayoutRouteButtonAttributes>>>
  }
  Paragraph: ReturnType<typeof React.forwardRef<FooterLayoutParagraphElement, Omit<FooterLayoutParagraphProps, keyof FooterLayoutParagraphAttributes> & Partial<FooterLayoutParagraphAttributes>>>
};

FooterLayout.Route = {
  Button: FooterLayoutRouteButton as typeof FooterLayout.Route.Button
};

FooterLayout.Paragraph = FooterLayoutParagraph as typeof FooterLayout.Paragraph;
