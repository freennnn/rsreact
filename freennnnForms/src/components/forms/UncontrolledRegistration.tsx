import { ChangeEvent, type FormEvent, useRef, useState } from 'react'

import { v4 as uuidv4 } from 'uuid'

import { selectCountryNames } from '../../data/countriesSlice'
import { convertImageToBase64 } from '../../data/imageUtils'
import { useAppDispatch, useAppSelector } from '../../data/store'
import { addUser } from '../../data/usersSlice'
import { createFormSchema } from '../../data/zodFormSchema'
import { CountryAutocomplete } from '../CountryAutocomplete/CountryAutocomplete'
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
      <div className='form-field'>
        <label htmlFor='uncontrolled-name' className='field-label'>
          Name:
        </label>
        <input
          id='uncontrolled-name'
          name='name'
          type='text'
          placeholder='Name'
          autoComplete='one-time-code'
        />
        <div className='error-div text-red-500'>{errors.name}</div>
      </div>

      <div className='form-field'>
        <label htmlFor='uncontrolled-age' className='field-label'>
          Age:
        </label>
        <input
          id='uncontrolled-age'
          name='age'
          type='text'
          placeholder='Age'
          autoComplete='one-time-code'
        />
        <div className='error-div text-red-500'>{errors.age}</div>
      </div>

      <div className='form-field'>
        <label htmlFor='uncontrolled-email' className='field-label'>
          Email:
        </label>
        <input id='uncontrolled-email' name='email' type='text' placeholder='Email' />
        <div className='error-div text-red-500'>{errors.email}</div>
      </div>

      <div className='form-field'>
        <label htmlFor='uncontrolled-password' className='field-label'>
          Password:
        </label>
        <input
          id='uncontrolled-password'
          name='password'
          type='password'
          placeholder='Password'
          onChange={handlePasswordChange}
        />
        <div className='error-div text-red-500'>{errors.password}</div>
        <PasswordStrength password={password} />
      </div>

      <div className='form-field'>
        <label htmlFor='uncontrolled-confirm-password' className='field-label'>
          Confirm Password:
        </label>
        <input
          id='uncontrolled-confirm-password'
          name='confirmPassword'
          type='password'
          placeholder='Confirm Password'
        />
        <div className='error-div text-red-500'>{errors.confirmPassword}</div>
      </div>

      <fieldset className='gender-fieldset'>
        <legend>Gender:</legend>
        <div className='gender-options'>
          <div className='radio-option'>
            <input name='gender' type='radio' id='uncontrolled-male' value='male' />
            <label htmlFor='uncontrolled-male'>Male</label>
          </div>
          <div className='radio-option'>
            <input name='gender' type='radio' id='uncontrolled-female' value='female' />
            <label htmlFor='uncontrolled-female'>Female</label>
          </div>
        </div>
        <div className='error-div text-red-500'>{errors.gender}</div>
      </fieldset>

      <div className='form-field'>
        <div className='checkbox-field'>
          <input id='uncontrolled-terms' name='termsAndContions' type='checkbox' />
          <label htmlFor='uncontrolled-terms'>Accept terms and conditions</label>
        </div>
        <div className='error-div text-red-500'>{errors.termsAndContions}</div>
      </div>

      <div className='form-field'>
        <label htmlFor='uncontrolled-avatar' className='field-label'>
          Avatar:
        </label>
        <input id='uncontrolled-avatar' name='avatar' type='file' accept='image/png,image/jpeg' />
        <div className='error-div text-red-500'>{errors.avatar}</div>
      </div>

      <div className='form-field'>
        <label htmlFor='uncontrolled-country' className='field-label'>
          Country:
        </label>
        <CountryAutocomplete id='uncontrolled-country' name='country' countries={countryNames} />
        <div className='error-div text-red-500'>{errors.country}</div>
      </div>

      <button type='submit'>Submit</button>
    </form>
  )
}
