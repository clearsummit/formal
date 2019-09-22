If you provided a **yup schema** to `config.schema`, **and validationType** `change` then the form will validate on the onChange event. Only the field being changed is validated.

---

> ℹ️ If the form is invalid, then `formal.isValid` will be set to `false`. Internally it keeps tracks of what fields have been validated with the onChange. Because required validation is only done on submit it also checks that required values are not `null`, `undefined`, or `''`.

> ℹ️ The current field being validated is set to keep track of what field is being validated with `formal.validate`. It is cleared with `onBlur`.

> ℹ️ If the field has an error, then `formal.getFieldProps(field)` will return `error = errorMsg`.

> ℹ️ You can also get a field error message at `formal.errors[field]`.

> ℹ️ If the validation failed and the current form values are the same as when the fail occurred, then `formal.getSubmitButtonProps()` will return `disabled = true`.

> ℹ️ If the validation failed and the current form values are the same as when the fail occurred, then `formal.getSubmitButtonProps()` will return `disabled = true`.

---

> ✅ You can also manually validate the form by calling the imperative method `formal.validate()`.

---

```javascript
import React from "react";
import * as yup from "yup";
import useFormal from "@kevinwolf/formal";

const initialValues = {
  firstName: "",
  lastName: "",
  email: ""
};

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup
    .string()
    .email()
    .required()
});

function ValidateOnSubmitExample() {
  const formal = useFormal(initialValues, {
    schema,
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
    validationType: "change"
  });

  return (
    <form {...formal.getFormProps()}>
      <input {...formal.getFieldProps("firstName")} type="text" />
      <input {...formal.getFieldProps("lastName")} type="text" />
      <input {...formal.getFieldProps("email")} type="text" />
      <button {...formal.getResetButtonProps()}>Reset</button>
      <button {...formal.getSubmitButtonProps()}>Submit</button>
    </form>
  );
}
```
