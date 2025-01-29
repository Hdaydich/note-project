import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { Header } from '../../components/Header/Header';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import s from "./style.module.css";

export function UpdateNote() {

  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedNote, setLoadedNote] = useState();
  const noteId = useParams().noteId;


    const [formState, inputHandler, setFormData] = useForm(
      {
        title: {
          value: '',
          isValid: false
        },
        content: {
          value: '',
          isValid: false
        }
      },
      false
    );
    const navigate = useNavigate();

  useEffect(() => {
    const fetchNote= async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +`/notes/${noteId}`
        );
        setLoadedNote(responseData.note);
        

        setFormData(
          {
            title: {
              value: responseData.note.title,
              isValid: true
            },
            content: {
              value: responseData.note.content,
              isValid: true
            }
          },
          true
        );

      } catch (err) {}
    };
    fetchNote();
  }, [sendRequest, noteId, setFormData]);

  const noteUpdateSubmitHandler = async event => {

    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/notes/${noteId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          content: formState.inputs.content.value
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      navigate('/' );
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner className={s.loadingS}/> 
      </div>
    );
  }

  if (!loadedNote && !error) {
    return (
      <div className="center">
        <div>
          <h2>Could not find place!</h2>
        </div>
      </div>
    );
}


  return (
    <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
      <Header
              buttonText={"NEW NOTE +"}
              buttonAction={() => navigate("/note/new")}
            ></Header>
            
        {isLoading && <LoadingSpinner asOverlay />}

        {!isLoading && loadedNote && (
         <form className="container" onSubmit={noteUpdateSubmitHandler}>
        <h2 className="h2">Update note</h2>
        
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
          initialValue={loadedNote.title}
          initialValid={true}
        />
        <Input
          id="content"
          element="textarea"
          label="Content"
          validators={[VALIDATOR_MINLENGTH(7)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
          initialValue={loadedNote.content}
          initialValid={true}
        />
        <Button  type="submit" disabled={!formState.isValid}>
           Confirm
        </Button>
      </form>
        )}
       
    </React.Fragment>
  );
};
