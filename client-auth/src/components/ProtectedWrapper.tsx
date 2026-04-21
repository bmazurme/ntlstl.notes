import { useIsAuthenticated } from '../hooks/use-is-authenticated';

const ProtectedWrapper = ({
  children,
  requiredRoles = [],
  fallback = null,
  anyRole = false
}: {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallback?: React.ReactNode;
  anyRole?: boolean; }) => {
  const { isAuthenticated } = useIsAuthenticated();
  const userRoles: string[] = [];

  if (!isAuthenticated) {
    return fallback;
  }

  if (requiredRoles.length === 0) {
    return <>{children}</>;
  }

  const hasRequiredRole = anyRole
    ? requiredRoles.some((role) => userRoles.includes(role))
    : requiredRoles.every((role) => userRoles.includes(role));

  return hasRequiredRole ? <>{children}</> : fallback;
};

export default ProtectedWrapper;
