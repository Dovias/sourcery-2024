import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ReactDOMComponentPropsElement } from '../../../utilities/component.ts';
import { compileStyle } from '../../../utilities/style.ts';

import { setText } from '../../../store/reducers/searchBarTextReducer.ts';

import { HeaderLayoutAttributeContext } from './context/attribute.ts';

import { HeaderLayoutEmphasis, HeaderLayoutSignificance } from './HeaderLayout.tsx';
import { Icon } from '../../icon/Icon.tsx';
import { chainReactEventHandlers } from '../../../utilities/event.ts';

export type HeaderLayoutSearchFieldSignificance = HeaderLayoutSignificance;
export type HeaderLayoutSearchFieldEmphasis = HeaderLayoutEmphasis;

const configuration = {
  container: {
    style: {
      significance: {
        100: 'flex flex-1 pl-6'
      },
      emphasis: {
        100: ''
      }
    },
    icon: {
      type: 'magnifier',
      style: {
        significance: {
          100: 'self-center fill-gray-400'
        },
        emphasis: {
          100: 'size-6 ml-16 mr-2'
        }
      }
    },
    input: {
      limit: {
        symbols: 50
      },
      default: {
        placeholder: 'Search for anything...'
      },
      style: {
        significance: {
          100: 'flex-1 text-gray-400 outline-0'
        },
        emphasis: {
          100: ''
        }
      }
    }

  }

} as const;

export type HeaderLayoutSearchFieldAttributes = {
  significance: HeaderLayoutSearchFieldSignificance
  emphasis: HeaderLayoutSearchFieldEmphasis
};

export type HeaderLayoutSearchFieldProps = HeaderLayoutSearchFieldAttributes
  & Omit<React.ComponentProps<'input'>, 'className'> & Pick<React.ComponentProps<'label'>, 'className'>;

export type HeaderLayoutSearchFieldElement = ReactDOMComponentPropsElement<HeaderLayoutSearchFieldProps>;

export const HeaderLayoutSearchField = React.forwardRef(
  function HeaderLayoutSearchField({ significance, emphasis, placeholder, className, onChange, ...props }: HeaderLayoutSearchFieldProps, ref?: React.ForwardedRef<HeaderLayoutSearchFieldElement>) {
    const context = useContext(HeaderLayoutAttributeContext);
    if (context) {
      significance = significance || context.significance;
      emphasis = emphasis || context.emphasis;
    }

    const dispatch = useDispatch();
    const setInputValue = useState('')[1];

    useEffect(() => {
      dispatch(setText(''));
    }, []);

    return (
      <label className={compileStyle(
        configuration.container.style.significance[significance],
        configuration.container.style.emphasis[emphasis],
        className
      )}
      >
        <Icon
          type={configuration.container.icon.type}
          className={compileStyle(
            configuration.container.icon.style.significance[significance],
            configuration.container.icon.style.emphasis[emphasis]
          )}
        />
        <input
          type="search"
          placeholder={placeholder || configuration.container.input.default.placeholder}

          className={compileStyle(
            configuration.container.input.style.significance[significance],
            configuration.container.input.style.emphasis[emphasis]
          )}
          onChange={chainReactEventHandlers((event) => {
            const value = event.target.value.replace(/[;#%\/\\|\[\]]/g, '').slice(0, 50);
            setInputValue(value);
            dispatch(setText(value));
          }, onChange)}
          ref={ref}

          {...props}
        />
      </label>
    );
  }
);
