import React, { Component } from "react";
import {Button, Image} from "react-bootstrap";
import "./Home.css";
import axios from "axios";

export default class Home extends Component {

  constructor(props) {
    super(props);

  this.state = {
    url : this.props.host + ":" +  this.props.port,
    id: this.props.idadministrador,
    nombre : this.props.nombre,
    apellido: this.props.apellido,
    email: this.props.email,
    password: this.props.password 
  };

  this.irAEditar = this.irAEditar.bind(this);
  this.verificarAdmin = this.verificarAdmin.bind(this);
}

  componentDidMount(){
    if(localStorage.getItem("isLogged") === "false"){
        this.props.history.push("/");
    }else{
      if(this.verificarAdmin() === 0){
        this.props.handleLogout();
      }
    }
  }

  async verificarAdmin(){
    var url = 'http://'+this.state.url+'/administrador/verificarAdministrador?administrador='+localStorage.getItem("idadministrador").toString();
    await axios.get(url)
      .then(res => {
        if(res.data.success === 1){
          this.setState({isLoading : false})
          this.setState({isConnected : true})
          return 1;
        }else{
          this.setState({isLoading : false})
          this.setState({isConnected : false})
          return 0;
        }
    }).catch(error => {
        alert(error.message);
        this.setState({isLoading : false})
        this.setState({isConnected : false})
        return 2;
    });
  }

  irAEditar(){
    this.props.editProfile();    
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
      {localStorage.getItem("nombreadministrador") + " "}
      {localStorage.getItem("apellidoadministrador") + "\n"}{"\n"}
      {localStorage.getItem("emailadministrador")}
      </div>
      
        <div className="subtituloHome">
        <Button bsStyle="success" onClick={this.irAEditar}>Editar</Button>
        </div>
      </form>
    </div>
    );
  }
}