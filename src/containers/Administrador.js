import React, { Component } from "react";
import {Modal, Button, PageHeader, FormGroup, FormControl, ControlLabel, ListGroup, ListGroupItem } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import axios from 'axios';
import "./Administrador.css";

export default class Administrador extends Component {
  constructor(props) {
    super(props);

  this.state = {
    url : this.props.host + ":" +  this.props.port,
    isLoading: true,
    isAddingAdmins: false,
    isConnected: false,
    thereAdmins: true,
    isEditing: false,
    isDeleted: false,
    title:"",
    notes: [],
    persons: [],

    idadministrador: "",
    nombre : "",
    apellido: "",
    email: "",
    password: "",
    repassword: "",

    show: false
  };

  this.deleteAdmin = this.deleteAdmin.bind(this);
  this.setEdit = this.setEdit.bind(this);
  this.handleClose = this.handleClose.bind(this);
  this.showAlert = this.showAlert.bind(this);
  this.handleAction1 = this.handleClose.bind(this);
  this.handleAction2 = this.handleAction2.bind(this);
}

componentDidMount() {
  if(this.props.isEditProfile){
    this.setState({isEditing: true});
    this.setState({title: "Editar administrador"});
    this.setState({nombre: localStorage.getItem("nombreadministrador")}); 
    this.setState({apellido: localStorage.getItem("apellidoadministrador")}); 
    this.setState({email: localStorage.getItem("emailadministrador") }); 
    this.setState({password: localStorage.getItem("passwordadministrador")}); 
    this.setState({repassword: localStorage.getItem("passwordadministrador")}); 
    this.setState({idadministrador: localStorage.getItem("idadministrador")}); 
   this.setState({isAddingAdmins: true});
   this.setState({isLoading : false})
   this.setState({isConnected : true})
  }else{
    this.gettingAdministradores();
  }
}

async gettingAdministradores(){
  await axios.get('http://'+this.state.url+'/administrador/obtenerAdministradores')
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

handleClose(){
  this.setState({show: false})
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
  //alert("Se eliminará al administrador " + id);
  //Confirmacion con un popup o alerta

    var self = this;
    var payload = { data: {
      "idadministrador": id
    }}
    axios.delete('http://'+this.state.url+'/administrador/eliminarAdministrador', payload)
    .then(res => {
      const persons = res.data;
      console.log(persons);
      if(persons.success === 1){
        //alert("Se eliminó el administrador.");
        self.showAlert("Administrador eliminado",
         "Se eliminó al administrador correctamente.",
         true, "info", "OK",
         false, "", "");
        self.setNoAddingAdmins();
      }else if(persons.success === 2){
          //alert("No es posible eliminar al administrador. Debe estar registrado al menos uno en el sistema.");
          self.showAlert("Error al eliminar administrador",
         "Debe estar registrado al menos un administrador en el sistema.",
         true, "info", "OK",
         false, "", "");
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

showAlert(title, body, btn1, style1, tBtn1, btn2, style2, tBtn2, data){
  this.setState({
    show: true,
    titleAlert: title,
    bodyAlert: body,
    button1: btn1,
    styleAlert1: style1,
    titleButtonAlert1: tBtn1,
    button2: btn2,
    styleAlert2: style2,
    titleButtonAlert2: tBtn2,
  });
  if(title === "Eliminar administrador"){
    this.setState({idadministrador: data});
  }

}

handleAction2(){
  if(this.state.titleAlert === "Eliminar administrador"){
    this.deleteAdmin(this.state.idadministrador);
  }
  this.setState({show: false});
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
  this.gettingAdministradores();
  this.setState({isAddingAdmins: false, isConnected: true});
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
        await axios.post('http://'+this.state.url+'/administrador/editarAdministrador', payload)
        .then(function (response) {
          
            if(response.data.success === 1){
                //alert("Se modificó el perfil del administrador exitosamente.");
                self.showAlert("Administrador modificado",
       "Se modificó el perfil del administrador correctamente.",
       true, "info", "OK",
       false, "", "");
                self.setState({isEditing: false});
                self.setState({isAddingAdmins:false});
                self.setNoAddingAdmins();
                console.log("ALERTE");
                console.log(response.data.id);
                console.log(localStorage.getItem("idadministrador"));
                if(response.data.id === localStorage.getItem("idadministrador")){
                  localStorage.getItem("Entro");
                  this.props.setInfoAdministrador(response.data.id, response.data.nombre, response.data.apellido, response.data.email, response.data.password);
                }
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

        await axios.post('http://'+this.state.url+'/administrador/agregarAdministrador', payload)
      .then(function (response) {
        
          if(response.data.success === 1){
              //alert("Administrador agregado exitosamente.");
              self.showAlert("Nuevo administrador",
       "Se agregó al administrador correctamente.",
       true, "info", "OK",
       false, "", "");
              self.setNoAddingAdmins();

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
    <PageHeader className="tit">{this.state.title}</PageHeader>
    
      <form className="Formulario" onSubmit={this.handleSubmit}>
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
  return (
    <div className="list">
    {[{}].concat(notes).map((note, i) =>
      i !== 0 ? 
        <ListGroupItem header={note.nombre.trim() + ' ' + note.apellido}>
          <div>{note.correo}</div>
             <div className='btn-group ml-auto'>
              <button className='delete btn btn-success' 
              onClick={this.setEdit.bind(this, note)}>
              Editar
              </button>
              <button className='delete btn btn-danger' 
              onClick={
                this.showAlert.bind(this,"Eliminar administrador",
                "¿Estás seguro de eliminar al administrador?",
                true, "info", "Cancelar",
                true, "danger", "Eliminar", note.id)
              }>
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
  )}</div>);
  
}

renderLander() {
  return (
      <div className="load">
              <h4>
                Cargando administradores...
              </h4>
      </div>
  );
}


renderNotes() {
  return (
    <div className="Administrador">
      <PageHeader className="tit">Administradores</PageHeader>
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
    
    <Modal show={this.state.show} onHide={this.handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>{this.state.titleAlert}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    {this.state.bodyAlert}
    </Modal.Body>
    <Modal.Footer>
      {this.state.button1 ? 
            <Button bsStyle={this.state.styleAlert1} onClick={this.handleAction1}>{this.state.titleButtonAlert1}</Button>:
            <div></div>
          }
      {this.state.button2 ? 
      <Button bsStyle={this.state.styleAlert2} onClick={this.handleAction2}>{this.state.titleButtonAlert2}</Button>:
            <div></div>
          }

    </Modal.Footer>
  </Modal>
  </div>
  );
}
}