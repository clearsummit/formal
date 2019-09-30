import styled, { Theme } from '../utils/styled'

interface ButtonProps {
  disabled?: boolean
  variant?: 'primary' | 'secondary'
  type?: 'submit' | 'reset' | 'button' | undefined
}

interface StyledButtonProps {
  theme: Theme
}

const Button = styled.button<ButtonProps>`
  border: ${(props: StyledButtonProps & ButtonProps) =>
    props.variant === 'primary'
      ? 'none'
      : `2px solid ${props.theme.colors.primary}`};
  background-color: ${(props: StyledButtonProps & ButtonProps) =>
    props.variant === 'primary' ? props.theme.colors.primary : 'white'};
  border-radius: ${(props: StyledButtonProps & ButtonProps) => props.theme.spacing.s};
  color: ${(props: StyledButtonProps & ButtonProps) =>
    props.variant === 'primary' ? 'white' : props.theme.colors.primary};
  cursor: ${(props: StyledButtonProps & ButtonProps) => (props.disabled ? 'not-allowed' : 'pointer')};
  font-family: 'Lato', sans-serif;
  font-size: 1.5em;
  opacity: ${(props: StyledButtonProps & ButtonProps) => (props.disabled ? 0.2 : 1)};
  outline: none;
  padding: 0.25em 2em;
  transition: all 0.25s ease;

  &:hover {
    opacity: ${(props: StyledButtonProps & ButtonProps)=> (props.disabled ? 0.2 : 0.75)};
  }

  &:active {
    opacity: ${(props: StyledButtonProps & ButtonProps) => (props.disabled ? 0.2 : 0.9)};
  }
`

Button.defaultProps = {
  variant: 'primary',
}

export default Button
