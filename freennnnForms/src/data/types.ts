import { FormFields } from './zodFormSchema'

// export interface User {
//   id: string
//   name: string
//   age: number
//   email: string
//   password: string
//   gender: 'male' | 'female'
//   termsAccepted: boolean
//   image: Base64
//   country: string
// }

export type User = Omit<FormFields, 'avatar' | 'confirmPassword'> & {
  id: string
  avatarImage: string
}
