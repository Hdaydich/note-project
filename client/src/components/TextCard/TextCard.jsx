import React, { useState, useContext } from "react";
import s from "./style.module.css";
import { Trash as TrashIcon } from "react-bootstrap-icons";

import { useNavigate } from "react-router-dom";
import Modal from "../../shared/components/UIElements/Modal";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

export function TextCard({
  id,
  title,
  subtitle,
  content,
  onClickTrash,
  onClick,
}) {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isTrashHovered, setIsTrashHovered] = useState(false);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/notes/${id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      onClickTrash_();
    } catch (err) {}
  };

  function onClickTrash_(e) {
    onClickTrash();
    e.stopPropagation();
  }
  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
      >
        <p className={s.p}>Do you want to proceed and delete this note?</p>
        <p className={s.p}>Please note that it can't be undone thereafter.</p>
        <div className={s.buttonDiv}>
          <Button className={s.button} onClick={confirmDeleteHandler}>
            DELETE
          </Button>
        </div>
      </Modal>
      <div
        onMouseEnter={() => setIsCardHovered(true)}
        onMouseLeave={() => setIsCardHovered(false)}
        className={`card ${s.container}`}
        style={{ borderColor: isCardHovered ? "#0d6efd" : "transparent" }}
      >
        <div className="card-body">
          <div className={`card-text ${s.dateIcon}`}>
            <h5 className={`card-subtitle mb-2 text-muted ${s.h4}`}>
              {subtitle}
            </h5>
            <div className={s.icon}>
              <TrashIcon
                size={20}
                onMouseEnter={() => setIsTrashHovered(true)}
                onMouseLeave={() => setIsTrashHovered(false)}
                style={{ color: isTrashHovered ? "#FF7373" : "#b8b8b8" }}
                onClick={showDeleteWarningHandler}
              />
            </div>
            <h3 className={`card-title ${s.h3}`} onClick={onClick}>
              {title}
            </h3>
          </div>
          <div onClick={onClick}>
            <p className={`card-text ${s.text_content}`}>{content}</p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
