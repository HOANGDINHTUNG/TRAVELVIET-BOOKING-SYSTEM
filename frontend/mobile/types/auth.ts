export type AuthUser = {
  id: string;
  email?: string;
  fullName?: string;
  displayName?: string;
  role?: string;
  roles?: string[];
};

export type AuthData = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshExpiresIn?: number;
};

export type UserAccessContext = {
  user: AuthUser;
  roles: string[];
  permissions: string[];
  managementRoles: string[];
  hasManagementAccess: boolean;
  isSuperAdmin: boolean;
};
