export const MIN_PASSWORD_LENGTH = 8

export interface PasswordCriterion {
  id: string
  label: string
  met: boolean
}

function hasNumber(password: string): boolean {
  for (const character of password) {
    if (character >= '0' && character <= '9') {
      return true
    }
  }
  return false
}

function hasUppercase(password: string): boolean {
  for (const character of password) {
    if (character >= 'A' && character <= 'Z') {
      return true
    }
  }
  return false
}

function hasLowercase(password: string): boolean {
  for (const character of password) {
    if (character >= 'a' && character <= 'z') {
      return true
    }
  }
  return false
}

function hasSpecialCharacter(password: string): boolean {
  const specialCharacters = '`!@#$%^&*()_-+={}[];\':"\\|,.<>/?~ '

  for (const character of password) {
    if (specialCharacters.includes(character)) {
      return true
    }
  }
  return false
}

export function getPasswordCriteria(password = ''): PasswordCriterion[] {
  return [
    {
      id: 'length',
      label: `At least ${MIN_PASSWORD_LENGTH} characters`,
      met: password.length >= MIN_PASSWORD_LENGTH,
    },
    { id: 'number', label: '1 number', met: hasNumber(password) },
    { id: 'uppercase', label: '1 uppercase letter', met: hasUppercase(password) },
    { id: 'lowercase', label: '1 lowercase letter', met: hasLowercase(password) },
    { id: 'special', label: '1 special character', met: hasSpecialCharacter(password) },
  ]
}
