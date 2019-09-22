/* eslint-disable no-restricted-syntax, @typescript-eslint/no-object-literal-type-assertion, no-prototype-builtins, no-underscore-dangle */
import { Schema as YupSchema } from 'yup'

import { FormalErrors } from './types'

export function formatYupErrors<Values>(yupError: any, field: null | keyof Values = null): FormalErrors<Values> {
  const errors: any = {} as FormalErrors<Values>
  if(typeof yupError === 'object' && yupError.hasOwnProperty('inner')){
    // Setting a singe field
    if (field && yupError.path === field && yupError.message) {
      errors[field] = yupError.message
    // Setting all fields
    } else {
      for (const err of yupError.inner) {
        if (!errors[err.path]) {
          errors[err.path] = err.message
        }
      }
    }
  }

  return errors
}

export function objectIsEmpty(obj: object): boolean {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) return false
  }

  return true
}

export function schemaHasAsyncValidation<Schema>(
  schema: YupSchema<Schema>,
  values: Schema
): boolean {
  try {
    schema.validateSync(values)
  } catch (error) {
    if (error.message.includes('Promise')) return true
  }

  return false
}

export function equalSets(set1: Set<string>, set2: Set<string>) {
   if (set1.size !== set2.size) return false
    // @ts-ignore
    for (const item of set1) if (!set2.has(item)) return false
    return true
}


export function checkRequired<Schema>(schema: YupSchema<Schema>, values: Schema) {
  if (schema && schema.hasOwnProperty('fields')) {
    // @ts-ignore
    for (const field in schema.fields) {
      // @ts-ignore
      if (schema.fields[field]._exclusive.required && (values[field] === undefined || values[field] === '')) {
        return false
      }
    }
  }
  return true
}