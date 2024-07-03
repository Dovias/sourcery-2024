import { isStringBlank } from './string.ts';

export type StyleKey = string | number | symbol;

export type StyleData = string;
export type Style = string;

export type Stylesheet<K extends StyleKey, V extends StyleData[] | StateStylesheet<StyleKey>> = {
  [key in K]?: V
};

export type StateStylesheet<K extends StyleKey> = {
  base: StyleData[]
  state?: KeyStylesheet<K>
};

export type KeyStylesheet<K extends StyleKey> = Stylesheet<K, StyleData[]>;
export type KeyStateStylesheet<K extends StyleKey, V extends StyleKey> = Stylesheet<K, StateStylesheet<V>>;

export function getStateStyleData<K extends StyleKey>(stylesheet?: StateStylesheet<K>, state?: K): StyleData[] | undefined {
  if (stylesheet === undefined) {
    return undefined;
  }

  const baseStyle = stylesheet.base;
  const stateStyles = stylesheet.state;
  if (stateStyles === undefined) {
    return baseStyle;
  }

  const stateStyle = stateStyles[state!];
  return stateStyle === undefined ? baseStyle : baseStyle.concat(stateStyle);
}

function sanitizeStyleData(...data: (StyleData | undefined)[]): StyleData[] {
  return [...new Set((data.filter(data => data !== undefined && !isStringBlank(data)) as StyleData[]).map(data => data.trim()))];
}

export function compileStyle(...data: (StyleData | undefined | (StyleData | undefined)[])[]): Style | undefined {
  const style = sanitizeStyleData(...data.flat()).join(' ');
  return style.length == 0 ? undefined : style;
}
