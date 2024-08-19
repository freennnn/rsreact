import { z } from 'zod'

import { countryNames } from './countries'
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from './imageUtils'

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
    gender: z.union([z.literal('male'), z.literal('female')], {
      message: 'Please choose either male or female',
    }),
    termsAndContions: z.literal(true),
    avatar: z
      .custom<FileList>()
      .transform((value) => {
        if (value instanceof File) {
          return value
        }
        if (value instanceof FileList && value.length > 0) {
          return value.item(0)
        }
      })
      .refine(
        (file) => file && file.size < MAX_IMAGE_SIZE,
        `Pofile picture should be under ${MAX_IMAGE_SIZE / 1024 / 1024} mb`,
      )
      .refine(
        (file) => file && ACCEPTED_IMAGE_TYPES.includes(file.type),
        'Only jpg/jpeg/webp/png files are allowed',
      ),
    country: z
      .string()
      .refine((value) => countryNames.includes(value), 'We do not operate in that country'),
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
