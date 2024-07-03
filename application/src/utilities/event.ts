import { EventHandler, SyntheticEvent } from 'react';

export function chainReactEventHandlers<THandler extends EventHandler<SyntheticEvent<unknown>>>(handler1?: THandler, handler2?: THandler) {
  if (!handler1) {
    return handler2;
  }
  if (handler2) {
    return ((event: SyntheticEvent<unknown>) => {
      handler1(event);
      handler2(event);
    }) as THandler;
  }
  return handler1;
}
