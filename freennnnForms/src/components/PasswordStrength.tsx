import { getPasswordCriteria } from '../utils/passwordStrength'
import './PasswordStrength.css'

interface PasswordStrengthProps {
  password?: string
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const criteria = getPasswordCriteria(password)

  return (
    <div className='password-strength' aria-live='polite'>
      <p className='password-strength__title'>Password strength:</p>
      <ul className='password-strength__list'>
        {criteria.map((criterion) => (
          <li
            key={criterion.id}
            className={criterion.met ? 'password-strength__item--met' : 'password-strength__item'}
          >
            {criterion.met ? '✓' : '○'} {criterion.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
