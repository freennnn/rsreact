import { ChangeEvent, type FormEvent, useRef, useState } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { selectCountryNames } from '../../data/countriesSlice'
import { convertImageToBase64 } from '../../data/imageUtils'
import { useAppDispatch, useAppSelector } from '../../data/store'
import { addUser } from '../../data/usersSlice'
import { createFormSchema } from '../../data/zodFormSchema'
import { PasswordStrength } from '../PasswordStrength'
import './RegistrationForm.css'

type FormErrors = Record<string, string>

interface UncontrolledRegistrationProps {
  onSuccess: () => void
}

export function UncontrolledRegistration({ onSuccess }: UncontrolledRegistrationProps) {
  const [errors, setErrors] = useState<FormErrors>({})
  const [password, setPassword] = useState('')
  const countryNames = useAppSelector(selectCountryNames)
  const dispatch = useAppDispatch()
  const formRef = useRef<HTMLFormElement>(null)

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    const formData: Record<string, unknown> = Object.fromEntries(form.entries())
    const avatar = form.get('avatar')
    formData.termsAndContions = form.get('termsAndContions')?.toString() === 'on'

    const parsed = createFormSchema(countryNames).safeParse(formData)
    if (parsed.success) {
      if (avatar instanceof File) {
        formData.avatarImage = await convertImageToBase64(avatar)
      }
      formData.id = uuidv4()

      dispatch(addUser(formData))
      formRef.current?.reset()
      setErrors({})
      setPassword('')
      onSuccess()
    } else {
      const errorsData: FormErrors = {}
      const fieldErrors = parsed.error.flatten().fieldErrors

      for (const [key, value] of Object.entries(fieldErrors)) {
        errorsData[key] = value[0]
      }
      setErrors(errorsData)
    }
  }

  return (
    <form
      ref={formRef}
      className='form gap-x-3'
      onSubmit={handleSubmit}
      autoComplete='one-time-code'
    >
      <label className='form-label' key='name'>
        {'Name: '}
        <input name='name' type='text' placeholder='Name' autoComplete='one-time-code' />
      </label>
      <div className='error-div text-red-500'>{errors.name}</div>

      <label className='form-label' key='age'>
        {'Age: '}
        <input name='age' type='text' placeholder='Age' autoComplete='one-time-code' />
      </label>
      <div className='error-div text-red-500'>{errors.age}</div>

      <label className='form-label' key='email'>
        {'Email: '}
        <input name='email' type='text' placeholder='Email' />
      </label>
      <div className='error-div text-red-500'>{errors.email}</div>

      <label className='form-label' key='password'>
        {'Password: '}
        <input
          name='password'
          type='password'
          placeholder='Password'
          onChange={handlePasswordChange}
        />
      </label>
      <PasswordStrength password={password} />
      <div className='error-div text-red-500'>{errors.password}</div>

      <label className='form-label' key='confirmPassword'>
        {'Confirm Password: '}
        <input name='confirmPassword' type='password' placeholder='Confirm Password' />
      </label>
      <div className='error-div text-red-500'>{errors.confirmPassword}</div>

      <div className='form-label' key='gender'>
        {'Gender: '}
        <input name='gender' type='radio' id='uncontrolled-male' value='male' />
        <label htmlFor='uncontrolled-male'>Male</label>
        <input name='gender' type='radio' id='uncontrolled-female' value='female' />
        <label htmlFor='uncontrolled-female'>Female</label>
      </div>
      <div className='error-div text-red-500'>{errors.gender}</div>

      <label className='form-label' key='termsAndConditions'>
        {'Accept terms and conditions: '}
        <input name='termsAndContions' type='checkbox' />
      </label>
      <div className='error-div text-red-500'>{errors.termsAndContions}</div>

      <label className='form-label' key='Avatar'>
        {'Avatar: '}
        <input name='avatar' type='file' />
      </label>
      <div className='error-div text-red-500'>{errors.avatar}</div>

      <label className='form-label' key='country'>
        {'Country: '}
        <input
          name='country'
          type='text'
          list='countries-uncontrolled'
          placeholder='Country'
          autoComplete='one-time-code'
        />
        <datalist id='countries-uncontrolled'>
          {countryNames.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </label>
      <div className='error-div text-red-500'>{errors.country}</div>

      <button type='submit'>Submit</button>
    </form>
  )
}
