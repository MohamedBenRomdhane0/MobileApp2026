import { Theme } from '@mui/material'

import avatar from './avatar'
import button from './button'
import divider from './divider'
import menu from './menu'
import textField from './textField'
import tooltip from './tooltip'
import { dialogTitle } from './dialogTitle'

export default function overridesMUIComponents(theme: Theme) {
  const components = Object.assign({
    MuiButton: button(),
    MuiOutlinedInput: textField(theme),
    MuiTooltip: tooltip(theme),
    MuiDivider: divider(theme),
    MuiAvatar: avatar(),
    MuiMenu: menu(theme),
    MuiDialogTitle: dialogTitle(theme),
  })

  return components
}
