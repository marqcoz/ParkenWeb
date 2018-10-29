import React, { Component } from 'react';
import {GoogleApiWrapper, Map, Polygon, Marker} from 'google-maps-react';
import {PageHeader,InputGroup, FormGroup, FormControl, ControlLabel, ListGroup, ListGroupItem } from "react-bootstrap";
import axios from 'axios';
import LoaderButton from "../components/LoaderButton";
import "./Zonas.css";

export class Zonas extends Component {
  constructor(props) {
    super(props);

this.state = {
  idzonaparken: "",
  nombre : "",
  estatus: "NO DISPONIBLE",
  precio: "",

  isShowingInfo: false,
  isAddingZona: false,
  isAddingEspaciosParken: false,
  loading: true,

  title:"",
  titleButton:"",

  userLocation: { lat: 19.432551, lng: -99.133022 },

  location:[{ lat: 19.432551, lng: -99.133022 },{
    lat: 40.854885,
    lng: -88.081807
  } ],
  markers: [],
    //Hay que obtener este json
    
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
  isPolygonClickable: false,
  isLoading: true,
  isConnected: false,
  thereAdmins: true,
  isEditing: false,

  notes: [],
  persons: [],
  zonas: []
};

this.infoZona = this.infoZona.bind(this);
this.addNewZone = this.addNewZone.bind(this);
this.setEstatus = this.setEstatus.bind(this);
this.onMapClicked = this.onMapClicked.bind(this);
this.handleChange = this.handleChange.bind(this);
this.handleChangeNumber = this.handleChangeNumber.bind(this);
this.validateInfoZone = this.validateInfoZone.bind(this);
this.onMarkerClicked= this.onMarkerClicked.bind(this);
this.clearMapOfMarkers = this.clearMapOfMarkers.bind(this);

}

async gettingLocation(){

  await navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;

      this.setState({
        userLocation: { lat: latitude, lng: longitude },
        loading: false,
        isAddingZona: true
      });
    },
    () => {
      this.setState({ 
        loading: false, isAddingZona: true });
    }
  );
}

componentDidMount() {

axios.get('http://localhost:3000/administrador/obtenerZonasParken')
.then(res => {
 const zonas = res.data.ZonasParken;
 console.log(zonas);
 if(zonas.success === 2){
  this.setState({isLoading : false})
  this.setState({isConnected : false})

 }else{
  this.setState({ zonas });
  this.setState({isLoading : false})
  this.setState({isConnected : true})
 }
 
}).catch(error => {
alert(error.message);
this.setState({isLoading : false})
this.setState({isConnected : false})
});
}

infoZona(zona){
  console.log(zona);
  this.setState({ 
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
    polygonOne: zona.coordenadas, 
    polygonTwo: [],
    userLocation: {lat: zona.centro[0].lat , lng: zona.centro[0].lng },
    loading:false
   });
}

addNewZone(){
 // alert("Se agregara una nueva zona Parken");
  this.setState({ title: "Agregar zona Parken", titleButton:"Agregar espacio Parken", isAddingEspaciosParken: false,
polygonOne: this.state.polygon, polygonTwo:[] });
  this.gettingLocation();

}

setEstatus(est){
  this.setState({estatus: est});
}


validateForm() {
  return this.state.nombre.length > 0 && 
  this.state.precio.length > 0 
  && this.state.estatus.length > 0; 

}

handleChange(event) {
  
  this.setState({
    [event.target.id]: event.target.value
  });
}

validateInfoZone(){
  if(this.state.isAddingZona){
    return this.state.nombre.length >0 && 
    this.state.estatus.length > 0 &&
    this.state.precio.length > 0 &&
    this.state.polygon.length > 2;
  }else{
    return false;
  }
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
  alert("Se presiono");
  this.setState({markers:[],
    polygon:[] 
  });
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
      for(var i = 0; i < this.state.markers.length; i++){
        if(this.state.markers[i].coordinates.lat==newEle.coordinates.lat && this.state.markers[i].coordinates.lng==newEle.coordinates.lng){
          this.state.markers.splice(i, 1);
          break;
        }
      }
      
      this.setState({markers:this.state.markers});
    }
      
}

onMapClicked = (location, map) => {

      console.log(location, map);
      map.panTo(location);
      console.log((this.state.markers));
      var lati = location.lat();
      var longi = location.lng();
      var newEle = {
        coordinates: 
        { lat:lati, 
          lng:longi
        }
      };
      var newElePoly = 
        { lat:lati, 
          lng:longi
        }
      ;

  if(this.state.isAddingZona && !this.state.isAddingEspaciosParken){
      this.setState({ 
        location: location,
        markers: this.state.markers.concat([newEle]),
        polygon: this.state.polygon.concat([newElePoly]),
      });

      this.setState({polygonOne: this.state.polygon});

  }else{
    //Si esta agregando zonas, entonces el resultado del puntito lo agregamos a otro json
    this.setState({ 
      location: location,
      markers: this.state.markers.concat([newEle]),
    });

  }
  
  
};

handleSubmit = event => {
  event.preventDefault();
  var self = this;
  if(this.state.isAddingZona && !this.state.isAddingEspaciosParken){
    //El next step is to clean the map (but not the polygone array)
    //block the inputs
    //Clean the markers
    this.setState({ 
      polygon: this.state.polygon.concat([this.state.polygon[0]])
    });
    console.log(this.state.markers);
    console.log(this.state.polygon);
    console.log(this.state.polygonOne);
    console.log(this.state.polygonTwo);
    this.setState({markers:[],
    polygonOne:this.state.polygon.reverse(),
    colorFill: "#000000",
    colorStrike: "#000000",
    isPolygonClickable: true});
    this.setState({
      isAddingZona: true,
      isAddingEspaciosParken: true,
      polygonTwo: this.state.polygonWorld});
    //Show the polygone
    //change the title button => "Agregar zona Parken"
    //
    //to change the map 
  }else{
    //Enviamos la peticion para agregar una zona Parken 
    
    console.log(this.state.polygon);
    var payload = {
     "nombre": this.state.nombre,
     "estatus" :this.state.estatus,
     "precio" : this.state.precio,
     "coordenadasPoly": this.state.polygon,
     "coodenadasMarker": this.state.markers
    }
    axios.post('http://localhost:3000/administrador/agregarZonaParken', payload)
    .then(res => {
      const response = res.data;
      console.log(response);
      if(response.success === 2){
       this.setState({isLoading : false})
   
      }else{
        if(response.success === 1){
          alert("Zona agregada exitosamente!");
          this.setState({isAddingZona:false, isAddingEspaciosParken: false});
        }else{
          if(response.success === 6){
            alert("El nombre de la zona Parken ya existe.");
          }
          if(response.success === 7){
            alert("El perimetro de la zona Parken se intersecta con otra zona.");
            this.setState({polygon:[], markers: [], colorStrike:"#F44336",
            colorFill: "#F44336"});
            self.addNewZone();
          }else{
            alert(response.error);
          }
          
        }
       this.setState({isLoading : false})
      }
      
    }).catch(error => {
     alert(error.message);
     this.setState({isLoading : false})
   });
  }
}

renderMap(){
  const style = {
    width: '70%',
    height: '60%'
  }
  
  return(
    <div className="Mapi">
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
  key={500+i}
  />
  ))}
  </Map>
  </div>
  )
}


renderAddZones() {
 
  if (this.loading) {
    return null;
  }
  return (
    <div className="Zonas" key={128} >
    
    <PageHeader>
    {this.state.title}
    </PageHeader>

      <form onSubmit={this.handleSubmit}>
      
        <FormGroup controlId="nombre" bsSize="small">
          <ControlLabel>Nombre de la zona</ControlLabel>
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
          <ControlLabel>Estatus</ControlLabel>
          <FormControl
           value={this.state.estatus}
           disabled={this.state.isShowingInfo}
           type="text"
          /></FormGroup> : 
          <FormGroup controlId="estatus">
      <ControlLabel>Estatus</ControlLabel>
      <FormControl componentClass="select" placeholder={this.state.estatus}>
        <option onClick={this.setEstatus.bind(this, "NO DISPONIBLE")}>NO DISPONIBLE</option>
        <option onClick={this.setEstatus.bind(this, "DISPONIBLE")}>DISPONIBLE</option>
      </FormControl>
    </FormGroup>}
        
    <FormGroup controlId="precio">
    <ControlLabel>Precio</ControlLabel>
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
        {this.state.isAddingZona && this.state.isShowingInfo ?
        <div></div>: <button className='delete btn btn-danger' 
        onClick={this.clearMapOfMarkers}>
        Limpiar mapa
    </button>  }

{!this.state.isShowingInfo ? <LoaderButton className='btn btn-primary'
block
bsSize="large"
disabled={!this.validateInfoZone()}
type="submit"
isLoading={this.state.isLoading}
text={this.state.titleButton}
loadingText="Procesando..."
/>:<div></div>}
        
      </form>
      {this.renderMap()}
  </div>
  )
}

renderZonasList(zone) {
return (

[{}].concat(zone).map(
  (zone, i) =>
    i !== 0
      ?
      <ListGroupItem header={'Zona ' + zone.nombre} key={131+i}
      onClick={this.infoZona.bind(this, zone)}>
      </ListGroupItem>
      :<ListGroupItem onClick={this.addNewZone} key={131}>
            <h4>
              <b>{"\uFF0B"}</b> Agregar zona Parken
            </h4>
          </ListGroupItem>
)
)
}


renderLander() {
return (
  <div className="Zonas" key={124}>
    <h1>Zonas Parken</h1>
    <ListGroupItem onClick={this.setAddingAdmins}>
            <h4>
              <b>{"\uFF0B"}</b> Agregar zona Parken
            </h4>
          </ListGroupItem>
  </div>
);
}


renderZonas() {
return (
  <div className="Zonas" key={125}>
    <PageHeader>Zonas Parken</PageHeader>
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
    </div>
  );
}

}export default GoogleApiWrapper({
  apiKey: ("AIzaSyDkmiXSeUvTkbXgV7UYpwmhiysqkrjqcZ0")
})(Zonas)