import React, { Component } from "react";
import "./Home.css";

export default class Home extends Component {

  constructor(props) {
    super(props);

  };

  componentDidMount(){
    if(localStorage.getItem("isLogged") == "false"){
      this.props.history.push("/login");
    }
  }
  render() {
    return (
      <div className="Home">
        <div className="lander">
          <h1>Parken</h1>
          <span>La aplicación web de Parken para los administradores</span>
        </div>
      </div>
    );
  }
}