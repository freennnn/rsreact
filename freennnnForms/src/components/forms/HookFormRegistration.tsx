import { useMemo } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { v4 as uuidv4 } from 'uuid'

import { selectCountryNames } from '../../data/countriesSlice'
import { convertImageToBase64 } from '../../data/imageUtils'
import { useAppDispatch, useAppSelector } from '../../data/store'
import { addUser } from '../../data/usersSlice'
import { FormFields, createFormSchema } from '../../data/zodFormSchema'
import { CountryAutocomplete } from '../CountryAutocomplete/CountryAutocomplete'
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
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
    watch,
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const dispatch = useAppDispatch()
  const password = watch('password')

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (!(data.avatar instanceof File)) {
      return
    }

    const avatarImage = await convertImageToBase64(data.avatar)
    const { avatar: omittedAvatar, confirmPassword: omittedConfirmPassword, ...userData } = data
    void omittedAvatar
    void omittedConfirmPassword

    dispatch(addUser({ ...userData, avatarImage, id: uuidv4() }))
    reset()
    onSuccess()
  }

  return (
    <form className='form gap-x-3' onSubmit={handleSubmit(onSubmit)} autoComplete='one-time-code'>
      <div className='form-field'>
        <label htmlFor='hook-name' className='field-label'>
          Name:
        </label>
        <input
          id='hook-name'
          {...register('name')}
          type='text'
          placeholder='Name'
          autoComplete='one-time-code'
        />
        <div className='error-div text-red-500'>{errors.name?.message ?? ''}</div>
      </div>

      <div className='form-field'>
        <label htmlFor='hook-age' className='field-label'>
          Age:
        </label>
        <input
          id='hook-age'
          {...register('age')}
          type='text'
          placeholder='Age'
          autoComplete='one-time-code'
        />
        <div className='error-div text-red-500'>{errors.age?.message ?? ''}</div>
      </div>

      <div className='form-field'>
        <label htmlFor='hook-email' className='field-label'>
          Email:
        </label>
        <input id='hook-email' {...register('email')} type='text' placeholder='Email' />
        <div className='error-div text-red-500'>{errors.email?.message}</div>
      </div>

      <div className='form-field'>
        <label htmlFor='hook-password' className='field-label'>
          Password:
        </label>
        <input
          id='hook-password'
          {...register('password')}
          type='password'
          placeholder='Password'
        />
        <div className='error-div text-red-500'>{errors.password?.message}</div>
        <PasswordStrength password={password} />
      </div>

      <div className='form-field'>
        <label htmlFor='hook-confirm-password' className='field-label'>
          Confirm Password:
        </label>
        <input
          id='hook-confirm-password'
          {...register('confirmPassword')}
          type='password'
          placeholder='Confirm Password'
        />
        <div className='error-div text-red-500'>{errors.confirmPassword?.message}</div>
      </div>

      <fieldset className='gender-fieldset'>
        <legend>Gender:</legend>
        <div className='gender-options'>
          <div className='radio-option'>
            <input type='radio' id='hook-male' value='male' {...register('gender')} />
            <label htmlFor='hook-male'>Male</label>
          </div>
          <div className='radio-option'>
            <input type='radio' id='hook-female' value='female' {...register('gender')} />
            <label htmlFor='hook-female'>Female</label>
          </div>
        </div>
        <div className='error-div text-red-500'>{errors.gender?.message}</div>
      </fieldset>

      <div className='form-field'>
        <div className='checkbox-field'>
          <input id='hook-terms' {...register('termsAndContions')} type='checkbox' />
          <label htmlFor='hook-terms'>Accept terms and conditions</label>
        </div>
        <div className='error-div text-red-500'>{errors.termsAndContions?.message}</div>
      </div>

      <div className='form-field'>
        <label htmlFor='hook-avatar' className='field-label'>
          Avatar:
        </label>
        <input id='hook-avatar' {...register('avatar')} type='file' accept='image/png,image/jpeg' />
        <div className='error-div text-red-500'>{errors.avatar?.message}</div>
      </div>

      <div className='form-field'>
        <label htmlFor='hook-country' className='field-label'>
          Country:
        </label>
        <Controller
          name='country'
          control={control}
          render={({ field }) => (
            <CountryAutocomplete
              id='hook-country'
              countries={countryNames}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
        <div className='error-div text-red-500'>{errors.country?.message}</div>
      </div>

      <button type='submit' disabled={!isValid || isSubmitting}>
        Submit
      </button>
    </form>
  )
}
