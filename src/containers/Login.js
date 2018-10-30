import React, { Component } from "react";
import {Button, FormGroup, Alert, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import axios from 'axios';
import "./Login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url : this.props.host + ":" +  this.props.port,
      isLoading: false,
      email: "",
      password: "",

      isAlert: false,
      styleAlert : "warning",
      titleAlert: "",
      textAlert: ""
    };
  }

  componentDidMount(){
    if(localStorage.getItem("isLogged") === "true"){
      this.props.history.push("/");
    }
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }


  handleSubmit = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
  
        var payload={
        "correo":this.state.email,
        "contrasena":this.state.password,
        "app":"3"
        }

        var self = this;
        

        await axios.post('http://'+this.state.url+'/login', payload)
        .then(function (response) {
        console.log(response);
        console.log(response.data.success);
        if(response.data.success === 1){
        console.log("Login successfull");
        self.setState({isAlert:true, styleAlert:"success", titleAlert: "Bienvenido", textAlert:""});
        self.props.userHasAuthenticated('true');
        self.props.setInfoAdministrador(response.data.id, response.data.Nombre, response.data.Apellido, response.data.Email, response.data.Contrasena);
        self.props.history.push("/");
        }
        else if(response.data.success === 2){
        console.log("Username password do not match");
        //alert("username password do not match")
        self.setState({isAlert:true, styleAlert:"danger", titleAlert: "Error: ", textAlert: "Correo o contraseña incorrecta."});
        }
        else{
        console.log("Username does not exists");
        //alert("Username does not exist");
        self.setState({isAlert:true, styleAlert:"danger", titleAlert: "Error: ", textAlert: "No hay conexión con el servidor."});
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
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
        <div className="tituloLogin">Bienvenido administrador</div>
        <div className="subtituloLogin">Inicia sesión</div>
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
          {this.state.isAlert ?
          <Alert bsStyle={this.state.styleAlert}>
            <strong>{this.state.titleAlert}</strong>         
            {this.state.textAlert}
          </Alert> : <div></div> }
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text="Iniciar sesión"
            loadingText="Iniciando…"
          />
          <div className="subtituloLogin">
          <Button bsStyle="link">Recuperar contraseña</Button>
          </div>
        </form>
      </div>
    );
  }
}