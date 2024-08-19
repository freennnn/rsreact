import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import { zodResolver } from '@hookform/resolvers/zod'

import { countryNames } from '../../data/countries'
import { convertImageToBase64 } from '../../data/imageUtils'
import { useAppDispatch } from '../../data/store'
import { addUser } from '../../data/usersSlice'
import { FormFields, schema } from '../../data/zodFormSchema'
//import { User } from '../../data/types'
import '../UserRegistrationFormPage.css'

export default function UserRegistrationHookFormPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({ resolver: zodResolver(schema) })

  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const onSumbit: SubmitHandler<FormFields> = async (data) => {
    try {
      if (data.avatar instanceof File) {
        const avatarImage = await convertImageToBase64(data.avatar)
        dispatch(addUser({ ...data, avatarImage }))
        navigate('/')
      }
    } catch (error) {
      console.error(error)
    }
    console.log(data)
  }

  return (
    <div>
      <p>UserRegistrationHookFormPage</p>
      <Link to='/'> back to users lists</Link>
      <form className='form gap-x-3' onSubmit={handleSubmit(onSumbit)} autoComplete='one-time-code'>
        <label className='form-label' key='name'>
          {'Name: '}
          <input
            {...register('name')}
            type='text'
            placeholder='Name'
            autoComplete='one-time-code'
          />
        </label>
        <div className='error-div text-red-500'>
          {errors.name?.message ? errors.name?.message : ''}
        </div>

        <label className='form-label' key='age'>
          {'Age: '}
          <input {...register('age')} type='text' placeholder='Age' autoComplete='one-time-code' />
        </label>
        <div className='error-div text-red-500'>
          {errors.age?.message ? errors.age?.message : ''}
        </div>

        <label className='form-label' key='email'>
          {'Email: '}
          <input {...register('email')} type='text' placeholder='Email' />
        </label>
        <div className='error-div text-red-500'>{errors.email?.message}</div>

        <label className='form-label' key='password'>
          {'Password: '}
          <input {...register('password')} type='password' placeholder='Password' />
        </label>
        <div className='error-div text-red-500'>{errors.password?.message}</div>

        <label className='form-label' key='confirmPassword'>
          {'Confirm Password: '}
          <input {...register('confirmPassword')} type='password' placeholder='Confirm Password' />
        </label>
        <div className='error-div text-red-500'>{errors.confirmPassword?.message}</div>

        <div className='form-label' key='gender'>
          {'Gender: '}
          <input type='radio' id='male' value='male' {...register('gender')} />
          <label htmlFor='male'>Male</label>
          <input type='radio' id='female' value='female' {...register('gender')} />
          <label htmlFor='female'>Female</label>
        </div>
        <div className='error-div text-red-500'>{errors.gender?.message}</div>

        <label className='form-label' key='termsAndConditions'>
          {'Accept terms and conditions: '}
          <input
            {...register('termsAndContions')}
            type='checkbox'
            placeholder='Agree to terms and conditions'
          />
        </label>
        <div className='error-div text-red-500'>{errors.termsAndContions?.message}</div>

        <label className='form-label' key='Avatar'>
          {'Avatar: '}
          <input {...register('avatar')} type='file' placeholder='Select and upload an avatar' />
        </label>
        <div className='error-div text-red-500'>{errors.avatar?.message}</div>

        <label className='form-label' key='country'>
          {'Contry: '}
          <input
            {...register('country')}
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
        <div className='error-div text-red-500'>{errors.country?.message}</div>

        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}
