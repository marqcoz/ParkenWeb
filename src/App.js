import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import {Modal, Button, Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import "./App.css";

class App extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      isEditProfile: false,
      host:"3.16.52.71",
      //host:"localhost",
      port:"3001",
      show: false,
      idadministrador:"",
      nombre: "",
      apellido: "",
      email: "",
      password: ""
    };

    this.userHasAuthenticated = this.userHasAuthenticated.bind(this);
    this.setInfoAdministrador = this.setInfoAdministrador.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.editProfile = this.editProfile.bind(this);
    this.editProfileOff = this.editProfileOff.bind(this);
  }

  componentDidMount(){
    var newAuth = ('true' === localStorage.getItem("isLogged") );
    console.log(newAuth);
    //var newAuth = localStorage.getItem("isLogged");
    this.setState({isAuthenticated: newAuth});
    this.setState({isAuthenticating:false})
    console.log(this.state.isAuthenticated);
  }

  
  userHasAuthenticated = authenticated => {
    console.log("userHas");
    console.log(authenticated);
    var newAuth = ('true' === authenticated );
    console.log(newAuth);
    this.setState({ isAuthenticated: newAuth});
    localStorage.setItem("isLogged", authenticated);
  }

  editProfileOff(){
    this.setState({isEditProfile: false});
  }

  editProfile() {
    this.setState({isEditProfile: true});
    this.props.history.push("/administradores");
  }

  setInfoAdministrador = (id, nombre, apellido, email, password) => {
    this.setState({ idadministrador: id,
      nombre: nombre,
      apellido: apellido,
      email: email,
      password: password,
      isEditProfile: false
    });
    localStorage.setItem("idadministrador", id);
    localStorage.setItem("nombreadministrador", nombre);
    localStorage.setItem("apellidoadministrador", apellido);
    localStorage.setItem("emailadministrador", email);
    localStorage.setItem("passwordadministrador", password);
  }

  handleLogout() {
    this.userHasAuthenticated('false');
    //localStorage.setItem("isLogged", false);
    this.props.history.push("/login");
    this.setState({show:false});
  }

  handleClose(){
    this.setState({show: false})
  }

  handleShow() {
    this.setState({ show: true });
  }


  render() {

    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      handleLogout : this.handleLogout,
      host: this.state.host,
      port: this.state.port,
      idadministrador: this.state.idadministrador,
      nombre: this.state.nombre,
      apellido: this.state.apellido,
      email: this.state.email,
      password: this.state.password,
      setInfoAdministrador: this.setInfoAdministrador,
      editProfileOff: this.editProfileOff,
      editProfile : this.editProfile,
      isEditProfile : this.state.isEditProfile
    };

    return (
      !this.state.isAuthenticating &&
      <div className="App">
      <div className="Nav">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand >
            <Link to="/">
              <img alt="Parken" src={require("./containers/parkicon.ico")} style={{width:80}}/>
            </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          
          <Navbar.Collapse>
            <Nav pullRight>
            {this.state.isAuthenticated
                ?
                <Fragment>
                <LinkContainer to="/administradores">
                  <NavItem>Administradores</NavItem>
                </LinkContainer>
                <LinkContainer to="/zonasparken">
                  <NavItem>Zonas Parken</NavItem>
                </LinkContainer>
                <LinkContainer to="/supervisores">
                  <NavItem>Supervisores</NavItem>
                </LinkContainer>
                <NavItem onClick={this.handleShow}>Cerrar sesión</NavItem>
              </Fragment>
                : <Fragment>
                    <LinkContainer to="/login">
                      <NavItem>Iniciar sesión</NavItem>
                    </LinkContainer>
                  </Fragment>
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        </div>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Cerrar sesión</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Deseas cerrar la sesión?
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" onClick={this.handleClose}>Cancelar</Button>
            <Button bsStyle="danger" onClick={this.handleLogout}>Cerrar sesión</Button>
          </Modal.Footer>
        </Modal>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);