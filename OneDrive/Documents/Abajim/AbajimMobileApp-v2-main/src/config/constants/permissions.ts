export const PERMISSIONS = {
  ROLE_CREATE: 'role.create',
  ROLE_VIEW: 'role.view',
  ROLE_UPDATE: 'role.update',
  ROLE_DELETE: 'role.delete',
  ROLE_ASSIGN_PERMISSIONS: 'role.assign_permissions',
  ROLE_ASSIGN: 'role.assign',

  PERMISSION_VIEW: 'permission.view',

  LEVEL_CREATE: 'level.create',
  LEVEL_VIEW: 'level.view',
  LEVEL_UPDATE: 'level.update',
  LEVEL_DELETE: 'level.delete',

  USER_CREATE: 'user.create',
  USER_VIEW: 'user.view',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  CREATE_CHILD: 'user.create_child',
  DELETE_CHILD: 'user.delete_child',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]
