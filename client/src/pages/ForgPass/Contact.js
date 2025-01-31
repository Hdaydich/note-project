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
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const Contact =  () => {


  const navigate =useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  
    const [isShow, setisShow] = useState(false);
    const [isConf, setisConf] = useState(false);
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
    // console.log(url);

    let userFound = null;
    try {
       userFound = await sendRequest(url);

    } catch (err) {}

    if(userEmail!=="")
    {
      
      if(userFound !==null)
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
        setisConf(true);
        console.log('Email sent successfully!');
        setTimeout(() => {
          navigate("/");
        }, 1000);

      }).catch((err) => {

        console.error('Failed to send email. Error:', err);
      });

      } else {
        console.log("NO data ! ");
        setisShow(true);
      }
    }

  };



  return (
    <React.Fragment>  
      
      {isLoading && <LoadingSpinner asOverlay />}
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
        {isShow && <p className={s.link}> Invalid credentials! </p>}
        {isConf && <p className={s.linkVal}> Done! Check your e-mail :) </p>}
        </div>
    </React.Fragment>
    
  );
  }
export default Contact;
