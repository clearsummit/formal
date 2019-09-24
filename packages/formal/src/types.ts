import { Schema as YupSchema } from 'yup'

export interface FormalConfig<Schema> {
  schema?: YupSchema<Schema>
  onSubmit: (values: Schema) => void,
  validationType?: 'change' | null
}

export type FormalErrors<Schema> = {
  [K in keyof Schema]?: Schema[K] extends object
    ? FormalErrors<Schema[K]>
    : string
}

export interface FormalTextFieldEvent {
  target: {
    value: string
  }
}

export interface FormalFieldProps {
  disabled: boolean
  value: any
  error?: string
}

export interface FormalResetButtonProps {
  disabled: boolean
}

export interface FormalSubmitButtonProps {
  disabled: boolean
}

export interface FormalState<Schema> {
  // Flags.
  isDirty: boolean
  isValid: boolean
  isValidating: boolean
  isSubmitting: boolean
  isSubmitted: boolean

  // State.
  values: Schema
  errors: FormalErrors<Schema>
  validatedFields: {validated: Set<string>, activeField:keyof Schema | null}

  // Callbacks.
  change: (field: keyof Schema, value: any) => void
  setErrors: (errors: FormalErrors<Schema>) => void
  clearErrors: () => void
  validate: (field?: null| keyof Schema) => void
  reset: () => void
  submit: () => void
  blur: () => void

  // Getters.
  getFieldProps: (field: keyof Schema) => FormalFieldProps
  getResetButtonProps: () => FormalResetButtonProps
  getSubmitButtonProps: () => FormalSubmitButtonProps
}
