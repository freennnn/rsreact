import { z } from 'zod'

export const schema = z
  .object({
    name: z.string().refine(
      (value) => {
        return /^[A-Z]/.test(value)
      },
      { message: 'Name should be upper cased' },
    ),
    age: z.string().refine((age) => Number(age) > 0, { message: 'Age should be positive number' }),
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string(),
    termsAndContions: z.boolean(),
    avatar: z.string(),
    isMale: z.boolean(),
    country: z.string(),
  })
  .superRefine(({ password }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch)
    const containsLowercase = (ch: string) => /[a-z]/.test(ch)
    const containsSpecialChar = (ch: string) => /[`!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?~ ]/.test(ch)
    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0

    for (let i = 0; i < password.length; i++) {
      const ch = password.charAt(i)
      if (!isNaN(+ch)) countOfNumbers++
      else if (containsUppercase(ch)) countOfUpperCase++
      else if (containsLowercase(ch)) countOfLowerCase++
      else if (containsSpecialChar(ch)) countOfSpecialChar++
    }

    const errObj = {
      upperCase: { pass: true, message: 'Add upper case' },
      lowerCase: { pass: true, message: 'Add lower case' },
      specialCh: { pass: true, message: 'Add special character' },
      totalNumber: { pass: true, message: 'Add number' },
    }

    if (countOfLowerCase < 1) {
      checkPassComplexity.addIssue({
        code: 'custom',
        path: ['password'],
        message: errObj.lowerCase.message,
      })
    }
    if (countOfNumbers < 1) {
      checkPassComplexity.addIssue({
        code: 'custom',
        path: ['password'],
        message: errObj.totalNumber.message,
      })
    }
    if (countOfUpperCase < 1) {
      checkPassComplexity.addIssue({
        code: 'custom',
        path: ['password'],
        message: errObj.upperCase.message,
      })
    }
    if (countOfSpecialChar < 1) {
      checkPassComplexity.addIssue({
        code: 'custom',
        path: ['password'],
        message: errObj.specialCh.message,
      })
    }
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      })
    }
  })

export type FormFields = z.infer<typeof schema>
