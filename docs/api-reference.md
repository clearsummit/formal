# API Reference

---

## Reading this doc

Some of the props are just for react web or react native.

💻 React web

📱 React native

---

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [useFormal](#useformal)
  - [FormalValues](#formalvalues)
  - [FormalConfig](#formalconfig)
    - [schema](#schema)
    - [onSubmit](#onsubmit)
    - [validationType](#validationtype)
  - [FormalState](#formalstate)
    - [isDirty](#isdirty)
    - [isValid](#isvalid)
    - [isValidating](#isvalidating)
    - [isSubmitting](#issubmitting)
    - [isSubmitted](#issubmitted)
    - [values](#values)
    - [errors](#errors)
    - [change](#change)
    - [setErrors](#seterrors)
    - [clearErrors](#clearerrors)
    - [validate](#validate)
    - [reset](#reset)
    - [submit](#submit)
    - [blur](#blur)
    - [getFormProps](#getformprops)
    - [getFieldProps 💻](#getfieldprops-)
    - [getResetButtonProps](#getresetbuttonprops)
    - [getSubmitButtonProps](#getsubmitbuttonprops)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## useFormal

Main useFormal hook. Use it on your functional components to get the primitives to easily work with forms.

```typescript
export default function useFormal<Schema>(
  initialValues: FormalValues,
  config: FormalConfig<Schema>
): FormalState<Schema>;
```

### FormalValues

The form initial values. It can be a hardcoded object or an object gotten from an API endpoint.

```typescript
type InitialValues = {
  [field: string]: any;
};
```

Example:

```typescript
const initialValues = {
  firstName: "Tony",
  lastName: "Stark",
  email: "ironman@avengers.io"
};
```

### FormalConfig

The hook configuration object.

```typescript
import { Schema as YupSchema } from "yup";

interface FormalConfig<Schema> {
  schema?: YupSchema<Schema>;
  onSubmit: (
    values: FormalValues,
    formal: FormalState<Schema>
  ) => void | Promise<any>;
  validationType?: "change" | null;
}
```

#### schema

A [yup](https://github.com/jquense/yup) schema definition. It will be called before submitting the form.

#### onSubmit

The function that will be called if your form is correctly validated, passing the actual values as the first argument and the FormalState as the second argument. If it is an asynchronous function, then `formal.isLoading` will be true until the promise is resolved or rejected.

Example:

```typescript
import * as yup from "yup";

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup
    .string()
    .email()
    .required()
});

async function onSubmit(values, formal) {
  try {
    await someAsyncTask(values);
  } catch (errors) {
    const formattedErrors = transformErrorsForFormal(errors);
    formal.setErrors(formattedErrors);
  }
}

const formalConfig = {
  schema,
  onSubmit
};
```

#### validationType

`validationType` is an optional prop to set validation to happen with the `onChange` event and `onSubmit`. The default is to only validate `onSubmit`.

### FormalState

This is the state, callbacks, flags and _prop getters_ returned by **useFormal()** hook.

```typescript
interface FormalState<Schema> {
  // Flags.
  isDirty: boolean;
  isValid: boolean;
  isValidating: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;

  // State.
  values: Schema;
  errors: FormalErrors<Schema>;

  // Callbacks.
  change: (field: keyof Schema, value: any) => void;
  setErrors: (errors: FormalErrors<Schema>) => void;
  clearErrors: () => void;
  validate: () => void;
  reset: () => void;
  submit: () => void;
  blur: (field: keyof Schema) => void;

  // Getters.
  getFormProps: () => FormalFormProps;
  getFieldProps: (field: keyof Schema) => FormalFieldProps;
  getResetButtonProps: () => FormalResetButtonProps;
  getSubmitButtonProps: () => FormalSubmitButtonProps;
}
```

#### isDirty

A boolean indicating if the form has changed since its initial state or its last successful submission.

#### isValid

A boolean indicating if the form is valid or not.

#### isValidating

A boolean indicating if any asynchronous validation is happening.

#### isSubmitting

A boolean indicating if the form is being submitted.

#### isSubmitted

A boolean indicated if the form has already been submitted.

#### values

The current form values.

#### errors

The current form errors.

#### change

Programatically change the value of a field.

```typescript
formal.change("firstName", "New First Name");
```

#### setErrors

Programatically set the form errors.

```typescript
const errors = { firstName: "You can not use this first name!" };
formal.setErrors(errors);
```

#### clearErrors

Programatically clear the form errors.

```typescript
formal.clearErrors();
```

#### validate

Programatically validate the form. This will always return a promise, in case the schema contains async validations.

```typescript
const handleValidate = async () => {
  try {
    await formal.validate();
    console.log("valid!");
  } catch (errors) {
    console.error("validation failed", errors);
  }
};
```

#### reset

Programatically reset the form to its initial state or last successful values in case it has been submitted.

```typescript
formal.reset();
```

#### submit

Programatically submit the form.

```typescript
formal.submit();
```

#### blur

Programatically call formal's `onBlur` cleanup.

```typescript
formal.blur("firstName");
```

#### getFormProps

Returns the props to spread to a form element.

> ⚠️ Since React Native does not have a `<form />` equivalent, this method will warn the user and suggest correct usage.

```typescript
<form {...formal.getFormProps()} />
```

| Name     | Type     | Description                       |
| -------- | -------- | --------------------------------- |
| onSubmit | function | calls `formal.submit()` function. |

#### getFieldProps 💻

Returns the props to spread to a form field.

```typescript
// React Web:
<input {...getInputProps('firstName')} type="text" />

// React Native:
<TextInput {...getInputProps('firstName')} />
```

| Name                          | Type                | Description                         |
| ----------------------------- | ------------------- | ----------------------------------- |
| name 💻                       | string              | returns the field name              |
| id 💻                         | string              | returns the field name              |
| value                         | string              | returns the field value             |
| error                         | string \| undefined | returns the field error, if exist   |
| onChange 💻 / onChangeText 📱 | function            | calls `formal.change(field, value)` |

#### getResetButtonProps

Useful if you have a reset button on your form.

```typescript
// React Web:
<button {...formal.getResetButtonProps()}>Reset form</button>

// React Native:
<Button {...formal.getResetButtonProps()} title="Reset form" />
```

| Name                    | Type         | Description                                                                        |
| ----------------------- | ------------ | ---------------------------------------------------------------------------------- |
| disabled                | boolean      | will be false if the form contain errors, is dirty, is validating or is submitting |
| type 💻                 | **'button'** | `type` attribute for `<button>` element                                            |
| onClick 💻 / onPress 📱 | function     | calls `formal.reset()`                                                             |

#### getSubmitButtonProps

Returns the props to spread to a submit button.

```typescript
// React Web:
<button {...formal.getSubmitButtonProps()}>Submit form</button>

// React Native:
<Button {...formal.getSubmitButtonProps()} title="Submit form" />
```

| Name       | Type         | Description                                                                        |
| ---------- | ------------ | ---------------------------------------------------------------------------------- |
| disabled   | boolean      | will be false if the form contain errors, is dirty, is validating or is submitting |
| type 💻    | **'submit'** | `type` attribute for `<button>` element                                            |
| onPress 📱 | function     | calls `formal.submit()`                                                            |
