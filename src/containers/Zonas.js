import React, { Component } from 'react';
import {GoogleApiWrapper, Map, Polygon, Marker} from 'google-maps-react';
import {Form, Modal, Button, PageHeader,InputGroup, FormGroup, FormControl, ControlLabel, ListGroup, ListGroupItem } from "react-bootstrap";
import axios from 'axios';
import LoaderButton from "../components/LoaderButton";
import "./Zonas.css";


export class Zonas extends Component {
  constructor(props) {
    super(props);

this.state = {
  url : this.props.host + ":" +  this.props.port,
  idzonaparken: "",
  nombre : "",
  estatus: "NO DISPONIBLE",
  precio: "",

  isShowingInfo: false,
  isAddingZona: false,
  isAddingEspaciosParken: false,
  isShowingMap: true,
  loading: true,
  showLoading: false,

  title:"",
  titleButton:"",

  userLocation: { lat: 19.432551, lng: -99.133022 },

  location:[{ lat: 19.432551, lng: -99.133022 },{
    lat: 40.854885,
    lng: -88.081807
  } ],
  markers: [],
    //Hay que obtener este json
    markersHidden: [],

  polygon : [/*
    {lat: 19.41867612502457, lng: -99.17699637499084},
    {lat: 19.427418290377116, lng: -99.1803223141693},
    {lat: 19.43478400897405, lng: -99.16407885637511}

   {lat: 19.433964868997485, lng: -99.1526347261505},
   {lat: 19.431253338424256, lng: -99.1581815343933},
   {lat: 19.425182583471425, lng: -99.1560035806732},
   {lat: 19.427408553296104, lng: -99.14807497082518}
  */
  ],
  /*polygon : [],
  {lat: 25.774, lng: -80.190},
  {lat: 18.466, lng: -66.118},
  {lat: 32.321, lng: -64.757}
],*/

  polygonWorld:[
  {lat:85,lng:180},{lat:85,lng:90},{lat:85,lng:0},{lat:85,lng:-90},{lat:85,lng:-180},{lat:0,lng:-180},{lat:-85,lng:-180},
  {lat:-85,lng:-90},{lat:-85,lng:0},{lat:-85,lng:90},{lat:-85,lng:180},{lat:0,lng:180},{lat:85,lng:180}],

/*
 polygon:[
    {lat: 28.745, lng: -70.579},
    {lat: 29.570, lng: -67.514},
    {lat: 27.339, lng: -66.668}],*/
  polygonOne: [],
  polygonTwo: [],
  colorStrike:"#F44336",
  colorFill: "#F44336",
  labelOverMap: "Modifica la zona Parken",
  isPolygonClickable: false,
  isLoading: true,
  isConnected: false,
  thereAdmins: true,
  isEditing: false,
  readyForEdit: false,
  zonas: [],
  supers: [],

  contador: 0,
  markersNew: [],
  markersDeleted: [],

  nombreBefore: "",
  estatusBefore: "",
  precioBefore: "",
  polygonBefore: []

};

this.infoZona = this.infoZona.bind(this);
this.setEdit = this.setEdit.bind(this);
this.addNewZone = this.addNewZone.bind(this);
this.setEstatus = this.setEstatus.bind(this);
this.onMapClicked = this.onMapClicked.bind(this);
this.handleChange = this.handleChange.bind(this);
this.handleChangeNumber = this.handleChangeNumber.bind(this);
this.validateInfoZone = this.validateInfoZone.bind(this);
this.onMarkerClicked= this.onMarkerClicked.bind(this);
this.clearMapOfMarkers = this.clearMapOfMarkers.bind(this);
this.validateInputMap = this.validateInputMap.bind(this);
this.validateInputMapReset = this.validateInputMapReset.bind(this);
this.setNoAddingZona = this.setNoAddingZona.bind(this);
this.showAlert = this.showAlert.bind(this);
this.handleClose = this.handleClose.bind(this);
this.handleCloseLoading = this.handleCloseLoading.bind(this);
this.handleAction1 = this.handleClose.bind(this);
this.handleAction2 = this.handleAction2.bind(this);
this.gettingSupervisoresXZona = this.gettingSupervisoresXZona.bind(this);
this.irASupervisor = this.irASupervisor.bind(this);
this.editarZonaParken = this.editarZonaParken.bind(this);
this.setMap = this.setMap.bind(this);
this.addDeletedList = this.addDeletedList.bind(this);
this.agregarZonaParken = this.agregarZonaParken.bind(this);

}

async gettingLocation(){
  this.setState({showLoading: true});
  await navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      this.setState({showLoading: false});
      this.setState({
        userLocation: { lat: latitude, lng: longitude },
        loading: false,
        isAddingZona: true
      });
    },
    () => {
      this.setState({showLoading: false});
      this.setState({
        loading: false, isAddingZona: true });
    }

  );
}

async gettingSupervisoresXZona(zona){
  var idzona = zona.toString();
  var self = this;
  var url = 'http://'+
            this.state.url+'/administrador/obtenerSupervisoresXZona?idzona=' + 
            idzona;
  this.setState({showLoading: true});
  await axios.get(url)
    .then(res => {
      self.setState({showLoading: false});
      const supers = res.data.supervisores;
      //console.log(supers);
      if(res.data.success === 2){
        this.setState({isLoading : false})
        this.setState({isConnected : true})

      }else{
        this.setState({supers});
        this.setState({isLoading : false})
        this.setState({isConnected : true})
      }
      })
    .catch(error => {
      self.setState({showLoading: false});
      alert(error.message);
      self.setState({isLoading : false})
      self.setState({isConnected : false})
    });
}

async agregarZonaParken(){
  //Enviamos la peticion para agregar una zona Parken
    //console.log(this.state.polygon);
    var self = this;
    var payload = {
      "nombre": this.state.nombre,
      "estatus" :this.state.estatus,
      "precio" : this.state.precio,
      "coordenadasPoly": this.state.polygon,
      "coodenadasMarker": this.state.markers
     };
     console.log(payload);
 
     this.setState({showLoading: true});
  await axios.post('http://'+this.state.url+'/administrador/agregarZonaParken', payload)
      .then(function (res) {
       self.setState({showLoading: false});
       const response = res.data;
       console.log(response);
       if(response.success === 1){
        //alert("Zona agregada exitosamente!");
        self.showAlert("Nueva zona Parken",
       "Zona agregada exitosamente. Agrega supervisores y asígnalos a ésta zona para que pueda estar disponible a los automovilistas.",
       true, "info", "OK",
       false, "", "");
        
        //self.setState({isEditing: false,
          //isAddingZona:false,
          //isAddingEspaciosParken: false});
          //self.obtenerZonasParken();
       self.setNoAddingZona();
        //self.setState({isAddingZona:false, isAddingEspaciosParken: false});
      }else{
       if(response.success === 2){
        self.setState({isLoading : false})
 
       }else{
           if(response.success === 6){
             //alert("El nombre de la zona Parken ya existe.");
             self.showAlert("Error",
             "El nombre de la zona Parken ya existe.",
             true, "info", "OK",
             false, "", "");
           }else{
           if(response.success === 7){
             //alert("El perimetro de la zona se intersecta con otra zona Parken.");
             self.showAlert("Error",
             "El perimetro de la zona se intersecta con otra zona Parken.",
             true, "info", "OK",
             false, "", "");
             self.setState({polygon:[], markers: [], colorStrike:"#F44336",
             colorFill: "#F44336"});
             self.addNewZone();
           }else{
             alert(response.error);
           }
 
         }
       }
       }
       //self.setState({isLoading : false})
       //self.setState({isConnected : true})
 
     }).catch(function (error) {
       self.setState({showLoading: false});
      alert(error.message);
      self.setState({isLoading : false})
   self.setState({isConnected : false})
    });
}


componentDidMount() {

  if(this.props.isAuthenticated){
    this.verificarAdmin();
  }

  this.obtenerZonasParken();

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
      self.setState({isLoading : false})
      self.setState({isConnected : false})
  });
}

async obtenerZonasParken(){
  var self = this;
  this.setState({showLoading: true});
  await axios.get('http://'+this.state.url+'/administrador/obtenerZonasParken')
  .then(res => {
    console.log("ObtenerZonas")
    self.setState({showLoading: false});
   const zonas = res.data;
   console.log(res.data);
   console.log(zonas);
   if(zonas.success === 2){
    this.setState({isLoading : false})
    this.setState({isConnected : false})

   }else{
    this.setState({ zonas: zonas.ZonasParken });
    this.setState({isLoading : false})
    this.setState({isConnected : true})
   }

  }).catch(error => {
    self.setState({showLoading: false});
  alert(error.message);
  self.setState({isLoading : false})
  self.setState({isConnected : false})
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
  if(title === "Eliminar zona Parken"){
    this.setState({idzonaparken: data});
  }
  if(title === "Editar zona Parken"){}

}

addDeletedList(id){
  //Añadimos al array el id del espacio parken a eliminar
  this.setState({markersDeleted: this.state.markersDeleted.concat(id)});
  console.log("JSON espacios a eliminar");
  console.log(this.state.markersDeleted);
}

async editarZonaParken(){

  //console.log(this.state.markersNew);
  //console.log(this.state.markersDeleted);

  //return;
  var self = this;
  this.setState({estatus: this.refs.selectStatus.value});
  this.setState({showLoading: true});

  var payload = {
    "idzonaparken": this.state.idzonaparken,
    "nombre": this.state.nombre,
    "estatus" :this.refs.selectStatus.value,
    "precio" : this.state.precio,
    "coordenadasPoly": this.state.polygon,

    "nombreBefore": this.state.nombreBefore,
    "estatusBefore" :this.state.estatusBefore,
    "precioBefore" : this.state.precioBefore,
    "coordenadasPolyBefore": this.state.polygonBefore,

    "coordenadasMarker": this.state.markersNew,
    "coordenadasDeleted": this.state.markersDeleted
   }

  await axios.post('http://'+this.state.url+'/administrador/actualizarZonaParken', 
    payload).then(function (response) {
      
    self.setState({showLoading: false});
      if(response.data.success === 1){
          self.showAlert("Zona Parken actualizada",
            "Se modificó la información de la zona correctamente.",
            true, "info", "OK",
            false, "", "");
          self.setState({isEditing: false,
            isAddingZona:false,
            isAddingEspaciosParken: false});
          self.setNoAddingZona();
      }else{
        self.showAlert("Error al modificar zona Parken",
            response.data.error,
            true, "info", "OK",
            false, "", "");
      }
  })
  .catch(function (error) {
    self.setState({showLoading: false});
    //self.obtenerZonasParken();
    self.setNoAddingZona();
            //self.obtenerZonasParken();
      alert(error.message);
  });
  this.setState({ isLoading: false });
  this.setState({isConnected: true});

}

handleClose(){
  this.setState({show: false})
}

handleCloseLoading(){
  this.setState({showLoading: false})
}

handleAction2(){
  if(this.state.titleAlert === "Eliminar zona Parken"){
    this.deleteZonaParken(this.state.idzonaparken);
  }
  if(this.state.titleAlert === "Editar zona Parken"){
    this.editarZonaParken();
  }
  this.setState({show: false});
}

async deleteZonaParken(id){

  var self = this;
  var payload = { data: {
    "idzonaparken": id
  }}
  this.setState({showLoading: true});
  axios.delete('http://'+this.state.url+'/administrador/eliminarZonaParken', payload)
  .then(res => {
    self.setState({showLoading: false});
    const zona = res.data;
    console.log(zona);
    if(zona.success === 1){
      self.showAlert("Zona Parken eliminada",
         "Se eliminó la zona Parken correctamente.",
         true, "info", "OK",
         false, "", "");
      self.obtenerZonasParken();
      this.setState({isAddingZona:false, isAddingEspaciosParken: false});
    }else if(zona.success === 2){
        if(zona.error === '0'){
            self.showAlert("Error al eliminar zona Parken",
            "Error",
            true, "info", "OK",
            false, "", "");
            this.setState({isAddingZona:false, isAddingEspaciosParken: false});
        }
        else{
            if(zona.error === '5'){
                //alert("No se puede eliminar al supervisor, tiene reportes pendientes.");
                self.showAlert("Supervisores registrados",
                "Antes de eliminar una zona asegúrate de asignar o eliminar a todos los supervisores de la zona Parken. ",
                true, "info", "OK",
                false, "", "");

            }else{
              if(zona.error === '6'){
                //alert("No se puede eliminar al supervisor, tiene reportes pendientes.");
                self.showAlert("Reportes pendientes",
                "Antes de eliminar una zona asegúrate de resolver todos los reportes en la zona Parken. ",
                true, "info", "OK",
                false, "", "");

            }else{
              if(zona.error === '4'){
                //alert("No se puede eliminar al supervisor, tiene reportes pendientes.");
                self.showAlert("Sanciones pendientes",
                "Antes de eliminar una zona asegúrate de resolver todas las sanciones de la zona Parken. ",
                true, "info", "OK",
                false, "", "");

              }else{
                if(zona.error === '7'){
                  //alert("No se puede eliminar al supervisor, tiene reportes pendientes.");
                  self.showAlert("Espacios Parken",
                  "Antes de eliminar una zona asegúrate que el estatus de todos los espacios Parken sea DISPONIBLE.",
                  true, "info", "OK",
                  false, "", "");

                }else{
                  if(zona.error === '3'){
                    //alert("No se puede eliminar al supervisor, tiene reportes pendientes.");
                    self.showAlert("Espacios Parken",
                    "La zona Parken no puede quedarse sin espacios",
                    true, "info", "OK",
                    false, "", "");

                  }else{
                //alert("Error al eliminar administrador.");
                self.showAlert("Error al eliminar la zona Parken",
                "Ocurrió un error con el servidor.",
                true, "info", "OK",
                false, "", "");
            }
          }
        }
      }
    }
    }
    }else{
      self.showAlert("Error 501",
        "Error al eliminar zona Parken",
        true, "info", "OK",
        false, "", "");
    }
    //this.setState({ persons });
    self.setState({isLoading : false})
    self.setState({isConnected : true})

  }).catch(error => {
    self.setState({showLoading: false});
   alert(error.message);
   self.setState({isLoading : false})
   self.setState({isConnected : false})
 });

}

async setNoAddingZona(){
  await this.setState({
  nombre : "",
  estatus: "NO DISPONIBLE",
  precio: "",
  showLoading: false,
  title:"",
  titleButton:"",
  userLocation: { lat: 19.432551, lng: -99.133022 },
  location:[{ lat: 19.432551, lng: -99.133022 },{
    lat: 40.854885,
    lng: -88.081807
  } ],
  markers: [],
  polygon : [],
  polygonWorld:[
  {lat:85,lng:180},{lat:85,lng:90},{lat:85,lng:0},{lat:85,lng:-90},{lat:85,lng:-180},{lat:0,lng:-180},{lat:-85,lng:-180},
  {lat:-85,lng:-90},{lat:-85,lng:0},{lat:-85,lng:90},{lat:-85,lng:180},{lat:0,lng:180},{lat:85,lng:180}],
  polygonOne: [],
  polygonTwo: [],
  colorStrike:"#F44336",
  colorFill: "#F44336",
  isPolygonClickable: false,
  thereAdmins: true,
  isEditing: false,
  supers:[],
  zonas: []
  });
  await this.setState({    
  isShowingInfo: false,
  isAddingZona: false,
  isAddingEspaciosParken: false,
  isShowingMap: true,
  loading: true,
  showLoading: false,
  userLocation: { lat: 19.432551, lng: -99.133022 },

  location:[{ lat: 19.432551, lng: -99.133022 },{
    lat: 40.854885,
    lng: -88.081807
  } ],
  markers: [],
    markersHidden: [],
  polygon : [],
  polygonWorld:[
  {lat:85,lng:180},{lat:85,lng:90},{lat:85,lng:0},{lat:85,lng:-90},{lat:85,lng:-180},{lat:0,lng:-180},{lat:-85,lng:-180},
  {lat:-85,lng:-90},{lat:-85,lng:0},{lat:-85,lng:90},{lat:-85,lng:180},{lat:0,lng:180},{lat:85,lng:180}],

  colorStrike:"#F44336",
  colorFill: "#F44336",
  labelOverMap: "Modifica la zona Parken",
  isPolygonClickable: false,
  isLoading: true,
  isConnected: true,
  thereAdmins: true,
  isEditing: false,
  readyForEdit: false,
  zonas: [],
  supers: [],

  contador: 0,
  });
  this.obtenerZonasParken();
}

setMap(event){
  this.setState({isShowingMap: true,
    polygonTwo: [],
    contador: 0,
    contador2: 0,
    markers: []});
}

setEdit(zona){
  //console.log(zona.espaciosParken);
  this.setState({
    idzonaparken: zona.id,
    nombre: zona.nombre,
    estatus: zona.estatus,
    precio: zona.precio.toString(),
    polygon: zona.coordenadas,
    markers: zona.espaciosParken,
    markersHidden: zona.espaciosParken,
    nombreBefore: zona.nombre,
    estatusBefore: zona.estatus,
    precioBefore: zona.precio.toString(),
    polygonBefore: zona.coordenadas
   });
   this.setState({
    title: "Zona Parken " + zona.nombre,
    titleButton:"\uFF0B Agregar espacios Parken",
    isShowingInfo: false,
    isShowingMap: false,
    isAddingZona: true,
    isEditing: true,
    polygonOne: zona.coordenadas,
    polygonTwo: [],
    markersDeleted:[],
    markersNew:[],
    userLocation: {lat: zona.centro[0].lat , lng: zona.centro[0].lng },
    loading:false,
    labelOverMap: "Modifica el perímetro de la zona Parken",
   });
   //this.setState({polygonOne: zona.coordenadas, polygon: []});

   this.gettingSupervisoresXZona(zona.id);

}

infoZona(zona){
  //console.log(zona);
  this.setState({
    idzonaparken: zona.id,
    nombre: zona.nombre,
    estatus: zona.estatus,
    precio: zona.precio,
    polygon: zona.coordenadas,
    markers: zona.espaciosParken
   });
   this.setState({
    title: "Zona Parken " + zona.nombre,
    titleButton:"Nothing",
    isShowingInfo: true,
    isAddingZona: true,
    isEditing: false,
    polygonOne: zona.coordenadas,
    polygonTwo: [],
    userLocation: {lat: zona.centro[0].lat , lng: zona.centro[0].lng },
    loading:false
   });

   this.gettingSupervisoresXZona(zona.id);
}

addNewZone(){
 // alert("Se agregara una nueva zona Parken");
  this.setState({ title: "Agregar zona Parken",
  labelOverMap: "Dibuja en el mapa el perímetro de la nueva zona Parken ↴",
  titleButton:"\uFF0B Agregar espacios Parken",
  isEditing: false,
  isAddingEspaciosParken: false,
polygonOne: this.state.polygon, polygonTwo:[] });
  this.gettingLocation();

}

setEstatus = est =>{
  //alert(this.refs.selectStatus.getValue());
  this.setState({estatus: est});
}


validateForm() {
  return this.state.nombre.length > 0 &&
  this.state.precio.length > 0
  && this.state.estatus.length > 0;

}

validateEstatus() {
  return (this.state.isAddingZona && !this.state.isEditing) ||
  this.state.supers.length == 0;

}

validateInputMap() {
  //Validaremos si ya ingresaron poligonos
  //alert(this.state.contador);
  if(this.state.isShowingMap){
    //Si el mapa se esta mostrando entonces validamos que
    return this.state.polygon.length > 2 &&
    this.state.contador === 0 &&
    //Por el momento que merkersHidden sea mayor que 2
    this.state.markers.length > 0;

  }else{
    return this.state.markers.length > 0;
  }
}

validateInputMapReset() {
  //Validaremos si ya ingresaron poligonos
  //alert(this.state.contador);
  if(this.state.isShowingMap){
    if(this.state.isEditing){
      //Si el mapa se esta mostrando entonces validamos que
      return this.state.polygon.length > 2 &&
      //Por el momento que merkersHidden sea mayor que 2
      this.state.markers.length > 0;
    }else{
      return this.state.markers.length > 0;
    }


  }else{
    return this.state.markers.length > 0;
  }
}

handleChange(event) {

  this.setState({
    [event.target.id]: event.target.value
  });
}

validateInfoZone(){
  if(this.state.isAddingZona && !this.state.isEditing){
    return this.state.nombre.length > 0 &&
    this.state.estatus.length > 0 &&
    this.state.precio.length > 0 &&
    this.state.markers.length > 0 &&
    this.state.polygon.length > 2;
  }else{
    if(this.state.isEditing){
      return this.state.nombre.length > 0 &&
      this.state.estatus.length > 0 &&
      this.state.precio.length > 0 &&
      this.state.markersHidden.length > 0 &&
      this.state.polygon.length > 2;
    }else{
      return false;
    }
    }
}

irASupervisor(){
  this.props.addSuper();
  this.props.setInfoSupervisor(this.state.idzonaparken, this.state.nombre);
}

handleChangeNumber(event) {

  if(event.target.value === ""){
    this.setState({
      [event.target.id]: 1
    });
    return;
  }

  if(event.target.value <= 0){
    var n;
      if((event.target.value) == 0){
        n=1;
      }else{
        n = (event.target.value)*(-1);
      }
    this.setState({
      [event.target.id]: n
    });
  }else{
    this.setState({
      [event.target.id]: (event.target.value)
    });
  }

}


clearMapOfMarkers = event => {

  if(this.state.isAddingZona && !this.state.isEditing){
    this.setState({markers:[], polygon:[],
      polygonOne: [], polygonTwo: [],
      colorStrike:"#F44336",
      colorFill: "#F44336"
    });
    this.setState({ title: "Agregar zona Parken", labelOverMap: "Dibuja en el mapa el perímetro de la nueva zona Parken ↴", titleButton:"\uFF0B Agregar espacios Parken", isAddingEspaciosParken: false});
  }else{
    if(this.state.isEditing){
      this.setState({markers:[], polygon:[],
        polygonOne: [], polygonTwo: [],
        colorStrike:"#F44336",
        colorFill: "#F44336"
      });
      this.setState({
        labelOverMap: "Modifica el perímetro de la zona Parken",
      titleButton:"\uFF0B Agregar espacios Parken",
      readyForEdit: false,
      isAddingEspaciosParken: false});
    }
  }
}


onMarkerClicked = (props, marker, e) => {

  if(this.state.isAddingZona && this.state.isAddingEspaciosParken){
  var lati = props.position.lat;
  var longi = props.position.lng;
      var newEle = {
        coordinates:
        { lat:lati,
          lng:longi
        }
      };

      if(this.state.isEditing){
        //alert("vamos a eliminar este marker");
        //console.log(this.state.markers.toString());

        if(this.state.contador2 === 0){
          this.setState({markers: this.state.markers.concat([]),
          contador2: this.state.contador2+1
        });

        }
        //

        for(var i = 0; i < this.state.markers.length; i++){
        if(this.state.markers[i].coordinates.lat === newEle.coordinates.lat && this.state.markers[i].coordinates.lng===newEle.coordinates.lng){
          this.state.markers.splice(i, 1);
          break;
        }
      }
      this.setState({markers:this.state.markers});
      //console.log("MarkersHidden");
      //console.log(this.state.markersHidden);
      //this.setState({markers: this.state.markers.concat([newEleAux])});

      for(var k = 0; k < this.state.markersHidden.length; k++){
          //console.log("MarkersHidden" + k);
          //console.log(this.state.markersHidden[k]);
          //console.log(newEle);
        if(this.state.markersHidden[k].coordinates.lat === newEle.coordinates.lat && this.state.markersHidden[k].coordinates.lng===newEle.coordinates.lng){
          //this.state.markers.splice(i, 1);
          //console.log("MarkersHidden Se eliminará y agregará");
          this.addDeletedList(this.state.markersHidden[k].idespacio);
          break;
        }

        //Si es el ultimo entonces no paso nada y podemos preguntar en markersnew
        if(k === this.state.markersHidden.length - 1){
          //console.log("No paso nada MarkersHidden" + k);
          for(var j = 0; j < this.state.markersNew.length; j++){
            if(this.state.markersNew[j].coordinates.lat === newEle.coordinates.lat && this.state.markersNew[j].coordinates.lng===newEle.coordinates.lng){
              //console.log("MarkersNew" + j);
              this.state.markersNew.splice(j, 1);

              break;
            }
          }
          this.setState({markersNew: this.state.markersNew});
        }
      }


      }else{

        for(i = 0; i < this.state.markers.length; i++){
          //Aqui lo eliminamos de markers
        if(this.state.markers[i].coordinates.lat === newEle.coordinates.lat && this.state.markers[i].coordinates.lng===newEle.coordinates.lng){
          this.state.markers.splice(i, 1);
          //this.addDeletedList(this.state.markers[i].idespacio);
          break;
        }
      }
      this.setState({markers: this.state.markers});
      console.log(this.state.markers);
      }

    }

}

onMapClicked = (location, map) => {

  if(!this.state.isShowingInfo){
      map.panTo(location);
      var lati = location.lat();
      var longi = location.lng();
      var newEle = {
        coordinates:
          { lat:lati,
            lng:longi
          }
      };
      var newElePoly ={ 
          lat:lati,
          lng:longi
        };

  if(this.state.isAddingZona && !this.state.isAddingEspaciosParken){
    if(this.state.isEditing){

      if(this.state.contador === 0){
        this.setState({polygon: []});
      }
      this.setState({
        location: location,
        markers: this.state.markers.concat([newEle]),
        polygon: this.state.polygon.concat([newElePoly])
      });
      this.setState({polygonOne: this.state.polygon,
      contador: this.state.contador+1});

    }else{
      this.setState({
        location: location,
        markers: this.state.markers.concat([newEle]),
        polygon: this.state.polygon.concat([newElePoly]),
      });

      this.setState({polygonOne: this.state.polygon});
      console.log(this.state.polygon);
    }
    console.log(this.state.markers);

  }else{
    if(this.state.isEditing){
      this.setState({
        location: location,
        markers: this.state.markers.concat([newEle]),
          markersNew: this.state.markersNew.concat([newEle])});
    }else{
      this.setState({
        location: location,
        markers: this.state.markers.concat([newEle]),
      });
    }
    console.log(this.state.polygon);
    console.log(this.state.markers);
  }
}
}

handleSubmit = event => {
  event.preventDefault();
  var self = this;
  if(this.state.isAddingZona && !this.state.isAddingEspaciosParken){
   // this.setState({showLoading: true});
   this.setState({polygonOne: [], polygon: this.state.polygonBefore}, ()=>console.log(this.state));
    //El next step is to clean the map (but not the polygone array)
    //block the inputs
    //Clean the markers
    //Verificamos si los extremos son iguales, si no lo son
    //Los cerramos para que puedan voltearse y agregarse
    //console.log("Extremos del poligono");
    //console.log(this.state.polygon[0]);
    //console.log(this.state.polygon[this.state.polygon.length -1 ]);
    if(this.state.polygon[0].lat !== this.state.polygon[this.state.polygon.length -1 ].lat &&
      this.state.polygon[0].lng !== this.state.polygon[this.state.polygon.length -1 ].lng){
      //console.log("Si se va a concatenar");
      this.setState({ polygon: this.state.polygon.concat([this.state.polygon[0]])});
    }else{
      this.setState({polygon: this.state.polygon});
    }

    this.setState({markers:[],
    polygonOne:this.state.polygon.reverse(),
    colorFill: "#000000",
    colorStrike: "#000000",
    isPolygonClickable: true});
    this.setState({
      isAddingZona: true,
      isAddingEspaciosParken: true,
      polygonTwo: this.state.polygonWorld,
      titleButton: "Agregar zona Parken",
      labelOverMap: "Dibuja dentro el perímetro todos los espacios de la nueva zona Parken:"
    });
    console.log(this.state.polygonOne);
    //Show the polygone
    //change the title button => "Agregar zona Parken"
    //
    //to change the map

    if(this.state.isEditing){
      this.setState({markers: this.state.markersHidden,
        polygonTwo: this.state.polygonWorld,
        contador:0,
        readyForEdit: true,
        labelOverMap: "Dibuja dentro el perímetro todos los espacios parken. Para agregar haz click en la ubicación exacta o haz click en un espacio para eliminarlo."});

    }
  }else{
    this.agregarZonaParken();
  }
}

renderMap(){
  const style = {
    width: '100%',
    height: '80vh'
  }

  return(
    <div style={{ height: '80vh', width: '100%', position: 'relative' }}>
      <Map
        key={123}
        google={this.props.google}
        style={style}
        initialCenter={this.state.userLocation}
        disableDefaultUI={true}
        zoomControl = {true}
        zoom={18}
        onClick={(t, map, c) => this.onMapClicked(c.latLng, map)}>
          <Polygon
            paths={[this.state.polygonOne,this.state.polygonTwo]}
            clickable={this.state.isPolygonClickable}
            strokeColor={this.state.colorStrike}
            strokeOpacity={0.8}
            strokeWeight={2}
            fillColor={this.state.colorFill}
            fillOpacity={0.3} >
          </Polygon>
          {this.state.markers.map((marker, i) => (
            <Marker
              position={marker.coordinates}
              onClick={this.onMarkerClicked}
              key={500+i}/>))
          }
      </Map>
    </div>
  )
}


renderAddZones() {

  return (
    <div className="Zonas" key={128} >
    <PageHeader ><button className='but' onClick={this.setNoAddingZona}>{"←"}</button>{this.state.title}</PageHeader>
      <form className="Formulario" onSubmit={this.handleSubmit}>
      <Form inline>
        <FormGroup controlId="nombre" bsSize="small" >
          <ControlLabel>Nombre de la zona</ControlLabel>{' '}

          <FormControl
          autoFocus
          disabled={this.state.isShowingInfo}
           value={this.state.nombre}
           onChange={this.handleChange}
           type="text"
          />

        </FormGroup>
        {this.state.isShowingInfo ?
        <FormGroup controlId="estatus" bsSize="small">
          <ControlLabel>Estatus</ControlLabel> {' '}
          <FormControl
           value={this.state.estatus}
           disabled={this.validateEstatus()}
           type="text">
          </FormControl>
          </FormGroup>
         :
         <FormGroup controlId="estatus" bsSize="small">
            <ControlLabel>Estatus</ControlLabel> {' '}
            <div className="form-group">
              <select className="form-control"  ref="selectStatus" disabled={!(this.state.supers.length > 0)}>
                <option selected disabled hidden >{this.state.estatus}</option>
                <option onClick={this.setEstatus.bind(this, "DISPONIBLE")}>DISPONIBLE</option>
                <option onClick={this.setEstatus.bind(this, "NO DISPONIBLE")}>NO DISPONIBLE</option>
              </select>
            </div>
          </FormGroup>
    }


    <FormGroup controlId="precio">
    <ControlLabel>Precio por espacio Parken (5 minutos)</ControlLabel>{' '}
    <InputGroup>
    <InputGroup.Addon>$</InputGroup.Addon>

          <FormControl
           value={this.state.precio}
           disabled={this.state.isShowingInfo}
           onChange={this.handleChangeNumber}
           type="number"
           />
          <InputGroup.Addon>.00</InputGroup.Addon>

          </InputGroup>

        </FormGroup>
        </Form>
        {this.state.isAddingZona ?
               <div className="sublist">
               {this.state.isEditing || this.state.isShowingInfo ?
                <ControlLabel>Supervisores</ControlLabel>:
                <div></div>}
                 {this.state.supers.length > 0 ?
                   [{}].concat(this.state.supers).map(
                   (supervisor, i) =>
                     i !== 0
                       ?
                       <ListGroupItem
                       header={supervisor.nombre.trim() + ' ' + supervisor.apellido}>
                           <div>{supervisor.email}</div>
                           <div>{supervisor.nombrezonaparken}</div>
                           </ListGroupItem>
                       :<div></div>
                     ):(this.state.isShowingInfo || this.state.isEditing) ?
                        <div>Sin supervisores asignados</div>: <div></div>
                 }
                 {!this.state.isShowingInfo && this.state.isAddingZona && this.state.isEditing?
                    <button className='delete btn btn-success btn-default'
                    onClick={this.irASupervisor}>
                    Agregar supervisor
                    </button>:<div></div>
                 }
                </div>
                :<div className="sublist"></div>
        }
                <div className="sublist">
                {this.state.isEditing && !this.state.isShowingMap?
                <button className='delete btn btn-warning btn-default'
                  onClick={this.setMap}
                >
                Editar mapa
                </button>:<div></div>}
                </div>
        {this.state.isShowingMap ?
        this.state.isAddingZona && this.state.isShowingInfo ?
        <div className="f"></div>:
        <div className="f">
        <FormGroup controlId="espacios">
        <ControlLabel>{this.state.labelOverMap}</ControlLabel>{' '}
        </FormGroup>
        </div> :<div></div>}
      {
        <div className="Mapi">
        {this.state.isShowingMap ?
        this.renderMap():
        <div></div>
        }

        </div>
      }

      {this.state.isShowingMap ?
      this.state.isAddingZona && this.state.isShowingInfo ?
        <div></div>:
        <div>
        <div className='btn'>
        <button className='delete btn btn-danger btn-sm'
                disabled={!this.validateInputMapReset()}
                onClick={this.clearMapOfMarkers}>
        Restablecer mapa
        </button>
      </div>
      {!this.state.isShowingInfo && !this.state.readyForEdit?
      <div className='btn'>
      <LoaderButton className='btn btn-primary'
          block
          bsSize="large"
          disabled={!this.validateInfoZone()}
          type="submit"
          isLoading={this.state.isLoading}
          text={this.state.titleButton}
          loadingText="Procesando..."/>
      </div>:<div></div>}
      </div>:<div></div>}

          {this.state.isEditing ?
            <div>
              <div className='btn'>
                <button className='delete btn btn-success btn-lg'
                        disabled={!this.validateInputMap()}
                        type="button"
                        onClick={this.showAlert.bind(this,"Editar zona Parken",
                                      "¿Estás seguro de modificar la información de la zona Parken?",
                                      true, "info", "Cancelar",
                                      true, "danger", "Editar")}>
                  Guardar cambios
                </button>
              </div>
            </div> : <div></div>}
      </form>
  </div>
  )
}

renderZonasList(zone) {
return (
<div className="list">{
[{}].concat(zone).map(
  (zone, i) =>
    i !== 0
      ?
      <ListGroupItem header={'Zona ' + zone.nombre} key={131+i}>
      {/*<div className='btn-group ml-auto'>*/}
             <button className='delete btn btn-info'
              onClick={this.infoZona.bind(this, zone)}>
              Ver
              </button>
              <button className='delete btn btn-success'
                onClick={this.setEdit.bind(this, zone)}
              >
              Editar
              </button>
              <button className='delete btn btn-danger'
              onClick={this.showAlert.bind(this,"Eliminar zona Parken",
              "¿Estás seguro de eliminar la zona Parken?",
              true, "info", "Cancelar",
              true, "danger", "Eliminar", zone.id)}>
              Eliminar
              </button>
              {/*</div>*/}
      </ListGroupItem>
      :<ListGroupItem onClick={this.addNewZone} key={131}>
            <h4>
              <b>{"\uFF0B"}</b> Agregar zona Parken
            </h4>
          </ListGroupItem>
)}
</div>
)
}


renderLander() {
return (
  <div className="load">
  <h4>
    Cargando zonas Parken...
  </h4>
</div>
);
}


renderZonas() {
return (
  <div className="Zonas" key={125}>
    <ListGroup>
      {!this.state.isLoading && this.renderZonasList(this.state.zonas)}
    </ListGroup>
  </div>
);
}

render() {
  return (
    <div className="Zonas" key={126}>
    {this.props.isAuthenticated ?
    (this.state.isConnected ?
      (this.state.isShowingInfo ?
        this.renderAddZones(): (this.state.isAddingZona ?
           <div>{this.renderAddZones()}</div>: this.renderZonas())):
    this.renderLander()
  ):
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

}export default GoogleApiWrapper({
  apiKey: ("AIzaSyDkmiXSeUvTkbXgV7UYpwmhiysqkrjqcZ0")
})(Zonas)
