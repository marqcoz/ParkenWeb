import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import AppliedRoute from "./components/AppliedRoute";
import Administrador from "./containers/Administrador";
import AdministradorNuevo from "./containers/NuevoAdmin";
import Zonas from "./containers/Zonas";
import ZonaInfo from "./containers/ZonaInfo";
import Supervisor from "./containers/Supervisor";


export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/administradores" exact component={Administrador} props={childProps} />
    <AppliedRoute path="/administradores/nuevo" exact component={AdministradorNuevo} props={childProps} />
    <AppliedRoute path="/zonasparken" exact component={Zonas} props={childProps} />
    <AppliedRoute path="/zonaparkeninfo" exact component={ZonaInfo} props={childProps} />
    <AppliedRoute path="/supervisores" exact component={Supervisor} props={childProps} />

  
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;