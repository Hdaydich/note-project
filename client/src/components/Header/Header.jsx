import s from "./style.module.css";
import React, { useContext } from "react";
import { ButtonPrimary } from "../ButtonPrimary/ButtonPrimary";
import { Logo } from "../Logo/Logo";
import { useNavigate } from "react-router-dom";
import note from "../../assets/images/note.png";
import {
  ClipboardPlus,
  ToggleOn,
  DoorOpen,
  PlusCircleFill,
} from "react-bootstrap-icons";
import { AuthContext } from "../../shared/context/auth-context";
export function Header({ buttonText, buttonAction }) {
  const navigate = useNavigate();

  const auth = useContext(AuthContext);

  return (
    <div className={`row ${s.container}`}>
      <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 ${s.divLogo}">
        <Logo
          onClick={() => navigate("/")}
          subtitle="Manage your notes"
          image={note}
        />
      </div>
      <div className={`col-xs-12 col-sm-8 col-md-8 col-lg-8  ${s.buttonCont}`}>
        <ToggleOn onClick={auth.logout} size={40} className={s.off}>
          {/* <span className={s.add}>Log out</span> */}
        </ToggleOn>
        <PlusCircleFill size={30} className={s.add} onClick={buttonAction} />
        <p className={s.p}>Add note</p>
      </div>
    </div>
  );
}
