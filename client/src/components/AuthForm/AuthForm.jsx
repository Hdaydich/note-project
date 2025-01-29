import s from "./style.module.css";
import { ButtonPrimary } from "../ButtonPrimary/ButtonPrimary";
import { useState } from "react";
import { ValidatorService } from "../../services/form-validator";
import { FieldError } from "../FieldError/FieldError";

const VALIDATORS = {
  userName: (value) => {
    return ValidatorService.min(value, 6) || ValidatorService.max(value, 20);
  },

  pwd: (value) => {
    return ValidatorService.min(value, 6);
  },
};

export function AuthForm({ onSubmit }) {
  const [formValues, setFormValues] = useState({
    userName: "",
    pwd: "",
  });
  const [formErrors, setFormErrors] = useState({
    userName: "",
    pwd: "",
  });

  function hasError() {
    return Object.values(formErrors).some((error) => error !== undefined);
  }

  function updateFormValues(e) {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
    validate(e.target.name, e.target.value);
  }

  function validate(fieldName, fieldValue, done) {
    setFormErrors(
      {
        ...formErrors,
        [fieldName]: VALIDATORS[fieldName](fieldValue),
      },
      done
    );
  }

  const userNameInput = (
    <div className={`mb-5 ${s.div}`}>
      <h3 className={`form-label ${s.h2}`}>User name </h3>
      <input
        onChange={updateFormValues}
        type="text"
        name="userName"
        className={`form-control ${s.input}`}
        value={formValues.userName}
      />
      <FieldError msg={formErrors.userName} />
    </div>
  );

  const pwdInput = (
    <div className={`mb-5 ${s.div}`}>
      <h3 className={`form-label ${s.h2}`}>Password</h3>
      <input
        onChange={updateFormValues}
        type="text"
        name="pwd"
        className={`form-control ${s.input}`}
        row="5"
        value={formValues.pwd}
      />
      <FieldError msg={formErrors.pwd} />
    </div>
  );

  const submitButton = (
    <div className={s.submit_btn}>
      <ButtonPrimary
        isDisabled={hasError()}
        onClick={() => onSubmit(formValues)}
      >
        Submit
      </ButtonPrimary>
    </div>
  );

  return (
    <form className={s.container}>
      <div className={`mb-3 ${s.h1}`}>
        <h2>Authentification</h2>
      </div>
      <div className="mb-3">{userNameInput}</div>
      <div className="mb-3">{pwdInput}</div>
      {submitButton}
    </form>
  );
}
