import React, { Component } from "react";
import "./Home.css";

export default class Home extends Component {


  componentDidMount(){
      console.log(this.props.zonainfo);
  }

  render() {
    return (
      <div className="Home">
        <div className="lander">
          <h1>Zona</h1>
          <span>La aplicación web de Parken para los administradores</span>
        </div>
      </div>
    );
  }
}