import { useCallback } from 'react'
import useFormal, { FormalConfig, FormalResetButtonProps, FormalSubmitButtonProps } from '@kevinwolf/formal'

import { FormalWebState, FormalWebTextFieldEvent, FormalWebResetButtonProps, FormalWebSubmitButtonProps } from './types'

export default function useFormalWeb<Schema>(
  initialValues: Schema,
  config: FormalConfig<Schema>
): FormalWebState<Schema> {
  const formal = useFormal(initialValues, config)

  const getFormProps = useCallback(
    () => ({
      onSubmit: (e: any) => {
        e.preventDefault()
        formal.submit()
      },
    }),
    [formal]
  )

  const getFieldProps = useCallback(
    (field: keyof Schema) => ({
      ...formal.getFieldProps(field),
      name: field as string,
      id: field as string,
      onChange: (e: FormalWebTextFieldEvent) => {
        formal.change(field, e.target.value)
      },
      onBlur: () => {
        formal.blur()
      },
    }),
    [formal]
  )

  const getResetButtonProps = useCallback(
    (): FormalResetButtonProps & FormalWebResetButtonProps => ({
      ...formal.getResetButtonProps(),
      type: 'button',
      onClick: () => {
        formal.reset()
      },
    }),
    [formal]
  )

  const getSubmitButtonProps = useCallback(
    ():FormalSubmitButtonProps & FormalWebSubmitButtonProps => ({
      ...formal.getSubmitButtonProps(),
      type: 'submit',
    }),
    [formal]
  )

  return {
    ...formal,
    getFormProps,
    getFieldProps,
    getResetButtonProps,
    getSubmitButtonProps,
  }
}
