import React from 'react';

import { Style, compileStyle } from '../../../utilities/style.ts';

import { useToggleState } from '../../../hooks/useToggleState.ts';

interface ToggleButtonProps {
  active: boolean
  onToggle: (state: boolean) => void
  className?: Style
  disabled?: boolean
}

export function ToggleButton({ active, onToggle, className, disabled = false }: ToggleButtonProps) {
  const [state, toggleState] = useToggleState(active);
  return (
    <label className={compileStyle(disabled ? ' cursor-not-allowed' : 'cursor-pointer', className)}>
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        checked={state}
        onChange={() => {
          toggleState();
          onToggle(state);
        }}
        disabled={disabled}
      />
      <span className="block relative w-12 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-empty after:absolute after:bg-white after:rounded-full after:size-5.5 after:shadow-[0_2px_1px_0_rgb(0_0_0_/_0.5)] after:shadow-cyan-300/50 after:top-px after:left-px peer-checked:after:left-[3px] after:transition-all peer-checked:bg-blue-400"></span>
    </label>
  );
}
