export function isValidEmail(value: string): boolean {
  const parts = value.split('@')

  if (parts.length !== 2) {
    return false
  }

  const [localPart, domain] = parts

  if (!localPart || !domain) {
    return false
  }

  return domain.includes('.')
}
