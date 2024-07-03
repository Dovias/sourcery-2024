import React, { useContext, useImperativeHandle, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { ReactDOMComponentPropsElement } from '../../../utilities/component.ts';
import { compileStyle } from '../../../utilities/style.ts';

import { AppRoutes } from '../../../routes';

import { RootState } from '../../../store/store.ts';

import { useDocumentElementClick } from '../../../hooks/useDocumentElementClick.ts';

import { HeaderLayoutAttributeContext } from './context/attribute.ts';

import { HeaderLayoutEmphasis, HeaderLayoutSignificance } from './HeaderLayout.tsx';

export type HeaderLayoutProfileButtonSignificance = HeaderLayoutSignificance;
export type HeaderLayoutProfileButtonEmphasis = HeaderLayoutEmphasis;

const configuration = {
  container: {
    style: {
      significance: {
        100: 'relative'
      },
      emphasis: {
        100: 'ml-auto'
      }
    },
    button: {
      style: {
        significance: {
          100: 'transition active:scale-90'
        },
        emphasis: {
          100: 'size-full px-6'
        }
      }
    },
    picture: {
      style: {
        significance: {
          100: 'rounded-full'
        },
        emphasis: {
          100: 'size-10'
        }
      },
      alt: 'Profile picture'
    },
    frame: {
      style: {
        state: {
          true: 'sign-out-button absolute -bottom-1/4 z-10',
          false: 'sign-out-button absolute hidden'
        }
      },
      selection: {
        entry: {
          style: {
            significance: {
              100: 'bg-white rounded-2xl shadow-md hover:bg-neutral-100'
            },
            emphasis: {
              100: 'py-3 pl-3 pr-16 ml-[-75px] font-medium'
            }
          }
        }
      }
    }
  }
};

export type HeaderLayoutProfileButtonAttributes = {
  significance: HeaderLayoutProfileButtonSignificance
  emphasis: HeaderLayoutProfileButtonEmphasis
};

export type HeaderLayoutProfileButtonProps = HeaderLayoutProfileButtonAttributes & React.ComponentProps<'div'>;
export type HeaderLayoutProfileButtonElement = ReactDOMComponentPropsElement<HeaderLayoutProfileButtonProps>;

export const HeaderLayoutProfileButton = React.forwardRef(
  function HeaderLayoutProfileButton({ significance, emphasis, className, ...props }: HeaderLayoutProfileButtonProps, ref?: React.ForwardedRef<HeaderLayoutProfileButtonElement>) {
    const context = useContext(HeaderLayoutAttributeContext);
    if (context) {
      significance = significance || context.significance;
      emphasis = emphasis || context.emphasis;
    }

    const buttonRef = useRef<HeaderLayoutProfileButtonElement>(null);
    useImperativeHandle(ref, () => buttonRef.current!, [buttonRef.current]);

    const [toggle, setToggle] = useState(false);

    const user = useSelector((state: RootState) => state.user);

    useDocumentElementClick(buttonRef, (focused) => {
      if (!focused) {
        setToggle(false);
      }
    });

    return (
      <div
        className={compileStyle(
          configuration.container.style.significance[significance],
          configuration.container.style.emphasis[emphasis],
          className
        )}
        ref={buttonRef}

        {...props}
      >
        <button
          type="button"
          className={compileStyle(
            configuration.container.button.style.significance[significance],
            configuration.container.button.style.emphasis[emphasis]
          )}
          onClick={() => setToggle(!toggle)}
        >
          <img
            src={user.profileBase64}
            alt={configuration.container.picture.alt}
            className={compileStyle(
              configuration.container.picture.style.significance[significance],
              configuration.container.picture.style.emphasis[emphasis],
              'object-cover'
            )}
          />
        </button>
        <div className={toggle ? configuration.container.frame.style.state.true : configuration.container.frame.style.state.false}>
          <Link
            to={AppRoutes.LOG_OUT}
            className={compileStyle(
              configuration.container.frame.selection.entry.style.significance[significance],
              configuration.container.frame.selection.entry.style.emphasis[emphasis]
            )}
          >
            Sign out
          </Link>
        </div>
      </div>
    );
  }
);
