import { FormFields } from './zodFormSchema'

export type User = Omit<FormFields, 'avatar' | 'confirmPassword'> & {
  id: string
  avatarImage: string
}
