import s from "./style.module.css";
import { PencilFill, TrashFill } from "react-bootstrap-icons";
import { ButtonPrimary } from "../ButtonPrimary/ButtonPrimary";
import { useState } from "react";
import { ValidatorService } from "../../services/form-validator";
import { FieldError } from "../FieldError/FieldError";
const VALIDATORS = {
  title: (value) => {
    return ValidatorService.min(value, 3) || ValidatorService.max(value, 20);
  },
  content: (value) => {
    return ValidatorService.min(value, 3);
  },
};

export function NoteForm({
  isEditable = true,
  note,
  title,
  onClickEdit,
  onClickTrash,
  onSubmit,
}) {
  const [formValues, setFormValues] = useState({
    title: note?.title || "",
    content: note?.content || "",
  });
  const [formErrors, setFormErrors] = useState({
    title: note?.title ? undefined : "",
    content: note?.content ? undefined : "",
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
  const [isPencilHovered, setIsPencilHovered] = useState(false);
  const [isTrashHovered, setIsTrashHovered] = useState(false);
  const actionIcons = (
    <div className={`col-2 ${s.icondiv}`}>
      <div
        onMouseEnter={() => setIsPencilHovered(true)}
        onMouseLeave={() => setIsPencilHovered(false)}
        className="col-1"
        style={{ borderColor: isPencilHovered ? "#0d6efd" : "transparent" }}
      >
        {onClickEdit && (
          <PencilFill
            onClick={onClickEdit}
            className={s.icon}
            style={{ color: isPencilHovered ? "#FF7373" : "#b8b8b8" }}
          />
        )}
      </div>
      <div
        onMouseEnter={() => setIsTrashHovered(true)}
        onMouseLeave={() => setIsTrashHovered(false)}
        className="col-1"
        style={{ borderColor: isTrashHovered ? "#0d6efd" : "transparent" }}
      >
        {onClickTrash && (
          <TrashFill
            onClick={onClickTrash}
            className={s.icon}
            style={{ color: isTrashHovered ? "#FF7373" : "#b8b8b8" }}
          />
        )}
      </div>
    </div>
  );

  const titleInput = (
    <div className={`mb-5 ${s.div}`}>
      <h2 className={`${s.h2}`}>Title</h2>
      <input
        onChange={updateFormValues}
        type="text"
        name="title"
        className={`${s.input}`}
        value={formValues.title}
      />
      <FieldError msg={formErrors.title} />
    </div>
  );

  const contentInput = (
    <div className={`mb-5 ${s.div}`}>
      <h2 className={` ${s.h2}`}>Content</h2>
      <textarea
        onChange={updateFormValues}
        type="text"
        name="content"
        className={`${s.textarea}`}
        row="5"
        value={formValues.content}
      />
      <FieldError msg={formErrors.content} />
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
      <div className="row justify-content-space-between">
        <div className={`col-10 ${s.titleIcon}`}>
          <h1 className={`mb-3 `}>{title}</h1>
          {actionIcons}
        </div>
      </div>
      <div className="mb-3">{isEditable && titleInput}</div>
      <div className="mb-3">
        {isEditable ? contentInput : <p className={s.p}>{note.content}</p>}
      </div>
      {onSubmit && submitButton}
    </form>
  );
}
