import { FormFields } from './zodFormSchema'

export type User = Omit<FormFields, 'avatar' | 'confirmPassword'> & {
  id: string
  avatarImage: string
}

export function createUserFromForm(data: FormFields, id: string, avatarImage: string): User {
  const { name, email, age, password, gender, termsAndContions, country } = data
  return { id, avatarImage, name, email, age, password, gender, termsAndContions, country }
}
