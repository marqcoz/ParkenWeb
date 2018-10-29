import React, { Component } from "react";
import {PageHeader, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import axios from 'axios';
import "./NuevoAdmin.css";

export default class NuevoAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      nombre : "",
      apellido: "",
      email: "",
      password: "",
      repassword: ""
    };
  }

  validateForm() {
    return this.state.email.length > 0 && 
    this.state.password.length > 0 && 
    this.state.nombre.length > 0 && 
    this.state.apellido.length > 0 &&
    this.state.repassword.length > 0; 

  }

  validatePassword(){
    if(this.state.password === this.state.repassword){
      return true;
    }else{
      return false;
    } 
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    console.log(this.validatePassword);
    if(!this.validatePassword()){
      alert("Las contraseñas no coinciden");
      this.setState({ isLoading: false });
      return;
    }
  
    try {
  
        var payload={
            "correo":this.state.email,
            "contrasena":this.state.password,
            "nombre": this.state.nombre,
            "apellido": this.state.apellido
        }

        var self = this;

        await axios.post('http://localhost:3000/administrador/agregarAdministrador', payload)
        .then(function (response) {
            console.log(response);
            console.log(response.data.success);
            if(response.data.success === 1){
                console.log("SignUp successfull");
                alert("Administrador agregado exitosamente.")
                self.props.history.push("/");
            }
            else if(response.data.success === 2){
                console.log("Username password do not match");
                alert("Error al agregar administrador")
            }
            else{
                console.log("Username does not exists");
                alert("Error al agregar administrador")
        }
        })
        .catch(function (error) {
        console.log(error);
        alert(error.message);
        });
        this.setState({ isLoading: false });

        
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  }

  render() {
    return (
      <div className="NuevoAdmin">
      <PageHeader>Agregar administrador</PageHeader>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="nombre" bsSize="large">
            <ControlLabel>Nombre</ControlLabel>
            <FormControl
              value={this.state.nombre}
              onChange={this.handleChange}
              type="text"
            />
          </FormGroup>
          <FormGroup controlId="apellido" bsSize="large">
            <ControlLabel>Apellidos</ControlLabel>
            <FormControl
              value={this.state.apellido}
              onChange={this.handleChange}
              type="text"
            />
          </FormGroup>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Correo electrónico</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Contraseña</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <FormGroup controlId="repassword" bsSize="large">
            <ControlLabel>Repite contraseña</ControlLabel>
            <FormControl
              //value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>

          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Agregar administrador"
            loadingText="Agregando..."
          />
        </form>
      </div>
    );
  }
}