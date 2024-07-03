import React from 'react';
import { Link, LinkProps, NavLink, NavLinkProps, Outlet } from 'react-router-dom';

import { compileStyle } from '../../../utilities/style.ts';

import { AppRoutes } from '../../../routes';

import { Icon } from '../../icon/Icon.tsx';

export type ActionLayoutProps = React.ComponentProps<'header'>;

function ActionLayout({ className, children }: ActionLayoutProps) {
  return (
    <>
      <div className={compileStyle(
        'fixed top-0 left-0 z-30 min-w-18 h-full bg-white border-r border-gray-300',
        className
      )}
      >
        {children}
      </div>
      <div className="flex flex-col min-h-screen ml-18 overflow-auto">
        <Outlet />
      </div>
    </>
  );
}

export type ActionLayoutHomeButtonProps = {
  route: AppRoutes
} & Omit<LinkProps, 'to'>;

function ActionLayoutHomeRouteButton({ route, className, ...props }: ActionLayoutHomeButtonProps) {
  return (
    <div className={compileStyle('h-18', className)}>
      <Link
        to={route}
        className="block w-full py-4 transition duration-100 active:scale-90 active:after:absolute active:after:size-full active:after:top-0 active:after:left-0 active:after:scale-125"

        {...props}
      >
        <Icon type="logo" className="size-8 m-auto" />
      </Link>
    </div>
  );
}

ActionLayout.Home = {
  Route: {
    Button: ActionLayoutHomeRouteButton
  }
};

export type ActionLayoutActionProps = React.ComponentProps<'nav'>;

function ActionLayoutTray({ className, ...props }: ActionLayoutActionProps) {
  return <nav className={compileStyle('my-5', className)} {...props} />;
}

export type ActionLayoutActionRouteButtonProps = {
  route: AppRoutes

  icon: Icon
  label: string
} & Omit<NavLinkProps, 'to' | 'children'>;

function ActionLayoutTrayRouteButton({ route, icon, label, className, ...props }: ActionLayoutActionRouteButtonProps) {
  const style = 'relative block w-full py-3 group transition duration-100 hover:text-blue-400 active:scale-90 active:after:absolute active:after:size-full active:after:top-0 active:after:left-0 active:after:scale-125 text-xs text-center font-medium';
  const activeStyle = 'active text-blue-400';

  return (
    <NavLink
      to={route}

      className={
        typeof className === 'function'
          ? props => compileStyle(style, props.isActive ? activeStyle : undefined, className(props))
          : props => compileStyle(style, props.isActive ? activeStyle : undefined)
      }
      {...props}
    >
      <Icon type={icon} className="block size-9 p-1.5 mb-1 m-auto rounded-xl fill-current group-[.active]:bg-blue-200 group-[.active]:text-blue-400" />
      {label}
    </NavLink>
  );
}

ActionLayoutTray.Route = {
  Button: ActionLayoutTrayRouteButton
};

ActionLayout.Tray = ActionLayoutTray;

export { ActionLayout };
