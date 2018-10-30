import React, { Component } from "react";
import {Button, Image} from "react-bootstrap";
import "./Home.css";

export default class Home extends Component {

  constructor(props) {
    super(props);

  this.state = {
    id: this.props.idadministrador,
    nombre : this.props.nombre,
    apellido: this.props.apellido,
    email: this.props.email,
    password: this.props.password
    
  };
}

  componentDidMount(){
    if(localStorage.getItem("isLogged") === "false"){
      this.props.history.push("/login");
    }
  }
  render() {
    return (
      <div className="Home">
      <form onSubmit={this.handleSubmit}>
      <div className="tituloHome">Bienvenido {localStorage.getItem("nombreadministrador")}
      <img alt="Logo administrador" src={require("./ic_user-web.png")} style={{width:80}}/>
      </div>
      <div className="subtituloHome">Perfil</div>
      <div className="subtituloHome">{localStorage.getItem("nombreadministrador")}</div>
      <div className="subtituloHome">{localStorage.getItem("apellidodministrador")}</div>
      <div className="subtituloHome">{localStorage.getItem("emailadministrador")}</div>
      <div className="subtituloHome">{localStorage.getItem("passwordadministrador")}</div>
        <div className="subtituloHome">
        <Button bsStyle="success">Editar</Button>
        </div>
      </form>
    </div>
    );
  }
}