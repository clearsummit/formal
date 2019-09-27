import styled, { CreateStyled } from '@emotion/styled'

export interface Theme {
  exampleWidth: string
  colors: {
    primary: string
    secondary: string
    error: string
    text: string
    textSecondary: string
    inputInactiveBackground: string
    inputActiveBackground: string
    inputText: string
    inputLabel: string
  }
  spacing: {
    s: string
    m: string
    l: string
  }
}

export const theme: Theme = {
  exampleWidth: '500px',
  colors: {
    primary: '#70a1ff',
    secondary: '#eccc68',
    error: '#ff4757',
    text: '#2f3542',
    textSecondary: '#ced6e0',
    inputInactiveBackground: '#f1f2f6',
    inputActiveBackground: '#dfe4ea',
    inputText: '#2f3542',
    inputLabel: '#a4b0be',
  },
  spacing: {
    s: '8px',
    m: '16px',
    l: '32px',
  },
}

export default styled as CreateStyled<Theme>
