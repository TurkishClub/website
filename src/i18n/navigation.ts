import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';
// This module sets up navigation for the application using the `next-intl` package.
export const {Link, getPathname, redirect, usePathname, useRouter} =
  createNavigation(routing);
