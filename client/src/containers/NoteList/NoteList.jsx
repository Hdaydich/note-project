import React, { useState, useContext } from "react";
import { TextCard } from "../../components/TextCard/TextCard";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteNote } from "../../store/note/note-slice";
import s from "./style.module.css";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Modal from "../../shared/components/UIElements/Modal";
import Button from "../../shared/components/FormElements/Button";

export function NoteList(props) {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <React.Fragment>
      {/* <ErrorModal error={error} onClear={clearError} /> */}

      <div className={`row justify-content-center ${s.div}`}>
        {props.noteList.map((note) => {
          return (
            <div key={note.id} className={`col ${s.card_container}`}>
              {auth.isLoggedIn && (
                <TextCard
                  id={note.id}
                  title={note.title}
                  subtitle={note.created_at}
                  content={note.content}
                  onClickTrash={() => props.onDelete(note.id)}
                  onClick={() => navigate("/note/" + note.id)}
                />
              )}
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
}
