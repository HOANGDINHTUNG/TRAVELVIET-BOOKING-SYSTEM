import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import ForbiddenPage from "../../components/error/ForbiddenPage";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  useAuthStore,
  getRoleCodes,
} from "../../stores/authStore";

type RequireRolesProps = {
  /**
   * Danh sách các role được khởi tạo (VD: ["ADMIN", "SUPER_ADMIN"]).
   * User cần có ít nhất một trong các role này để truy cập.
   */
  roles: string[];
  children?: ReactNode;
};

export default function RequireRoles({ roles, children }: RequireRolesProps) {
  const location = useLocation();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const user = useAuthStore(selectCurrentUser);

  if (!isAuthenticated || !user) {
    const from = `${location.pathname}${location.search}`;
    return <Navigate to="/login" replace state={{ from }} />;
  }

  const userRoles = getRoleCodes(user);
  // Nếu list role rỗng, hoặc user có chứa 1 trong các quyền
  const hasAccess =
    roles.length === 0 || roles.some((role) => userRoles.includes(role));

  if (!hasAccess) {
    return (
      <ForbiddenPage reason="Tài khoản của bạn không được cấp quyền truy cập vào phân hệ này." />
    );
  }

  return children ? <>{children}</> : <Outlet />;
}
