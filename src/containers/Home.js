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

  this.irAEditar = this.irAEditar.bind(this);
}

  componentDidMount(){
    if(localStorage.getItem("isLogged") === "false"){
      this.props.history.push("/login");
    }
  }

  irAEditar(){
    this.props.setEditProfile();
    this.props.history.push("/administradores");
  }
  render() {
    return (
      <div className="Home">
      <form onSubmit={this.handleSubmit}>
      <div className="tituloHome">Perfil
      <div>
      <img alt="Logo administrador" src={require("./ic_user-web.png")} style={{width:150}}/>
      </div>
      </div>
      <div className="subtituloHome">
      {localStorage.getItem("nombreadministrador")}{"\n"}
      {localStorage.getItem("apellidoadministrador")}{"\n"}
      {localStorage.getItem("emailadministrador")}{"\n"}
      </div>
      
        <div className="subtituloHome">
        <Button bsStyle="success" onClick={this.irAEditar}>Editar</Button>
        </div>
      </form>
    </div>
    );
  }
}