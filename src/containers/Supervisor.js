import React, { Component } from "react";
import {Modal, Button, PageHeader, FormGroup, FormControl, ControlLabel, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import LoaderButton from "../components/LoaderButton";
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import axios from 'axios';
import "./Supervisor.css";

export default class Supervisor extends Component {
  constructor(props) {
    super(props);

  this.state = {
    url : this.props.host + ":" +  this.props.port,
    isLoading: true,
    isAddingSupers: false,
    isShowingInfo: false,
    isConnected: false,
    thereSupers: true,
    isEditing: false,
    title:"",
    supers:[],
    idsupervisor: "",
    nombre : "",
    apellido: "",
    email: "",
    password: "",
    repassword: "",
    celular: "",
    subcelular:"",
    direccion: "",
    estatus: "INACTIVO",
    zona: "",
    zonasparken: [],
    show: false,
    showLoading: false, 
    isFromZone: false
  };

  this.deleteSuper = this.deleteSuper.bind(this);
  this.setEdit = this.setEdit.bind(this);
  this.setAddingSupers = this.setAddingSupers.bind(this);
  this.handleChangeCel = this.handleChangeCel.bind(this);
  this.gettingZonasParken = this.gettingZonasParken.bind(this);
  this.infoSuper = this.infoSuper.bind(this);
  this.gettingSupervisoresXZona = this.gettingSupervisoresXZona.bind(this);
  this.showAlert = this.showAlert.bind(this);
  this.handleClose = this.handleClose.bind(this);
  this.handleCloseLoading = this.handleCloseLoading.bind(this);
  this.handleAction1 = this.handleClose.bind(this);
  this.handleAction2 = this.handleAction2.bind(this);
  this.isValidPhoneNumberMarcos = this.isValidPhoneNumberMarcos.bind(this);
  
}

componentDidMount() {
  if(this.props.isAuthenticated){
    this.verificarAdmin();
  }
  if(this.props.isAddSuper){
    this.setAddingSupers();
    this.setState({zonasparken: [{id: this.props.idzonaparken, nombre: this.props.nombrezonaparken}],
    isFromZone: true})
    this.props.addSuperOff();
  }else{
    this.gettingSupervisoresXZona(0);
  }
}

handleClose(){
  this.setState({show: false})
}

handleCloseLoading(){
  this.setState({showLoading: false})
}

handleAction2(){
  if(this.state.titleAlert === "Eliminar supervisor"){
    this.deleteSuper(this.state.idsupervisor);
  }
  this.setState({show: false});
}

async gettingSupervisoresXZona(zona){
  var idzona = zona.toString();
  var self = this;
  var url = 'http://'+this.state.url+'/administrador/obtenerSupervisoresXZona?idzona=' + idzona;
  this.setState({showLoading: true});
  await axios.get(url)
    .then(res => {
      self.setState({showLoading: false});
      const supers = res.data.supervisores;
      console.log(supers);
      if(supers.success === 2){
        this.setState({isLoading : false})
        this.setState({isConnected : false})

      }else{
        this.setState({supers});
        this.setState({isLoading : false})
        this.setState({isConnected : true})
      }
      
      
}).catch(error => {
  self.setState({showLoading: false});
alert(error.message);
this.setState({isLoading : false})
this.setState({isConnected : false})

});
}

isValidPhoneNumberMarcos(number){
  return number.length === 10;
}

validateForm() {

  return this.state.email.length > 0 && 
  this.state.password.length > 0 && 
  this.state.nombre.length > 0 && 
  this.state.apellido.length > 0 &&
  this.state.repassword.length > 0 &&
  this.state.direccion.length > 0 && 
  this.state.celular != null; 
}

validateZonaInput(){
  return this.state.isShowingInfo || this.state.isFromZone;
}

validatePassword(){
  if(this.state.password === this.state.repassword){
    return true;
  }else{
    return false;
  } 
}

setEdit(supervisor){
  this.setState({title: "Editar supervisor"});
  this.setState({nombre: supervisor.nombre}); 
  this.setState({apellido: supervisor.apellido}); 
  this.setState({email: supervisor.email }); 
  this.setState({celular: supervisor.celular});
  this.setState({subcelular: supervisor.celular});
  this.setState({password: supervisor.contrasena}); 
  this.setState({repassword: supervisor.contrasena});
  this.setState({direccion: supervisor.direccion}); 
  this.setState({idsupervisor: supervisor.id}); 
  this.setState({zonasparken: [{id: supervisor.zonaparken, nombre: supervisor.nombrezonaparken}]})
 this.setState({isAddingSupers: true});
 this.setState({isEditing: true});
  this.setState({isShowingInfo: false}); 
}


deleteSuper(id){
  //alert("Se eliminará al administrador " + id);
  //Confirmacion con un popup o alerta
  var self = this;
  var payload = { data: {
    "idsupervisor": id
  }}
  this.setState({showLoading: true});
  axios.delete('http://'+this.state.url+'/administrador/eliminarSupervisor', payload)
  .then(res => {
    self.setState({showLoading: false});
    const supervisor = res.data;
    console.log(supervisor);
    if(supervisor.success === 1){
      //alert("Se eliminó el administrador.");
      self.showAlert("Supervisor eliminado",
         "Se eliminó al administrador correctamente.",
         true, "info", "OK",
         false, "", "");
      self.gettingSupervisoresXZona(0);
      self.setState({isAddingSupers:false, isConnected: true});
    }else if(supervisor.success === 2){
        if(supervisor.error === '0'){
            //alert("No se puede eliminar al supervisor, debe existir al menos un supervisor en la zona Parken.");    
            self.showAlert("Error al eliminar supervisor",
            "Debe existir al menos un supervisor en cada zona Parken.",
            true, "info", "OK",
            false, "", "");
            self.setState({isAddingSupers:false, isConnected: true});
        }else{
            if(supervisor.error === '5'){
                //alert("No se puede eliminar al supervisor, tiene reportes pendientes.");
                self.showAlert("Error al eliminar supervisor",
                "El supervisor tiene reportes pendientes.",
                true, "info", "OK",
                false, "", "");
      
            }else{
                //alert("Error al eliminar administrador.");
                self.showAlert("Error al eliminar supervisor",
                "Ocurrió un error con el servidor.",
                true, "info", "OK",
                false, "", "");
            }
        }
    }else{
      //alert("Error al eliminar administrador.");
      self.showAlert("Error 501",
        "Error al eliminar supervisor",
        true, "info", "OK",
        false, "", "");
    }
    //this.setState({ persons });
    self.setState({isLoading : false})
    self.setState({isConnected : true})

  }).catch(error => {
    self.setState({showLoading: false});
   alert(error.message);
   this.setState({isLoading : false})
   this.setState({isConnected : false})
 });

}

setAddingSupers = event => {
  this.setState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    repassword: "",
    idsupervisor: "",
    celular: "",
    direccion: "",
    estatus: "",
});     
    //this.gettingZonasParken();
  this.setState({title: "Agregar supervisor",
   isAddingSupers: true, 
   isShowingInfo: false,
  isEditing: false});
}

setNoAddingAdmins = event => {
  this.setState({isAddingSupers: false});
  if(this.state.isFromZone){
    //this.gettingZonasParken();
    this.setState({isFromZone: false});
    this.props.history.push("/zonasparken");
    
  }
}

async gettingZonasParken(){
var url = 'http://'+this.state.url+'/administrador/obtenerZonasParkenID';
 await axios.get(url)
 .then(res => {
   const zonasparken = res.data;
   console.log(zonasparken);
   if(zonasparken.success === 2){
    this.setState({isLoading : false})
    this.setState({isConnected : false})

   }else{
    this.setState({ zonasparken: zonasparken.zonasParken });
    this.setState({isLoading : false})
    this.setState({isConnected : true})
   }
   
 }).catch(error => {
  alert(error.message);
  this.setState({isLoading : false})
  this.setState({isConnected : false})
});
}

handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
          });
    
  
}

handleChangeCel(event) {

    if(isNaN(event.target.value)){
      this.setState({
        [event.target.id]: 1
      });
      return;
    }
  
  }

handleSubmit = async event => {
  event.preventDefault();

  this.setState({ isLoading: true });

  if(!this.validatePassword()){
    //alert("Las contraseñas no coinciden");
    this.showAlert("Atención",
         "Las contraseñas no coinciden",
         true, "info", "OK",
         false, "", "");
    this.setState({ isLoading: false });
    return;
  }

  if(this.state.celular == null){
    this.setState({ isLoading: false });
    //alert("Ingrese el número celular");
    this.showAlert("Atención",
    "Ingrese el número celular",
    true, "info", "OK",
    false, "", "");
      return;
  }
console.log(this.state.celular);
  if(!isValidPhoneNumber(this.state.celular)){
    console.log(this.state.celular);
    this.setState({ isLoading: false });
    //alert("Número celular no válido");
    this.showAlert("Atención",
    "Número celular no válido",
    true, "info", "OK",
    false, "", "");
    
      return;
  }

  /*
  if(this.state.subcelular != null && this.state.subcelular.substring(3) === this.state.celular){
    if(!this.isValidPhoneNumberMarcos(this.state.celular)){
      console.log(this.state.celular);
      this.setState({ isLoading: false });
      //alert("Número celular no válido");
      this.showAlert("Atención",
      "Número celular no válido",
      true, "info", "OK",
      false, "", "");
      
        return;
    }

  }else{
    if(!this.isValidPhoneNumberMarcos(this.state.celular)){
      console.log(this.state.celular);
      this.setState({ isLoading: false });
      //alert("Número celular no válido");
      this.showAlert("Atención",
      "Número celular no válido",
      true, "info", "OK",
      false, "", "");
      
        return;
    }else{

    }

  }
  */
  

  try {

    var love = this.myInput.value.split(" - ");

      var payload={
        "idsupervisor": this.state.idsupervisor,
        "nombre": this.state.nombre.trimLeft().trimRight(),
        "apellido": this.state.apellido.trimLeft().trimRight(),
        "correo":this.state.email.trimLeft().trimRight(),
        "contrasena":this.state.password,
        "celular": this.state.celular.trimLeft().trimRight(),
        "direccion": this.state.direccion.trimLeft().trimRight(),
        "estatus": this.state.estatus,
        "zona": love[0]
      }
      
      console.log(payload);
      var self = this;

      if(this.state.isEditing){
        //Se editará el supervisor
        this.setState({showLoading: true});
        await axios.post('http://'+this.state.url+'/administrador/editarSupervisor', payload)
        .then(function (response) {
          self.setState({showLoading: false});
            if(response.data.success === 1){
                //alert("Se modificó el perfil del supervisor exitosamente.");
                self.showAlert("Supervisor modificado",
                "Se modificó el perfil del supervisor exitosamente.",
                true, "info", "OK",
                false, "", "");
                self.setState({isEditing: false});
                self.setState({isAddingSupers:false});
                self.gettingSupervisoresXZona(0);
                self.setState({isAddingSupers:false, isConnected: true});
            }
            else if(response.data.success === 2){
              //alert("Error al modificar el perfil del supervisor.");
              self.showAlert("Error",
                "Error al modificar el perfil del supervisor.",
                true, "info", "OK",
                false, "", "");
            }
            else{

              if(response.data.success === 0){
                //alert(response.data.error);
                self.showAlert("Error 100",
                response.data.error,
                true, "info", "OK",
                false, "", "");
            }else{
                //alert("Error al agregar supervisor.");
                self.showAlert("Error 512",
                "Error al modificar el perifl del supervisor.",
                true, "info", "OK",
                false, "", "");
            }
            /*
              if(response.data.success === 0 || response.data.error === 2)
                //alert("Error al modificar el perfil del supervisor.");
                self.showAlert("Error",
                "Error al modificar el perfil del supervisor.",
                true, "info", "OK",
                false, "", "");
              else
                //alert("Error al modificar el perfil del supervisor.");
                self.showAlert("Error",
                "Error al modificar el perfil del supervisor.",
                true, "info", "OK",
                false, "", "");
                */
        }
        })
        .catch(function (error) {
          self.setState({showLoading: false});
            alert(error.message);
        });
        this.setState({ isLoading: false });
        this.setState({isConnected: true});

      }else{
        this.setState({showLoading: true});
        await axios.post('http://'+this.state.url+'/administrador/agregarSupervisor', payload)
        .then(function (response) {
        console.log(response);
        self.setState({showLoading: false});
          if(response.data.success === 1){
              //alert("Supervisor agregado exitosamente.");
              self.showAlert("Supervisor agregado",
                "Se agregó el supervisor a la zona Parken exitosamente.",
                true, "info", "OK",
                false, "", "");
              self.setNoAddingAdmins();
              self.gettingSupervisoresXZona(0);
              self.setState({isAddingSupers: false, isConnected: true});
          }
          else {
            if(response.data.success === 2){
                //alert(response.data.error);
                self.showAlert("Error 222",
                response.data.error,
                true, "info", "OK",
                false, "", "");
            }else{
                if(response.data.success === 0){
                    //alert(response.data.error);
                    self.showAlert("Error 100",
                    response.data.error,
                    true, "info", "OK",
                    false, "", "");
                }else{
                    //alert("Error al agregar supervisor.");
                    self.showAlert("Error 512",
                    "Error al agregar supervisor.",
                    true, "info", "OK",
                    false, "", "");
                }
            }
        }

      })
      .catch(function (error) {
        self.setState({showLoading: false});
          alert(error.message);
      });
      this.setState({ isLoading: false });


      }
  } catch (e) {
    alert(e.message);
    this.setState({ isLoading: false });
  }
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
  if(title === "Eliminar supervisor"){
    this.setState({idsupervisor: data});
  }

}

infoSuper(supervisor){
    this.setState({title: "Supervisor " + supervisor.nombre + " "+ supervisor.apellido});
    this.setState({nombre: supervisor.nombre}); 
    this.setState({apellido: supervisor.apellido}); 
    this.setState({email: supervisor.email }); 
    this.setState({celular: supervisor.celular.substring(3)});
    this.setState({password: supervisor.contrasena}); 
    this.setState({repassword: supervisor.contrasena});
    this.setState({direccion: supervisor.direccion}); 
    this.setState({idsupervisor: supervisor.id}); 
    this.setState({zonasparken: [{id: supervisor.zonaparken, nombre: supervisor.nombrezonaparken}]})
    this.setState({isAddingSupers: true});
    this.setState({isShowingInfo: true});
    this.setState({isEditing: false});
  }

  async verificarAdmin(){
    var self = this;
    this.setState({showLoading: true});
    var url = 'http://'+this.state.url+'/administrador/verificarAdministrador?administrador='+localStorage.getItem("idadministrador").toString();
    await axios.get(url)
      .then(res => {
        self.setState({showLoading: false});
        if(res.data.success === 1){
          this.setState({isLoading : false})
          this.setState({isConnected : true})
        }else{
          this.setState({isLoading : false})
          this.setState({isConnected : false})
          this.props.handleLogout();
      
        }
    }).catch(error => {
      self.setState({showLoading: false});
        alert(error.message);
        this.setState({isLoading : false})
        this.setState({isConnected : false})
    });
  }  


renderAddSupervisor() {
  return (    
    <div className="Supervisor" >
    <PageHeader ><button className='but' onClick={this.setNoAddingAdmins}>{"←"}</button>{this.state.title}</PageHeader>    
      <form className="Formulario" onSubmit={this.handleSubmit}>
        <FormGroup  controlId="nombre" bsSize="small">
          <ControlLabel>Nombre</ControlLabel>
          <FormControl
           autoFocus
           value={this.state.nombre}
           disabled={this.state.isShowingInfo}
           onChange={this.handleChange}
           type="text"/>
        </FormGroup>
        <FormGroup controlId="apellido" bsSize="small">
          <ControlLabel>Apellidos</ControlLabel>
          <FormControl
            value={this.state.apellido}
            disabled={this.state.isShowingInfo}
            onChange={this.handleChange}
            type="text"/>
        </FormGroup>
        <FormGroup controlId="email" bsSize="small">
          <ControlLabel>Correo electrónico</ControlLabel>
          <FormControl
            value={this.state.email.trim()}
            onChange={this.handleChange}
            disabled={this.state.isShowingInfo}
            type="email"/>
        </FormGroup>
        <FormGroup> 
          <ControlLabel>Número celular</ControlLabel>
          <PhoneInput 
            country="MX"
            placeholder = "Ingresa número celular"
            disabled={this.state.isShowingInfo}
            value={this.state.celular}
            onChange={ celular => this.setState({ celular }) } />  
        </FormGroup>
        <FormGroup controlId="password" bsSize="small">
          <ControlLabel>Contraseña</ControlLabel>
          <FormControl
            value={this.state.password}
            onChange={this.handleChange}
            disabled={this.state.isShowingInfo}
            type="password"/>
        </FormGroup>
        {!this.state.isShowingInfo ? 
            <FormGroup controlId="repassword" bsSize="small">
            <ControlLabel>Repite contraseña</ControlLabel>
            <FormControl
              value={this.state.repassword}
              onChange={this.handleChange}
              disabled={this.state.isShowingInfo}
              type="password"/>
            </FormGroup>: <div></div>}
        <FormGroup controlId="direccion" bsSize="small">
          <ControlLabel>Direccion</ControlLabel>
          <FormControl
            value={this.state.direccion}
            onChange={this.handleChange}
            disabled={this.state.isShowingInfo}
            type="text"/>
        </FormGroup>
        <FormGroup>
            <ControlLabel>Zona Parken</ControlLabel>
            <FormControl 
                componentClass="select" 
                disabled={this.validateZonaInput()}
                onClick={this.gettingZonasParken}
                inputRef={ref => { this.myInput = ref; }}>
            {this.state.zonasparken.map((marker) =>
            <option> {marker.id + " - " + marker.nombre}</option> )  
            }
            </FormControl>
        </FormGroup>
        {!this.state.isShowingInfo ? 
            <LoaderButton className='btn btn-primary'
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            isLoading={this.state.isLoading}
            text={this.state.title}
            loadingText="Procesando..."/>:<div></div>}
      </form>
    </div>
  );
}

renderSupersList(supers) {
  return(
  <div className="list">   
  {[{}].concat(supers).map(
    (supervisor, i) =>
      i !== 0
        ? 
        <ListGroupItem 
        header={supervisor.nombre.trim() + ' ' + supervisor.apellido}>
            <div>{supervisor.email}</div>
            <div>{supervisor.nombrezonaparken}</div>
             <div className='btn-group ml-auto'>
             <button className='delete btn btn-info' 
              onClick={this.infoSuper.bind(this, supervisor)}>
              Ver
              </button>
              <button className='delete btn btn-success' 
              onClick={this.setEdit.bind(this, supervisor)}>
              Editar
              </button>
              <button className='delete btn btn-danger' 
              onClick={this.showAlert.bind(this,"Eliminar supervisor",
              "¿Estás seguro de eliminar al supervisor?",
              true, "info", "Cancelar",
              true, "danger", "Eliminar", supervisor.id)}>
              Eliminar
              </button>
              </div>
             </ListGroupItem>
        : 
            <ListGroupItem onClick={this.setAddingSupers}>
            <LinkContainer to="/supervisores">
                
              <h4>
                <b>{"\uFF0B"}</b> Agregar supervisor
              </h4>
              </LinkContainer>
            </ListGroupItem>
  )}</div>);
}


renderLander() {
  return (
      <div className="load">
              <h4>
                Cargando supervisores...
              </h4>
      </div>
  );
}

renderSupers() {
  return (
    <div className="Supervisor">    
      <ListGroup>                  
        {!this.state.isLoading && this.renderSupersList(this.state.supers)}
      </ListGroup>
    </div>
  );
}

render() {
  return (
    <div className="Supervisor">
    {this.props.isAuthenticated ? 
    (this.state.isAddingSupers ? this.renderAddSupervisor() : (this.state.isConnected ? this.renderSupers():this.renderLander())):
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

  <Modal show={this.state.showLoading} backdrop="static" keyboard={false}>
    <Modal.Body>
      <Modal.Title>
      <LoaderButton className='btn btn-link'
            block
            bsSize="large"
            isLoading={true}
            loadingText="Cargando..."/>
        </Modal.Title>
    </Modal.Body>
  </Modal>
    </div>
  );
}
}