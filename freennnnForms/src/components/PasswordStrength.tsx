import './PasswordStrength.css'

interface PasswordStrengthProps {
  password?: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  let strength = 0
  if (password) {
    if (password.length > 2) {
      strength += 25
    }
    if (password.length > 4) {
      strength += 25
    }
    if (/[0-9]/.test(password)) {
      strength += 25
    }
    if (/[A-Z]/.test(password)) {
      strength += 25
    }
  }

  return (
    <div className='password-strength'>
      <label>strength:</label>
      <progress max='100' value={strength}>
        {strength} % out of {100}
      </progress>
    </div>
  )
}
