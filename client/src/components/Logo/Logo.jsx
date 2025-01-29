import { Col, Container, Row } from "react-bootstrap";
import s from "./style.module.css";
export function Logo({ image, subtitle, onClick }) {
  return (
    <div>
      <div onClick={onClick} className={s.container}>
        <img className={s.img} src={image} alt="logo" />
      </div>
      <div className={s.subtitle}>{subtitle}</div>
    </div>
  );
}
