import {Buttons, TextBox, DisplayText, VariableMenu, ProcessMenu, RadioSelect} from './ComponentList.js'
import { Component, useCallback, useMemo} from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MarkerType,} from 'reactflow'; 
import {useTable} from "react-table"

import 'reactflow/dist/style.css';
import axios from 'axios';

export class LoginForm extends Component{
  constructor(props){
    super(props)
    this.state = {
      Username : " ", 
      Password : " ", 
    }
  }

  onChangeUser(e){
    this.setState({Username : e.target.value})
  }

  onChangePass(e){
    this.setState({Password : e.target.value})
  }


  onSubmit(e){
    e.preventDefault() 
    console.log(this.state)
    



  }

  render(){
    return(
      <div>
        <form onSubmit = {(e) => this.onSubmit(e)}> 
          <h6>Enter your Username Here</h6>
          <input type="text" onChange = {(e)=>this.onChangeUser(e)} value = {this.state.Username} placeholder = "Username"/>
          <h6>Enter you Password Here</h6>
          <input type="text" onChange = {(e)=>this.onChangeUser(e)} value = {this.state.Password} placeholder = "Password"/>
          <br></br>
          <input type="submit" value="Login"/>
        </form> 
      </div>
    
    )
  }


}


class MainForm extends Component{

  constructor(props){
    super(props)
    this.state = {
      Username : " ", 
      Password : " ", 
    }
  }
}
   





function App() {


  return (
    <div className="App">
      <h1>NetLink</h1>
      <LoginForm/>
    </div>
  );
}

export default App;
