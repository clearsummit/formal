import { useEffect, useState, useReducer, useMemo, useCallback } from 'react'
import isEqual from 'react-fast-compare'

import { FormalConfig, FormalState, FormalErrors, FormalSubmitButtonProps, FormalResetButtonProps } from './types'
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
  const [validatedFields, setValidatedFields] = useState<{validated: Set<string>, activeField: keyof Schema | null}>({validated: new Set(), activeField: null})

  const errorReducer = (errors: FormalErrors<Schema>, action: {type: 'CLEAR', payload: keyof Schema | null | undefined }| {type: 'SET', payload: FormalErrors<Schema> }) => {
    let newErrors
    switch(action.type) {
    case 'CLEAR':
      if (typeof action.payload === 'string') {
        newErrors =  {...errors, [action.payload]: null}
      } else {
        newErrors = {}
      }
      break
    case 'SET':
        if (typeof action.payload === 'object') {
          newErrors = {...errors, ...action.payload}
        }
        break
      default:
          newErrors = errors
    }
    return newErrors
  }

  // @ts-ignore
  const [errors, errorDispatch] = useReducer(errorReducer, {})

  const setErrors = useCallback((payload: FormalErrors<Schema>) => {
    errorDispatch({type: 'SET', payload})
  }, [errorDispatch])

  const clearErrors = useCallback((payload?: null | undefined | keyof Schema) => {
    errorDispatch({type: 'CLEAR', payload})
  },[errorDispatch])

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

  const validate = useCallback((field?: null | undefined | keyof Schema) => {
    if (!schema) {
      throw new Error(
        'You cannot call validate if you have not provided any schema.'
      )
    }

    return new Promise(async (resolve, reject) => {
      const isAsync = schemaHasAsyncValidation<Schema>(schema, values)

      try {
        const validationMethod = isAsync ? 'validate' : 'validateSync'
        if (isAsync) setIsValidating(true)
        if (field != null && typeof field === 'string') {
          await schema.validateAt(field, values)
        } else {
          await schema[validationMethod](values, { abortEarly: false })
        }
        clearErrors(field)
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
    (): FormalResetButtonProps => ({
      disabled:
        (!isDirty && objectIsEmpty(errors)) || isValidating || isSubmitting,
    }),
    [errors, isDirty, isSubmitting, isValidating]
  )

  const getSubmitButtonProps = useCallback(
    (): FormalSubmitButtonProps => ({
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
