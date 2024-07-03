import React from 'react';

export type ReactComponentPropsWithoutRef<TElement extends keyof React.JSX.IntrinsicElements> = Omit<React.ComponentProps<TElement>, 'ref'>;
export type ReactDOMComponentPropsElement<TProps extends React.HTMLAttributes<unknown>> = TProps extends React.DOMAttributes<infer TElement> ? TElement : never;

export function createEmptyReactContext<TType>() {
  return React.createContext<TType | null>(null) as React.Context<TType>;
}
