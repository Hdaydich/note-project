import React, { useEffect, useState } from 'react';
import emailjs from 'emailjs-com';
import { useHttpClient } from "../../shared/hooks/http-hook";
import s from "./style.module.css";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_EMAIL,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { Logo } from "../../components/Logo/Logo";
import note from "../../assets/images/note.png";
import { useNavigate } from 'react-router-dom';

const Contact =  () => {


  const navigate =useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
    },
    false
  );


  const handleSubmit = async(e) => {

    e.preventDefault();
    const userEmail = formState.inputs.email.value.toLowerCase();    
    const url=`${process.env.REACT_APP_BACKEND_URL}/users/${userEmail}`;
    console.log(url);

    let userFound;
    try {
       userFound = await sendRequest(url);

    } catch (err) {}

      console.log(userFound);
      console.log(userFound.email);
      console.log(userFound.pwd);
      console.log(userFound.name);

    if(userEmail!=="")
    {
      
      if(userFound)
      {
        const notification= {
          name: userFound.name,
          email: userFound.email,
          message: 'Your password is : '+userFound.pwd,
          message2: ''
        };
      // setFormData({email:user.email , message: "your password is : "+user.pwd});
      
      emailjs.send(
        'my_gmail',
        'template_sznzcdc',
        notification,
        'M4iQvBryW-wgb5pKz'
      ).then((response) => {
        
        console.log('Email sent successfully!');
          navigate("/");

      }).catch((err) => {

        console.error('Failed to send email. Error:', err);
      });

      } else {
        console.log("NO data ! ");
      }
    }

  };



  return (
    <React.Fragment>  
      <div className="authentication">
      <div >
        <Logo
          subtitle="Manage your notes"
          image={note}
        />
      </div>
        <form onSubmit={handleSubmit} className={s.container}>
            <br></br>
            <div>
            <Input   
              element="input"
              id="email"
              type="email"
              label="E-Mail"
              validators={[VALIDATOR_EMAIL()]}
              errorText="Please enter a valid email address."
              onInput={inputHandler}
             />
            </div>
        <Button type="submit" > Envoyer </Button>
        </form>
        </div>
    </React.Fragment>
    
  );
  }
export default Contact;
