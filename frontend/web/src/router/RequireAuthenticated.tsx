import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  getStoredAccessToken,
  getStoredAuthUser,
} from "../module/auth/api/authApi";

function RequireAuthenticated() {
  const location = useLocation();
  const token = getStoredAccessToken();
  const user = getStoredAuthUser();

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <Outlet />;
}

export default RequireAuthenticated;
