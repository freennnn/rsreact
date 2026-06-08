import { useMemo } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { v4 as uuidv4 } from 'uuid'

import { selectCountryNames } from '../../data/countriesSlice'
import { convertImageToBase64 } from '../../data/imageUtils'
import { useAppDispatch, useAppSelector } from '../../data/store'
import { addUser } from '../../data/usersSlice'
import { FormFields, createFormSchema } from '../../data/zodFormSchema'
import { PasswordStrength } from '../PasswordStrength'
import './RegistrationForm.css'

interface HookFormRegistrationProps {
  onSuccess: () => void
}

export function HookFormRegistration({ onSuccess }: HookFormRegistrationProps) {
  const countryNames = useAppSelector(selectCountryNames)
  const schema = useMemo(() => createFormSchema(countryNames), [countryNames])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<FormFields>({ resolver: zodResolver(schema) })

  const dispatch = useAppDispatch()
  const password = watch('password')

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (!(data.avatar instanceof File)) {
      return
    }

    const avatarImage = await convertImageToBase64(data.avatar)
    dispatch(addUser({ ...data, avatarImage, id: uuidv4() }))
    reset()
    onSuccess()
  }

  return (
    <form className='form gap-x-3' onSubmit={handleSubmit(onSubmit)} autoComplete='one-time-code'>
      <label className='form-label' key='name'>
        {'Name: '}
        <input {...register('name')} type='text' placeholder='Name' autoComplete='one-time-code' />
      </label>
      <div className='error-div text-red-500'>
        {errors.name?.message ? errors.name?.message : ''}
      </div>

      <label className='form-label' key='age'>
        {'Age: '}
        <input {...register('age')} type='text' placeholder='Age' autoComplete='one-time-code' />
      </label>
      <div className='error-div text-red-500'>{errors.age?.message ? errors.age?.message : ''}</div>

      <label className='form-label' key='email'>
        {'Email: '}
        <input {...register('email')} type='text' placeholder='Email' />
      </label>
      <div className='error-div text-red-500'>{errors.email?.message}</div>

      <label className='form-label' key='password'>
        {'Password: '}
        <input {...register('password')} type='password' placeholder='Password' />
      </label>
      <PasswordStrength password={password} />
      <div className='error-div text-red-500'>{errors.password?.message}</div>

      <label className='form-label' key='confirmPassword'>
        {'Confirm Password: '}
        <input {...register('confirmPassword')} type='password' placeholder='Confirm Password' />
      </label>
      <div className='error-div text-red-500'>{errors.confirmPassword?.message}</div>

      <div className='form-label' key='gender'>
        {'Gender: '}
        <input type='radio' id='hook-male' value='male' {...register('gender')} />
        <label htmlFor='hook-male'>Male</label>
        <input type='radio' id='hook-female' value='female' {...register('gender')} />
        <label htmlFor='hook-female'>Female</label>
      </div>
      <div className='error-div text-red-500'>{errors.gender?.message}</div>

      <label className='form-label' key='termsAndConditions'>
        {'Accept terms and conditions: '}
        <input {...register('termsAndContions')} type='checkbox' />
      </label>
      <div className='error-div text-red-500'>{errors.termsAndContions?.message}</div>

      <label className='form-label' key='Avatar'>
        {'Avatar: '}
        <input {...register('avatar')} type='file' />
      </label>
      <div className='error-div text-red-500'>{errors.avatar?.message}</div>

      <label className='form-label' key='country'>
        {'Country: '}
        <input
          {...register('country')}
          type='text'
          list='countries-hook'
          placeholder='Country'
          autoComplete='one-time-code'
        />
        <datalist id='countries-hook'>
          {countryNames.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </label>
      <div className='error-div text-red-500'>{errors.country?.message}</div>

      <button type='submit'>Submit</button>
    </form>
  )
}
