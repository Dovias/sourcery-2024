import { useState } from 'react';

export type ToggleStateFunction<TEnabled = true, TDisabled = false> = (state?: TEnabled | TDisabled) => void;

export function useToggleState(): [boolean, ToggleStateFunction];
export function useToggleState<TDisabled>(disabled: TDisabled, enabled?: TDisabled): [TDisabled, ToggleStateFunction<TDisabled, TDisabled>];
export function useToggleState<TDisabled, TEnabled>(disabled: TDisabled, enabled: TEnabled): [TDisabled | TEnabled, ToggleStateFunction<TDisabled, TEnabled>];

export function useToggleState<TDisabled = false, TEnabled = true>(disabled: TDisabled = false as TDisabled, enabled: TEnabled = true as TEnabled) {
  const [state, setState] = useState<TDisabled | TEnabled>(disabled);

  return [state, ((providedState = state) => setState(providedState === disabled ? enabled : disabled))] as const;
}

export function useToggleStateFunction(): ToggleStateFunction;
export function useToggleStateFunction<TDisabled>(disabled: TDisabled, enabled?: TDisabled): ToggleStateFunction<TDisabled, TDisabled>;
export function useToggleStateFunction<TDisabled, TEnabled>(disabled: TDisabled, enabled: TEnabled): ToggleStateFunction<TDisabled, TEnabled>;

export function useToggleStateFunction<TDisabled = false, TEnabled = true>(disabled: TDisabled = false as TDisabled, enabled: TEnabled = true as TEnabled) {
  const [state, setState] = useToggleState(disabled, enabled);

  return (providedState = state) => {
    setState(providedState);
    return state;
  };
}
