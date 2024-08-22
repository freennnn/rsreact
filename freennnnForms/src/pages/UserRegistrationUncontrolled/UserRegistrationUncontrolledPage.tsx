import { ChangeEvent, type FormEvent, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { v4 as uuidv4 } from 'uuid'

import { PasswordStrength } from '../../components/PasswordStrength'
import { countryNames } from '../../data/countries'
import { convertImageToBase64 } from '../../data/imageUtils'
import { useAppDispatch } from '../../data/store'
import { addUser } from '../../data/usersSlice'
import { schema } from '../../data/zodFormSchema'
import '../UserRegistrationFormPage.css'

type FormErrors = Record<string, string>

export default function UserRegistrationUncontrolledFormPage() {
  const [errors, setErrors] = useState<FormErrors>({})
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  //tehcnically don't event need ref, since we using state to update strength onChange
  const passwordRef = useRef(null)

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const form = new FormData(event.currentTarget as HTMLFormElement)
    console.log(form)

    const formData: Record<string, unknown> = Object.fromEntries(form.entries())
    console.log(formData)
    const avatar = form.get('avatar')
    formData.termsAndContions = form.get('termsAndContions')?.toString() === 'on' ? true : false

    const parsed = schema.safeParse(formData)
    if (parsed.success) {
      if (avatar instanceof File) {
        formData.avatarImage = await convertImageToBase64(avatar)
      }
      formData.id = uuidv4()

      dispatch(addUser(formData))
      navigate('/')
    } else {
      const errorsData: FormErrors = {}

      const fieldErrors = parsed.error.flatten().fieldErrors
      for (const [key, value] of Object.entries(fieldErrors)) {
        console.log(`${key}: ${value}`)
        // we will display only first error, even if there are few
        errorsData[key] = value[0]
      }
      setErrors(errorsData)
    }
  }

  return (
    <div>
      <p>UserRegistrationUncontrolledFormPage</p>
      <Link to='/'> Back to user list</Link>
      <form className='form gap-x-3' onSubmit={handleSubmit} autoComplete='one-time-code'>
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
            ref={passwordRef}
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
          <input name='gender' type='radio' id='male' value='male' />
          <label htmlFor='male'>Male</label>
          <input name='gender' type='radio' id='female' value='female' />
          <label htmlFor='female'>Female</label>
        </div>
        <div className='error-div text-red-500'>{errors.gender}</div>

        <label className='form-label' key='termsAndConditions'>
          {'Accept terms and conditions: '}
          <input
            name='termsAndContions'
            type='checkbox'
            placeholder='Agree to terms and conditions'
          />
        </label>
        <div className='error-div text-red-500'>{errors.termsAndContions}</div>

        <label className='form-label' key='Avatar'>
          {'Avatar: '}
          <input name='avatar' type='file' placeholder='Select and upload an avatar' />
        </label>
        <div className='error-div text-red-500'>{errors.avatar}</div>

        <label className='form-label' key='country'>
          {'Contry: '}
          <input
            name='country'
            type='text'
            list='countries'
            placeholder='Country'
            autoComplete='one-time-code'
          />
          <datalist id='countries'>
            {countryNames.map((name) => {
              return <option key={name} value={name} />
            })}
          </datalist>
        </label>
        <div className='error-div text-red-500'>{errors.country}</div>

        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}
