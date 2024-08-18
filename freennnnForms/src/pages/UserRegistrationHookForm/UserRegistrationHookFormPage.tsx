import { SubmitHandler, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

//import { User } from '../../data/types'
import '../UserRegistrationFormPage.css'

interface FormFields {
  name: string
  password: string
}

export default function UserRegistrationHookFormPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>()

  const onSumbit: SubmitHandler<FormFields> = (data) => {
    console.log(data)
  }
  return (
    <div>
      <p>UserRegistrationHookFormPage</p>
      <Link to='/'> back to users lists</Link>
      <form className='hook-form' onSubmit={handleSubmit(onSumbit)}>
        <input
          {...register('name', {
            required: true,
            validate: (value) => value.includes('@'),
          })}
          type='text'
          placeholder='Name'
        />
        {errors.name && <div>Name field is not valid due to {errors.name.message}</div>}
        <input {...register('password')} type='password' placeholder='Password' />
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}
