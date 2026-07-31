import { ConfigEnv } from '@config/configEnv'
import { GLOBAL_VARIABLES } from '@config/constants/globalVariables'
import { BookTypeEnum } from '@config/enums/BookTypeEnum'
import { ReactElement } from 'react'
import CalculateIcon from '@mui/icons-material/Calculate'
import ScienceIcon from '@mui/icons-material/Science'
import { HistoryEdu, Language, MenuBook, School } from '@mui/icons-material'
import AbcIcon from '@mui/icons-material/Abc'
import { StatusEnum } from '@config/enums/status.enum'

export const toSnakeCase = (str: string): string => {
  let result = GLOBAL_VARIABLES.EMPTY_STRING

  for (let i = 0; i < str.length; i++) {
    const character = str[i]
    if (character === GLOBAL_VARIABLES.SINGLE_SPACE) {
      result += GLOBAL_VARIABLES.EMPTY_STRING
    } else if (character === character.toUpperCase()) {
      if (i !== 0) {
        result += '_'
      }
      result += character.toLowerCase()
    } else {
      result += character
    }
  }
  return result
}

export const ToCamelCase = (str: string): string => {
  let result = GLOBAL_VARIABLES.EMPTY_STRING
  let nextIsUpper = false

  for (let i = 0; i < str.length; i++) {
    const character = str[i]
    if (character === '_') {
      nextIsUpper = true
    } else if (nextIsUpper) {
      result += character.toUpperCase()
      nextIsUpper = false
    } else {
      result += character
    }
  }
  return result
}

export const generatePictureSrc = (filePath?: string): string => {
  if (!filePath) return GLOBAL_VARIABLES.EMPTY_STRING
  return `${ConfigEnv.MEDIA_BASE_URL}/${filePath}`
}

export const encodeVideoSrc = (filePath: string | undefined): string => {
  if (!filePath) return GLOBAL_VARIABLES.EMPTY_STRING
  const safeFilePath = filePath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  return `https://videos-abajim-1.s3.de.io.cloud.ovh.net/${safeFilePath}`
}

export const encodePageString = (page: string): string => {
  return page.replace(/page-(\d+)/, '$1')
}

export const getBookProgressColor = (progress: number): string => {
  if (progress >= 90) {
    return GLOBAL_VARIABLES.BOOKS_PROGRESS_COLORS.MORE_THAN_90
  } else if (progress >= 80) {
    return GLOBAL_VARIABLES.BOOKS_PROGRESS_COLORS.MORE_THAN_80
  } else if (progress >= 50) {
    return GLOBAL_VARIABLES.BOOKS_PROGRESS_COLORS.MORE_THAN_50
  } else if (progress >= 30) {
    return GLOBAL_VARIABLES.BOOKS_PROGRESS_COLORS.MORE_THAN_30
  } else if (progress >= 20) {
    return GLOBAL_VARIABLES.BOOKS_PROGRESS_COLORS.MORE_THAN_20
  } else if (progress >= 10) {
    return GLOBAL_VARIABLES.BOOKS_PROGRESS_COLORS.MORE_THAN_10
  } else {
    return GLOBAL_VARIABLES.BOOKS_PROGRESS_COLORS.MORE_THAN_10
  }
}

export const getBookTypeLabel = (type: number): string => {
  switch (type) {
    case BookTypeEnum.MANUAL:
      return 'book.manual'
    case BookTypeEnum.CONCOURSE:
      return 'book.concours'
    default:
      return GLOBAL_VARIABLES.EMPTY_STRING
  }
}

export const getBookStatusLabel = (isValid: boolean | undefined): string => {
  return isValid ? 'common.validated' : 'common.invalidated'
}

export const returnBookStatusChipColor = (
  isValid: boolean | undefined,
): 'success' | 'error' => {
  return isValid ? 'success' : 'error'
}

export const getBookLanguageLabel = (language: string | undefined): string => {
  switch (language) {
    case 'ar':
      return 'common.arabic'
    case 'fr':
      return 'common.french'
    case 'en':
      return 'common.english'
    default:
      return GLOBAL_VARIABLES.EMPTY_STRING
  }
}

export function getLevelStyle(level: string): {
  backgroundColor: string
  color: string
  borderColor: string
} {
  const styles: Record<
    string,
    { backgroundColor: string; color: string; borderColor: string }
  > = {
    year_1: {
      backgroundColor: '#FDE2E4',
      color: '#C9184A',
      borderColor: '#C9184A',
    },
    year_2: {
      backgroundColor: '#E2F0CB',
      color: '#4CAF50',
      borderColor: '#4CAF50',
    },
    year_3: {
      backgroundColor: '#D0E8F2',
      color: '#1976D2',
      borderColor: '#1976D2',
    },
    year_4: {
      backgroundColor: '#FFF1C1',
      color: '#F9A825',
      borderColor: '#F9A825',
    },
    year_5: {
      backgroundColor: '#E8DFF5',
      color: '#7E57C2',
      borderColor: '#7E57C2',
    },
    year_6: {
      backgroundColor: '#FEE4CB',
      color: '#FB8C00',
      borderColor: '#FB8C00',
    },
  }

  return (
    styles[level] ?? {
      backgroundColor: '#F5F5F5',
      color: '#666',
    }
  )
}

export function getMaterialIcon(material: string): ReactElement {
  const map: Record<string, ReactElement> = {
    mat_math: <CalculateIcon fontSize="small" />,
    mat_science: <ScienceIcon fontSize="small" />,
    mat_arabic: <Language fontSize="small" />,
    mat_french: <MenuBook fontSize="small" />,
    mat_english: <AbcIcon fontSize="small" />,
    mat_social: <HistoryEdu fontSize="small" />,
  }

  return map[material] ?? <School fontSize="small" />
}

export const formatPermissionLabel = (permission: string): string => {
  let p = permission.replace(/^can_/, '')

  const parts = p.split('.')
  if (parts.length >= 2) {
    const action = parts.pop()!
    p = [action, ...parts].join(' ')
  }

  p = p.replace(/_/g, ' ')

  p = p.replace(/\s+/g, ' ').trim()

  return p.replace(/\b\w/g, (c) => c.toUpperCase())
}

export const formatDiscountToInt = (discount: number): string => {
  return Math.round(discount) + ' %'
}

export const formatStatus = (status: StatusEnum): string => {
  return status === StatusEnum.ACTIVE ? 'plan.active' : 'plan.inactive'
}
export const calculateDiscountedPrice = (price: number, discount: number) => {
  return price - (price * discount) / 100
}

export const getMaterialColor = (materialName: string) => {
  return GLOBAL_VARIABLES.MATERIAL_COLORS[materialName]
}
export const getMaterialSelectedColor = (materialName: string) => {
  return GLOBAL_VARIABLES.MATERIAL_SELECTED_COLOR[materialName]
}

export const translateMaterialName = (materialName: string) => {
  return `material.${materialName}`
}

export const translateLevelName = (levelName: string) => {
  return `level.${levelName}`
}