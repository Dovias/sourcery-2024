import React from 'react';

import logo from '/logo.svg';

export type Icon =
  | 'building'
  | 'tailed-arrow-cycle'
  | 'tailed-arrow-up'
  | 'tailless-arrow-down'
  | 'tailless-arrow-right'
  | 'arrow-cycle'
  | 'bed-double'
  | 'bed-single'
  | 'calendar-marked'
  | 'calendar-unmarked'
  | 'camera'
  | 'cross'
  | 'door'
  | 'garbage-can'
  | 'gear'
  | 'logo'
  | 'magnifier'
  | 'people'
  | 'person'
  | 'person-inverted'
  | 'plus'
  | 'google'
  | 'lines'
  | 'marker'
  | 'broken';

export type IconProps<TIcon extends Icon> = {
  type: TIcon
} & (
  Omit<
    TIcon extends 'logo'
      ? React.ComponentProps<'img'>
      : React.ComponentProps<'svg'>,
  'children' | 'src'>
);

export function Icon<TIcon extends Icon>({ type, ...props }: IconProps<TIcon>) {
  /*
     We would love to load logo from icons.svg sprite map, but
     Chromium browsers are buggy, and they don't allow using references
     outside svg file, so linear gradients do not render properly
     when being referenced inside DOM.
     (More info: https://issues.chromium.org/issues/41337331)
  */
  if (type === 'logo') {
    const { alt = 'logo', ...iconProps } = props as Omit<IconProps<'logo'>, 'type'>;
    return <img src={logo} alt={alt} {...iconProps} />;
  }

  return (
    <svg {...props as Omit<IconProps<Exclude<Icon, 'logo'>>, 'type'>}>
      <use href={`/icons.svg#${type}`}></use>
    </svg>
  );
}
