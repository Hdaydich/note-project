import React, { useContext,  } from 'react';
import { useNavigate } from "react-router-dom";
import { Header } from '../../components/Header/Header';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import "./newNote.css";

const NewNote = () => {
  
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
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

  const noteSubmitHandler = async event => {
    
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/notes`,
        'POST',
        JSON.stringify({
          title: formState.inputs.title.value,
          content: formState.inputs.content.value,
          created_at: new Date().toLocaleDateString(),
        }),
        { 'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
      }
      );
      navigate('/');
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Header
              buttonText={"NEW NOTE +"}
              buttonAction={() => navigate("/note/new")}
            ></Header>
            
        {isLoading && <LoadingSpinner className="loadingS" asOverlay />}
      <form className="container" onSubmit={noteSubmitHandler}>
        <h2 className="h2">Create a new note</h2>
        
        {/* <h3 className="h3">Title</h3> */}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        {/* <h3 className="h3">Content</h3> */}
        <Input
          id="content"
          element="textarea"
          label="Content"
          validators={[VALIDATOR_MINLENGTH(7)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Button  type="submit" disabled={!formState.isValid}>
          <span className='buttonSpan'> ADD NOTE </span>
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewNote;
