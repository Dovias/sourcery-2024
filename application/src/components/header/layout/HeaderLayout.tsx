import React from 'react';
import { Outlet } from 'react-router-dom';

import { compileStyle } from '../../../utilities/style.ts';
import { ReactDOMComponentPropsElement } from '../../../utilities/component.ts';

import { HeaderLayoutAttributeContext } from './context/attribute.ts';

import { HeaderLayoutSearchField, HeaderLayoutSearchFieldAttributes, HeaderLayoutSearchFieldElement, HeaderLayoutSearchFieldProps } from './HeaderLayoutSearchField.tsx';
import { HeaderLayoutProfileButton, HeaderLayoutProfileButtonAttributes, HeaderLayoutProfileButtonElement, HeaderLayoutProfileButtonProps } from './HeaderLayoutProfileButton.tsx';

export type HeaderLayoutSignificance = 100;
export type HeaderLayoutEmphasis = 100;

export type HeaderLayoutAttributes = {
  significance: HeaderLayoutSignificance
  emphasis: HeaderLayoutEmphasis
};

const configuration = {
  container: {
    style: {
      significance: {
        100: 'flex flex-1'
      },
      emphasis: {
        100: ''
      }
    },

    header: {
      style: {
        significance: {
          100: 'fixed top-0 left-0 z-20 flex bg-white border-b border-gray-300'
        },
        emphasis: {
          100: 'w-full min-h-18'
        }
      }
    },
    content: {
      style: {
        significance: {
          100: 'flex flex-col flex-1'
        },
        emphasis: {
          100: 'mt-18'
        }
      },
      container: {
        style: {
          significance: {
            100: 'flex-1'
          },
          emphasis: {
            100: ''
          }
        }
      }
    }
  }
} as const;

export type HeaderLayoutProps = HeaderLayoutAttributes & React.ComponentProps<'div'>;
export type HeaderLayoutElement = ReactDOMComponentPropsElement<HeaderLayoutProps>;

export const HeaderLayout = React.forwardRef(
  function HeaderLayout({ className, children, ...props }: HeaderLayoutProps, ref?: React.ForwardedRef<HeaderLayoutElement>) {
    return (
      <div
        className={compileStyle(
          configuration.container.style.significance[props.significance],
          configuration.container.style.emphasis[props.emphasis],
          className)}
        ref={ref}
        {...props}
      >
        <header
          className={compileStyle(
            configuration.container.header.style.significance[props.significance],
            configuration.container.header.style.emphasis[props.emphasis],
            className)}
        >
          <HeaderLayoutAttributeContext.Provider value={props}>
            {children}
          </HeaderLayoutAttributeContext.Provider>
        </header>
        <div
          className={compileStyle(
            configuration.container.content.style.significance[props.significance],
            configuration.container.content.style.emphasis[props.emphasis],
            className)}
        >
          <div
            className={compileStyle(
              configuration.container.content.container.style.significance[props.significance],
              configuration.container.content.container.style.emphasis[props.emphasis],
              className)}
          >
            <Outlet />
          </div>
        </div>
      </div>

    );
  }
) as ReturnType<typeof React.forwardRef<HeaderLayoutElement, HeaderLayoutProps>> & {
  Search: {
    Field: ReturnType<typeof React.forwardRef<HeaderLayoutSearchFieldElement, Omit<HeaderLayoutSearchFieldProps, keyof HeaderLayoutSearchFieldAttributes> & Partial<HeaderLayoutSearchFieldAttributes>>>
  }
  Profile: {
    Button: ReturnType<typeof React.forwardRef<HeaderLayoutProfileButtonElement, Omit<HeaderLayoutProfileButtonProps, keyof HeaderLayoutProfileButtonAttributes> & Partial<HeaderLayoutProfileButtonAttributes>>>
  }
};

HeaderLayout.Search = {
  Field: HeaderLayoutSearchField as typeof HeaderLayout.Search.Field
};

HeaderLayout.Profile = {
  Button: HeaderLayoutProfileButton as typeof HeaderLayout.Profile.Button
};
