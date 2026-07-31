export const formatDateTime = (
  isoDateString: string | undefined | null,
): string => {
  if (!isoDateString) return ''

  const date = new Date(isoDateString)

  if (isNaN(date.getTime())) return ''

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }

  return date.toLocaleDateString('en-US', options)
}

export const formatDate = (
  isoDateString: string | undefined | null,
): string => {
  if (!isoDateString) return ''

  const date = new Date(isoDateString)

  if (isNaN(date.getTime())) return ''

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }

  return date.toLocaleDateString('en-US', options)
}
