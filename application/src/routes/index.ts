import { AppRoutes } from './routes.ts';
import { RouteObject } from 'react-router-dom';

import { authenticationRoutes } from './authentication';
import { contentRoutes } from './content.tsx';
import { actionRoute } from './action.tsx';

const routes: RouteObject[] = [
  ...contentRoutes,
  actionRoute
];

export { AppRoutes, authenticationRoutes, routes };
