import type { AUTH_LINK_VARIANTS } from '../_constants/auth';

export type AuthLinkVariant = keyof typeof AUTH_LINK_VARIANTS;

export type AuthLinkVariantProps = {
  variant: AuthLinkVariant;
};
