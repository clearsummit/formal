import { useEffect, useState, useMemo, useCallback } from 'react'
import isEqual from 'react-fast-compare'

import { FormalConfig, FormalState, FormalErrors } from './types'
import {
  objectIsEmpty,
  schemaHasAsyncValidation,
  formatYupErrors,
  equalSets,
  checkRequired,
} from './utils'

export default function useFormal<Schema>(
  initialValues: Schema,
  { schema, onSubmit, validationType = null }: FormalConfig<Schema>,
): FormalState<Schema> {
  const [lastValues, setLastValues] = useState<Schema>(initialValues)
  const [values, setValues] = useState<Schema>(initialValues)
  const [validatedFields, setValidatedFields] = useState<{validated: Set<string>, activeField:keyof Schema | null}>({validated: new Set(), activeField: null})

  const [errors, setErrors] = useState<FormalErrors<Schema>>({})

  const [isValidating, setIsValidating] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const isDirty = useMemo(() => !isEqual(lastValues, values), [
    lastValues,
    values,
  ])

  const isValid = useMemo(() => {
    const { validated } = validatedFields
    // @ts-ignore
    return !!(!isDirty || objectIsEmpty(errors)) && (!schema || (schema && equalSets(new Set(Object.keys(schema.fields)), validated) && checkRequired(schema, values) ))
  }, [errors, isDirty, schema, validatedFields, values])

  const change = useCallback(
    (field: keyof Schema, value: any): void => {
      setValues((prevValues: Schema) => ({ ...prevValues, [field]: value }))
      // @ts-ignore
      setValidatedFields((prevValues: {validated: string[], activeField: keyof Schema | null}) => ({validated: prevValues.validated.add(field), activeField: field}))
    },
    []
  )

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const validate = useCallback((field: null | keyof Schema = null) => {
    if (!schema) {
      throw new Error(
        'You cannot call validate if you have not provided any schema.'
      )
    }

    return new Promise(async (resolve, reject) => {
      const isAsync = schemaHasAsyncValidation<Schema>(schema, values)

      try {
        const validationMethod = isAsync ? 'validate' : 'validateSync'

        clearErrors()
        if (isAsync) setIsValidating(true)
        if (field != null && typeof field === 'string') {
          await schema.validateAt(field, values)
        } else {
          await schema[validationMethod](values, { abortEarly: false })
        }
        resolve()
      } catch (error) {
        setErrors(formatYupErrors<Schema>(error, field))
        reject()
      } finally {
        if (isAsync) setIsValidating(false)
      }
    })
  }, [schema, values, clearErrors, setErrors])

  const reset = useCallback(() => {
    setValues(lastValues)
    clearErrors()
  }, [clearErrors, lastValues])

  const submit = useCallback(async () => {
    if (schema) {
      try {
        await validate()
      } catch (error) {
        return
      }
    }

    setIsSubmitting(true)
    await onSubmit(values)
    setLastValues(values)
    setIsSubmitted(true)
    setIsSubmitting(false)
  }, [schema, validate, onSubmit, values])

  const getFieldProps = useCallback(
    (field: keyof Schema) => ({
      disabled: isSubmitting,
      value: values[field],
      error: errors[field] as string,
    }),
    [errors, isSubmitting, values]
  )

  const getResetButtonProps = useCallback(
    () => ({
      disabled:
        (!isDirty && objectIsEmpty(errors)) || isValidating || isSubmitting,
    }),
    [errors, isDirty, isSubmitting, isValidating]
  )

  const getSubmitButtonProps = useCallback(
    () => ({
      disabled:
        (!isDirty && !isSubmitted && objectIsEmpty(errors)) || isValidating || isSubmitting,
    }),
    [errors, isDirty, isSubmitted, isSubmitting, isValidating]
  )

  useEffect(() => {
    const { activeField } = validatedFields
    if (validationType === 'change' && activeField && typeof values === 'object' && values[activeField]) {
      validate(activeField)
    }
  }, [validate, validatedFields, validatedFields.activeField, validationType, values])

  const blur = useCallback( () => {
    setValidatedFields((prevValues: {validated: Set<string>, activeField: keyof Schema | null}) => ({validated: prevValues.validated, activeField: null}))
  }, [])

  return {
    isDirty,
    isValid,
    isValidating,
    isSubmitting,
    isSubmitted,
    values,
    errors,
    change,
    setErrors,
    clearErrors,
    validate,
    reset,
    submit,
    getFieldProps,
    getResetButtonProps,
    getSubmitButtonProps,
    blur,
    validatedFields,
  }
}
