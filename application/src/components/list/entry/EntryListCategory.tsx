import React, { useContext } from 'react';
import { compileStyle } from '../../../utilities/style.ts';
import { EntryListEmphasis, EntryListSignificance } from './EntryList.tsx';
import { ReactDOMComponentPropsElement } from '../../../utilities/component.ts';
import { EntryListAttributeContext } from './context/attribute.ts';

export type EntryListCategorySignificance = EntryListSignificance;
export type EntryListCategoryEmphasis = EntryListEmphasis;

export type EntryListCategoryAttributes = {
  name: string
  description?: string

  significance: EntryListCategorySignificance
  emphasis: EntryListCategoryEmphasis
};

const configuration = {
  category: {
    style: {
      significance: {
        200: 'lg:flex',
        300: 'lg:flex',
        100: 'lg:flex'
      },
      emphasis: {
        100: '',
        200: ''
      }
    },
    details: {
      style: {
        significance: {
          100: '',
          200: '',
          300: 'lg:flex-shrink-0'
        },
        emphasis: {
          100: 'px-4',
          200: 'mr-3 max-lg:my-4 basis-20'
        }
      },
      name: {
        style: {
          significance: {
            100: '',
            200: '',
            300: ''
          },
          emphasis: {
            100: 'leading-8 text-xl',
            200: 'leading-8 text-xl'
          }
        }
      },
      description: {
        style: {
          significance: {
            100: 'text-gray-500',
            200: 'text-gray-500',
            300: 'text-gray-500'
          },
          emphasis: {
            100: 'leading-6 text-lg',
            200: 'leading-6 text-lg'
          }
        }
      }
    },
    entries: {
      style: {
        significance: {
          100: 'flex-1',
          200: 'flex-1',
          300: 'flex-1'
        },
        emphasis: {
          100: '',
          200: ''
        }
      }
    }
  }
} as const;

export type EntryListCategoryProps = EntryListCategoryAttributes & React.ComponentProps<'ul'>;
export type EntryListCategoryElement = ReactDOMComponentPropsElement<EntryListCategoryProps>;

export const EntryListCategory = React.forwardRef(
  function EntryListCategory({ name, description, significance, emphasis, children, className, ...props }: EntryListCategoryProps, ref?: React.ForwardedRef<EntryListCategoryElement>) {
    const context = useContext(EntryListAttributeContext);
    if (context) {
      significance = significance || context.significance;
      emphasis = emphasis || context.emphasis;
    }

    return (
      <ul
        className={compileStyle(
          configuration.category.style.significance[significance],
          configuration.category.style.emphasis[emphasis],
          className
        )}
        ref={ref}
        {...props}
      >
        <ul className={compileStyle(
          configuration.category.details.style.significance[significance],
          configuration.category.details.style.emphasis[emphasis]
        )}
        >
          <p className={compileStyle(
            configuration.category.details.name.style.significance[significance],
            configuration.category.details.name.style.emphasis[emphasis]
          )}
          >
            {name}
          </p>
          <p className={compileStyle(
            configuration.category.details.description.style.significance[significance],
            configuration.category.details.description.style.emphasis[emphasis]
          )}
          >
            {description}
          </p>
        </ul>
        <ul className={compileStyle(
          configuration.category.entries.style.significance[significance],
          configuration.category.entries.style.emphasis[emphasis]
        )}
        >
          {children}
        </ul>
      </ul>
    );
  }
);
