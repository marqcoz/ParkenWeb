import React, { Component } from "react";
import {Button} from "react-bootstrap";
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
    password: this.props.password,

  };

  this.irAEditar = this.irAEditar.bind(this);
  //this.verificarAdmin = this.verificarAdmin.bind(this);
}

async componentDidMount(){
  if(this.props.isAuthenticated){
    await this.verificarAdmin();
  }
    
  }

  async verificarAdmin(){
    var url = 'http://'+this.state.url+'/administrador/verificarAdministrador?administrador='+localStorage.getItem("idadministrador").toString();
    await axios.get(url)
      .then(res => {
        if(res.data.success === 1){
          this.setState({isLoading : false})
          this.setState({isConnected : true})
        }else{
          this.setState({isLoading : false})
          this.setState({isConnected : false})
          this.props.handleLogout();
      
        }
    }).catch(error => {
        alert(error.message);
        this.setState({isLoading : false})
        this.setState({isConnected : false})
    });
  }

  irAEditar(){
    this.props.editProfile();    
  }
  render() {
    return (
      <div className="Home">
      {this.props.isAuthenticated ? 
      <form onSubmit={this.handleSubmit}>
      <div className="tituloHome">Perfil
      <div>
      <img alt="Logo administrador" src={require("./ic_user-web.png")} style={{width:150}}/>
      </div>
      </div>
      <div className="subtituloHome">
      {localStorage.getItem("nombreadministrador") + " "}
      {localStorage.getItem("apellidoadministrador") + "\n"}{"\n"}
      <div className="subsubtituloHome">
      {localStorage.getItem("emailadministrador")}
      </div>
      </div>
      
        <div className="subtituloHome">
        <Button bsStyle="success" onClick={this.irAEditar}>Editar</Button>
        </div>
      </form> :
      this.props.history.push("/login")}
    </div>
    );
  }
}