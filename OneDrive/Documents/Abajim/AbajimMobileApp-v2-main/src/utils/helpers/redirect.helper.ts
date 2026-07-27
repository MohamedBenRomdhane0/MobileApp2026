import { NavigateFunction } from 'react-router-dom'
import { PATHS } from '@config/constants/paths'
import { UserRoleEnum } from '@config/enums/role.enum'
import { User } from 'types/models/User'

export const getUserPrimaryRole = (user: User | null): UserRoleEnum => {
  if (user?.rolesData) {
    const roles = Array.isArray(user.rolesData.roles)
      ? (user.rolesData.roles as any[])
          .map((r) => (typeof r === 'string' ? r : r?.name))
          .filter(Boolean)
      : []

    if (roles.includes(UserRoleEnum.TEACHER)) {
      return UserRoleEnum.TEACHER
    }

    if (roles.includes(UserRoleEnum.ADMIN)) {
      return UserRoleEnum.ADMIN
    }

    if (roles.includes(UserRoleEnum.PARENT)) {
      return UserRoleEnum.PARENT
    }

    if (roles.includes(UserRoleEnum.CHILD)) {
      return UserRoleEnum.CHILD
    }

    if (roles.includes(UserRoleEnum.STAFF)) {
      return UserRoleEnum.STAFF
    }
  }

  return UserRoleEnum.PARENT
}

export const redirectAfterLogin = (user: User, navigate: NavigateFunction) => {
  const role = getUserPrimaryRole(user)

  redirectBasedOnRole(role, navigate)
}

export const redirectBasedOnRole = (
  role: UserRoleEnum,
  navigate: NavigateFunction,
) => {
  switch (role) {
    case UserRoleEnum.ADMIN:
      navigate(PATHS.DASHBOARD.ADMIN.ROOT)
      break
    case UserRoleEnum.TEACHER:
      navigate(PATHS.DASHBOARD.TEACHER.ROOT)
      break
    case UserRoleEnum.PARENT:
      navigate(PATHS.DASHBOARD.PARENT.ROOT)
      break
    default:
      navigate(PATHS.ROOT)
      break
  }
}

export const redirectToLogin = (
  isAdmin: boolean = false,
  navigate?: NavigateFunction,
) => {
  const loginPath = isAdmin ? PATHS.ADMIN_AUTH.LOGIN : PATHS.AUTH.LOGIN
  if (navigate) {
    navigate(loginPath)
  }
  return loginPath
}

export const redirectToDashboard = (
  role: UserRoleEnum,
  navigate?: NavigateFunction,
) => {
  let dashboardPath: string

  switch (role) {
    case UserRoleEnum.ADMIN:
      dashboardPath = PATHS.DASHBOARD.ADMIN.ROOT
      break
    case UserRoleEnum.TEACHER:
      dashboardPath = PATHS.DASHBOARD.TEACHER.ROOT
      break
    case UserRoleEnum.PARENT:
      dashboardPath = PATHS.DASHBOARD.PARENT.ROOT
      break
    default:
      dashboardPath = PATHS.ROOT
      break
  }

  if (navigate) {
    navigate(dashboardPath)
  }
  return dashboardPath
}

export const redirectToProfile = (
  role: UserRoleEnum,
  navigate?: NavigateFunction,
) => {
  if (role === UserRoleEnum.TEACHER || role === UserRoleEnum.ADMIN) {
    if (navigate) {
      navigate(PATHS.DASHBOARD.PROFILE.ROOT)
    }
    return PATHS.DASHBOARD.PROFILE.ROOT
  }

  return redirectToDashboard(role, navigate)
}
