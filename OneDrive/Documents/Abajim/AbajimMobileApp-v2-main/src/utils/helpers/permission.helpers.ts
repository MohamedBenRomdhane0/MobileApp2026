export const checkPermission = (
  userPermissions: string[] | undefined,
  requiredPermission: string | string[] | undefined,
  userRoles?: string[],
): boolean => {
  if (!requiredPermission) return true

  const isAdmin = userRoles?.includes('admin')
  if (isAdmin) return true

  if (!userPermissions || userPermissions.length === 0) return false

  if (Array.isArray(requiredPermission)) {
    return requiredPermission.some((p) => userPermissions.includes(p))
  }

  return userPermissions.includes(requiredPermission)
}

export const checkRole = (
  userRoles: string[] | undefined,
  userRole: string | undefined,
  requiredRole: string | string[] | undefined,
): boolean => {
  if (!requiredRole) return true
  if (!userRoles && !userRole) return false

  if (Array.isArray(requiredRole)) {
    return requiredRole.some((r) => userRoles?.includes(r) || userRole === r)
  }

  return userRoles?.includes(requiredRole) || userRole === requiredRole || false
}
