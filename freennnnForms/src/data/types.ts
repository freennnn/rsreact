type Base64 = string

export interface User {
  id: string
  name: string
  age: number
  email: string
  password: string
  gender: 'male' | 'female'
  termsAccepted: boolean
  image: Base64
  country: string
}
