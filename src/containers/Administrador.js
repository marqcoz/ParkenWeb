import React, { Component } from "react";
import {PageHeader, FormGroup, FormControl, ControlLabel, ListGroup, ListGroupItem } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import axios from 'axios';
import "./Administrador.css";

export default class Administrador extends Component {
  constructor(props) {
    super(props);

  this.state = {
    isLoading: true,
    isAddingAdmins: false,
    isConnected: false,
    thereAdmins: true,
    isEditing: false,
    title:"",
    notes: [],
    persons: [],

    idadministrador: "",
    nombre : "",
    apellido: "",
    email: "",
    password: "",
    repassword: ""
  };

  this.deleteAdmin = this.deleteAdmin.bind(this);
  this.setEdit = this.setEdit.bind(this);
}

componentDidMount() {

  axios.get('http://localhost:3000/administrador/obtenerAdministradores')
 .then(res => {
   const persons = res.data;
   console.log(persons);
   if(persons.success === 2){
    this.setState({isLoading : false})
    this.setState({isConnected : false})

   }else{
    this.setState({ persons });
    this.setState({isLoading : false})
    this.setState({isConnected : true})
   }
   
 }).catch(error => {
  alert(error.message);
  this.setState({isLoading : false})
  this.setState({isConnected : false})
});
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

setEdit(admin){
  this.setState({isEditing: true});
  this.setState({title: "Editar administrador"});
  this.setState({nombre: admin.nombre}); 
  this.setState({apellido: admin.apellido}); 
  this.setState({email: admin.correo }); 
  this.setState({password: admin.contrasena}); 
  this.setState({repassword: admin.contrasena}); 
  this.setState({idadministrador: admin.id}); 
 this.setState({isAddingAdmins: true});
}

deleteAdmin(id){
  alert("Se eliminará al administrador " + id);
  //Confirmacion con un popup o alerta
  var payload = { data: {
    "idadministrador": id
  }}
  axios.delete('http://localhost:3000/administrador/eliminarAdministrador', payload)
  .then(res => {
    const persons = res.data;
    console.log(persons);
    if(persons.success === 1){
      alert("Se eliminó el administrador.");
    }else if(persons.success === 2){
        alert("No es posible eliminar al administrador. Debe estar registrado al menos uno en el sistema.");
    }else{
      alert("Error al eliminar administrador.");
    }
    //this.setState({ persons });
    this.setState({isLoading : false})
    this.setState({isConnected : true})
  }).catch(error => {
   alert(error.message);
   this.setState({isLoading : false})
   this.setState({isConnected : false})
 });

}

setAddingAdmins = event => {


  this.setState({nombre: ""}); 
  this.setState({apellido: ""}); 
  this.setState({email: "" }); 
  this.setState({password: ""}); 
  this.setState({repassword: ""}); 
  this.setState({idadministrador: ""}); 
  this.setState({title: "Agregar administrador"});
  this.setState({isAddingAdmins: true});
}

setNoAddingAdmins = event => {
  this.setState({isAddingAdmins: false});
}

handleChange = event => {
  this.setState({
    [event.target.id]: event.target.value
  });
}


handleSubmit = async event => {
  event.preventDefault();

  this.setState({ isLoading: true });

  if(!this.validatePassword()){
    alert("Las contraseñas no coinciden");
    this.setState({ isLoading: false });
    return;
  }

  try {

      var payload={
        "idadministrador": this.state.idadministrador,
          "correo":this.state.email.trimLeft().trimRight(),
          "contrasena":this.state.password,
          "nombre": this.state.nombre.trimLeft().trimRight(),
          "apellido": this.state.apellido.trimLeft().trimRight()
      }

      var self = this;

      if(this.state.isEditing){
        //Se editará el administrador
        await axios.post('http://localhost:3000/administrador/editarAdministrador', payload)
        .then(function (response) {
          
            if(response.data.success === 1){
                alert("Se modificó el perfil del administrador exitosamente.");
                self.setState({isEditing: false});
                self.setState({isAddingAdmins:false});
                self.props.history.push("/administradores");
            }
            else if(response.data.success === 2){
              alert("Error al modificar el perfil del administrador.");
            }
            else{
              if(response.data.success === 0 || response.data.error === 2)
                alert("Error al modificar el perfil del administrador.");
              else
                alert("Error al modificar el perfil del administrador.");
        }
        })
        .catch(function (error) {
            alert(error.message);
        });
        this.setState({ isLoading: false });
        this.setState({isConnected: true});

      }else{

        await axios.post('http://localhost:3000/administrador/agregarAdministrador', payload)
      .then(function (response) {
        
          if(response.data.success === 1){
              alert("Administrador agregado exitosamente.");
              self.setNoAddingAdmins();
              self.props.history.push("/administradores");
          }
          else if(response.data.success === 2){
            alert("Error al agregar administrador.");
          }
          else{
            if(response.data.success === 0 && response.data.error === 2)
              alert("El correo electrónico ya está registrado.");
            else
              alert("Error al agregar administrador.");
      }
      })
      .catch(function (error) {
          alert(error.message);
      });
      this.setState({ isLoading: false });


      }
  } catch (e) {
    alert(e.message);
    this.setState({ isLoading: false });
  }
}

renderAddAdministrador() {
  return (
    <div className="Administrador" >
    <PageHeader>{this.state.title}</PageHeader>
      <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="nombre" bsSize="short">
          <ControlLabel>Nombre</ControlLabel>
          <FormControl
           autoFocus
            value={this.state.nombre}
            onChange={this.handleChange}
            type="text"
          />
        </FormGroup>
        <FormGroup controlId="apellido" bsSize="short">
          <ControlLabel>Apellidos</ControlLabel>
          <FormControl
            value={this.state.apellido}
            onChange={this.handleChange}
            type="text"
          />
        </FormGroup>
        <FormGroup controlId="email" bsSize="short">
          <ControlLabel>Correo electrónico</ControlLabel>
          <FormControl
            type="email"
            value={this.state.email.trim()}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="short">
          <ControlLabel>Contraseña</ControlLabel>
          <FormControl
            value={this.state.password}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <FormGroup controlId="repassword" bsSize="short">
          <ControlLabel>Repite contraseña</ControlLabel>
          <FormControl
            value={this.state.repassword}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>

        <LoaderButton className='btn btn-primary'
          block
          bsSize="large"
          disabled={!this.validateForm()}
          type="submit"
          isLoading={this.state.isLoading}
          text={this.state.title}
          loadingText="Procesando..."
        />
      </form>
    </div>
  );
}

renderNotesList(notes) {
  return [{}].concat(notes).map(
    (note, i) =>
      i !== 0
        ? <ListGroupItem header={note.nombre.trim() + ' ' + note.apellido}>

<div>{note.correo}</div>
             
             <div className='btn-group ml-auto'>
              <button className='delete btn btn-success' 
              onClick={this.setEdit.bind(this, note)}>Editar</button>
              
              <button className='delete btn btn-danger' 
              onClick={this.deleteAdmin.bind(this, note.id)}>
              Eliminar
              </button>
              </div>
            
             </ListGroupItem>
        : 
            <ListGroupItem onClick={this.setAddingAdmins}>
              <h4>
                <b>{"\uFF0B"}</b> Agregar administrador

              </h4>
            </ListGroupItem>
  );
}

renderLander() {
  return (
    <div className="Administrador">
      <h1>Parken</h1>
      <ListGroupItem onClick={this.setAddingAdmins}>
              <h4>
                <b>{"\uFF0B"}</b> Agregar administrador

              </h4>
            </ListGroupItem>
    </div>
  );
}


renderNotes() {
  return (
    <div className="Home">
      <PageHeader>Administradores</PageHeader>
      <ListGroup>
        {!this.state.isLoading && this.renderNotesList(this.state.persons)}
      </ListGroup>
    </div>
  );
}

render() {

  return (
    <div className="Administrador">
    {this.props.isAuthenticated ? 
    (this.state.isAddingAdmins ? this.renderAddAdministrador() : (this.state.isConnected ? this.renderNotes():this.renderLander())):
    this.props.history.push("/login")}
    </div>
  );
}
}