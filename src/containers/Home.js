import React, { Component } from "react";
import {Button} from "react-bootstrap";
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
      <div className="tituloHome">Bienvenido administrador</div>
      <div className="subtituloHome">Perfil</div>
      <div className="subtituloHome">{this.state.nombre}</div>
      <div className="subtituloHome">{this.state.apellido}</div>
      <div className="subtituloHome">{this.state.email}</div>
      <div className="subtituloHome">{this.state.password}</div>
        <div className="subtituloHome">
        <Button bsStyle="success">Editar</Button>
        </div>
      </form>
    </div>
    );
  }
}