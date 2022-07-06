import React, { Component } from 'react';
import './App.css';


import Cookies from 'universal-cookie';

import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faEdit, faEye, faPrint, faTrashAlt, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ReactToPrint from 'react-to-print';
import swal from 'sweetalert';
const url = "http://localhost:8080/api/v1/lider/";
const ur2 = "http://localhost:8080/api/v1/promovido/promovidos/";
const ur3 = "http://localhost:8080/api/v1/promovido/";

const cookies = new Cookies();




/* *******************************************************************************************************************************************/



/* *******************************************************************************************************************************************/


class App extends Component {
  state = {
    data: [],
    registros:[],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      identificador: '',
      nombres: '',
      apellidos: '',
      tipoModal: ''
    }
  }


  peticionGet = () => {
    axios.get(url).then(response => {
      this.setState({ data: response.data.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionPost = async () => { 
    if(this.state.form!=null){
if(this.state.form.nombres!=null && this.state.form.apellidos!=null && this.state.form.nombres!='' && this.state.form.apellidos!=''){
    await axios.post(url, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
      swal(response.data.mensaje);
    }).catch(error => {
      console.log(error.message);
    })
    }
    else{swal("Todos los campos son requeridos"); }}
    else{swal("Todos los campos son requeridos");}
  }


  peticionPut = () => {
    axios.put(url + this.state.form.identificador, this.state.form).then(response => {
      
      this.modalEditar();
      this.peticionGet();
      this.modalEstado();

    })
  }

  peticionDelete = () => {
    axios.delete(url + this.state.form.identificador).then(response => {
      

      axios.get(ur2 + this.state.form.identificador).then(response => {
        this.setState({ registros: response.data.data });
        console.log(this.state.registros);
      

        this.state.registros.map(registro => {
          return (
            axios.delete(ur3 + registro.curp).then(response => {
              
            })
          )
        })
      })
      this.setState({ modalEliminar: false });
      this.peticionGet();

    })

    
    

  }

  liderSeleccionados = () => {
    axios.delete(url + this.state.form.identificador).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    })
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  }

  modalEditar = () => {
    this.setState({ modalEditar: !this.state.modalEditar });
  }

  modalEstado = () => {
    this.setState({ modalEstado: !this.state.modalEstado });
  }


  modalEliminar = () => {
    this.setState({ modalEliminar: !this.state.modalEliminar })
  }

  seleccionarLider = (lider) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        identificador: lider.identificador,
        nombres: lider.nombres,
        apellidos: lider.apellidos
      }
      
    })
    cookies.set('identificador', lider.identificador, {path: "/"});
  }

  ObtenerLider = (lider) => {
    cookies.set('identificador', lider.identificador, {path: "/"});
    cookies.set('nombreL', lider.nombres, {path: "/"});
    cookies.set('ApellidoL', lider.apellidos, {path: "/"});
    console.log("el identificador es "+cookies.get('identificador'));
    window.location.href="./lider";
  }



  handleChange = async e => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
  }

  componentDidMount() {
    
    if(!cookies.get('username')){
      window.location.href="./";
  }

  this.peticionGet();
  }
  
  cerrarSesion=()=>{
    cookies.remove('id', {path: "/"});
    cookies.remove('username', {path: "/"});
    window.location.href='./';
}


  render() {
    console.log("la id es: "+cookies.get('id'));
    console.log("el usuario es: "+cookies.get('username'));

    const { form } = this.state;
    return (

      <div className="App">

        <nav className="navbar navbar-expand-lg bg-light border" id='Barra'>
          <div className="container-fluid">
            <ul className="navbar-nav mx-auto">
              <li>
                <h1 className='mb-0'>Registro de lideres</h1>
              </li>
            </ul>
          </div>
        </nav>

        <br></br>

        <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Crear lider</button>
        {"   "}
        <button className="btn btn-danger" onClick={()=>this.cerrarSesion()}>Cerrar Sesión</button>
        <br /><br />
        <table className="table table-hover table-responsive text-justify">
          <thead className='table-dark '>
            <tr>
              <th>Identificador</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(lider => {
              return (
                <tr key={lider.identificador}>
                  <td>{lider.identificador}</td>
                  <td>{lider.nombres}</td>
                  <td>{lider.apellidos}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => { this.seleccionarLider(lider); this.modalEditar() }}><FontAwesomeIcon icon={faEdit} /></button>
                    {"   "}
                    <button className="btn btn-danger" onClick={() => { this.seleccionarLider(lider); this.setState({ modalEliminar: true }) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
                    {"   "}
                    <button className="btn btn-warning" onClick={() => { this.ObtenerLider(lider);  }}><FontAwesomeIcon icon={faEye} /></button>
                  </td>


                </tr>
              )
            })}
          </tbody>
        </table>



        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: 'block' }} className='bg-success text-white'>
            CREAR NUEVO LIDER
            <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}><FontAwesomeIcon icon={faCircleXmark} /></span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="nombres">Nombres</label>
              <input className="form-control" type="text" name="nombres" id="nombres" required onChange={this.handleChange} value={form ? form.nombres : ''} />
              <label htmlFor="apellidos">Apellidos</label>
              <input className="form-control" type="text" name="apellidos" id="apellidos" required onChange={this.handleChange} value={form ? form.apellidos : ''} />
              <br />
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal == 'insertar' ?
              <button className="btn btn-success" onClick={() => this.peticionPost()}>
                Insertar
              </button> : <button className="btn btn-primary" onClick={() => this.peticionPut()}>
                Actualizar
              </button>
            }
            <button className="btn btn-danger" onClick={() => this.modalInsertar()}>Cancelar</button>
          </ModalFooter>
        </Modal>



        <Modal isOpen={this.state.modalEditar}>
          <ModalHeader style={{ display: 'block' }} className="bg-primary text-white">
            ACTUALIZAR LIDER
            <span style={{ float: 'right' }} onClick={() => this.modalEditar()}><FontAwesomeIcon icon={faCircleXmark} /></span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="identificador">Identificador</label>
              <input className="form-control" type="number" name="identificador" id="identificador" readOnly onChange={this.handleChange} value={form ? form.identificador : this.state.data} />
              <br />
              <label htmlFor="nombres">Nombres</label>
              <input className="form-control" type="text" name="nombres" id="nombres"  onChange={this.handleChange} value={form ? form.nombres : this.state.data} />
              <br />
              <label htmlFor="apellidos">Apellidos</label>
              <input className="form-control" type="text" name="apellidos" id="apellidos" onChange={this.handleChange}  value={form ? form.apellidos : this.state.data} />
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal == 'insertar' ?
              <button className="btn btn-success" onClick={() => this.peticionPost()}>
                Insertar
              </button> : <button className="btn btn-primary" onClick={() => this.peticionPut()}>
                Actualizar
              </button>
            }
            <button className="btn btn-danger" onClick={() => this.modalEditar()}>Cancelar</button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.modalEliminar}>
          <ModalHeader style={{ display: 'block' }} className="bg-danger text-white">
            ELIMINAR LIDER
            <span style={{ float: 'right' }} onClick={() => this.modalEliminar()}><FontAwesomeIcon icon={faCircleXmark} /></span>
          </ModalHeader>
          <ModalBody>
            Estás seguro que deseas eliminar a {form && form.nombres +" " +form.apellidos}
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => this.peticionDelete()}>Sí</button>
            <button className="btn btn-primary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
          </ModalFooter>
        </Modal>

        
      </div>








    );
  }
}






export default App;