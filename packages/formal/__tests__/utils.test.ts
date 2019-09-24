import * as yup from 'yup'
import {
  objectIsEmpty,
  formatYupErrors,
  schemaHasAsyncValidation,
  equalSets,
  checkRequired,
} from '../src/utils'

describe('utils', () => {
  describe('objectIsEmpty()', () => {
    it('should be true when object is empty', () => {
      const isEmpty = objectIsEmpty({})

      expect(isEmpty).toBeTruthy()
    })

    it('should be false when object is not empty', () => {
      const isEmpty = objectIsEmpty({ empty: false })

      expect(isEmpty).toBeFalsy()
    })
  })

  describe('formatYupErrors()', () => {
    it('should format yup errors correctly', () => {
      const errorMessages = {
        firstName: 'firstName is required',
        lastName: 'lastName is required',
      }
      const yupError = {
        inner: [
          {
            path: 'firstName',
            message: errorMessages.firstName,
          },
          {
            path: 'lastName',
            message: errorMessages.lastName,
          },
        ],
      }

      const errors = formatYupErrors(yupError)

      expect(errors).toEqual(errorMessages)
    })

    it('should not duplicate yup errors', () => {
      const errorMessages = {
        firstName: 'firstName is required',
        lastName: 'lastName is required',
      }
      const yupError = {
        inner: [
          {
            path: 'firstName',
            message: errorMessages.firstName,
          },
          {
            path: 'firstName',
            message: errorMessages.firstName,
          },
          {
            path: 'lastName',
            message: errorMessages.lastName,
          },
        ],
      }

        const errors = formatYupErrors(yupError)

        expect(errors).toEqual(errorMessages)
    })

    it('should return empty error object when inner is empty and no field provided', () => {
      const yupError = { inner: [] }

      const errors = formatYupErrors(yupError)

      expect(errors).toEqual({})
    })

    it('should return error when inner is empty, field provided equals path and message present', () => {
      const field = 'first_name'
      const message = 'First name required.'
      const yupError = { inner: [], path: field, message }

      const errors = formatYupErrors(yupError, field)

      expect(errors).toEqual({ [field]: message })
    })

    it('should return empty error object when inner is empty, field provided and no message present', () => {
      const field = 'first_name'
      const yupError = { inner: [], path: field }

      const errors = formatYupErrors(yupError, field)

      expect(errors).toEqual({})
    })

    it('should return empty error object when yupError is undefined', () => {
      const errors = formatYupErrors(undefined)

      expect(errors).toEqual({})
    })
  })

  describe('schemaHasAsyncValidation()', () => {
    it('should be false when no async validation', () => {
      const schema = yup.object().shape({
        name: yup.string().required(),
        age: yup
          .number()
          .required()
          .positive()
          .integer(),
      })

      const hasAsync = schemaHasAsyncValidation(schema, {
        name: 'Peter Parker',
        age: 40,
      })

      expect(hasAsync).toBeFalsy()
    })

    it('should be true when there is async validation', () => {
      const schema = yup
        .number()
        .test('is-42', 'Number should be 42', value =>
          Promise.resolve(value !== 42)
        )

      const hasAsync = schemaHasAsyncValidation(schema, 42)

      expect(hasAsync).toBeTruthy()
    })
  })
})

describe('equalSets()', () => {
  it('should return true for equal Sets', () => {
    const equal = equalSets(new Set(['one', 'two']), new Set(['one', 'two']))
    expect(equal).toBeTruthy()
  })

  it('should return false for unequal Sets', () => {
    const equal = equalSets(new Set(['one']), new Set(['one', 'two']))
    expect(equal).toBeFalsy()
  })
})

describe('checkRequired()', () => {
  it('should be true if all required fields present', () => {
    const schema = yup.object().shape({
      name: yup.string().required(),
      age: yup
        .number()
        .required()
        .positive()
        .integer(),
    })

    const validRequired = checkRequired(schema, {
      name: 'Peter Parker',
      age: 40,
    })

    expect(validRequired).toBeTruthy()
  })

  it('should be true if non required field is null', () => {
    const schema = yup.object().shape({
      name: yup.string().required(),
      age: yup
        .number()
        .positive()
        .integer(),
    })

    const validRequired = checkRequired(schema, {
      name: 'Peter Parker',
      // @ts-ignore
      age: null,
    })

    expect(validRequired).toBeTruthy()
  })

  it('should be true if non required field is undefined', () => {
    const schema = yup.object().shape({
      name: yup.string().required(),
      age: yup
        .number()
        .positive()
        .integer(),
    })

    const validRequired = checkRequired(schema, {
      name: 'Peter Parker',
      // @ts-ignore
      age: undefined,
    })

    expect(validRequired).toBeTruthy()
  })

  it('should be true if non required field is empty string', () => {
    const schema = yup.object().shape({
      name: yup.string(),
      age: yup
        .number()
        .required()
        .positive()
        .integer(),
    })

    const validRequired = checkRequired(schema, {
      name: '',
      age: 40,
    })

    expect(validRequired).toBeTruthy()
  })

  it('should be false if any required field is null', () => {
    const schema = yup.object().shape({
      name: yup.string().required(),
      age: yup
        .number()
        .required()
        .positive()
        .integer(),
    })

    const validRequired = checkRequired(schema, {
      name: 'Peter Parker',
      // @ts-ignore
      age: null,
    })

    expect(validRequired).toBeFalsy()
  })

  it('should be false if any required field is undefined', () => {
    const schema = yup.object().shape({
      name: yup.string().required(),
      age: yup
        .number()
        .required()
        .positive()
        .integer(),
    })

    const validRequired = checkRequired(schema, {
      // @ts-ignore
      name: undefined,
      age: 40,
    })

    expect(validRequired).toBeFalsy()
  })

  it('should be false if any required field is empty string', () => {
    const schema = yup.object().shape({
      name: yup.string().required(),
      age: yup
        .number()
        .required()
        .positive()
        .integer(),
    })

    const validRequired = checkRequired(schema, {
      name: '',
      age: 40,
    })

    expect(validRequired).toBeFalsy()
  })
})
