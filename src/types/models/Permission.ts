export interface Permission {
  id: number
  name: string
}

export interface PermissionModule {
  module: string
  permissions: Permission[]
}

export const getModuleFromName = (name: string) =>
  name.split(/[.\-]/)[0] || 'misc'
