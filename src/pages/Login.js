import React, { Component } from 'react';
import '../css/Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import swal from 'sweetalert';
import Cookies from 'universal-cookie';

const baseUrl="https://udos.herokuapp.com/api/v1/usuario/";
const cookies = new Cookies();

class Login extends Component {
    state={
      data: [],
        form:{
            id: '',
            username: '',
            password: ''
        }
    }
  
    handleChange=async e=>{
        await this.setState({
            form:{
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    }
  
    iniciarSesion=async()=>{
        await axios.get(baseUrl+this.state.form.id)
        .then(response=>{
          this.setState({ data: response.data.data });
            if(this.state.data[0].password == this.state.form.password && this.state.data[0].id == this.state.form.username){
                cookies.set('id', this.state.data[0].id, {path: "/"});
                cookies.set('username', this.state.data[0].username, {path: "/"});

                swal(`Bienvenido`);
              window.location.href="./principal";
              
              
          }else{
            swal('El usuario o la contraseña no son correctos');
           
          }
  
        })
  
    }
  
    componentDidMount() {
        if(cookies.get('username')){
          alert(`Hola`);
        }
    }
    
  
    render() {
        return (
    <div className="containerPrincipal">
        <div className="containerSecundario">
          <div className="form-group">
            <label>Usuario: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="username"
              onChange={this.handleChange}
            />
            <br />
            <label>Contraseña: </label>
            <br />
            <input
              type="password"
              className="form-control"
              name="password"
              onChange={this.handleChange}
            />
            <br />
            <button className="btn btn-primary" onClick={()=> this.iniciarSesion()}>Iniciar Sesión</button>
          </div>
        </div>
      </div>
        );
    }
  }
  
  
  
  export default Login;