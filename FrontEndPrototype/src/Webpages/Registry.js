import {Buttons, TextBox, DisplayText, VariableMenu, ProcessMenu, RadioSelect} from './ComponentList.js'
import { Component, useCallback, useMemo} from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, MarkerType,} from 'reactflow'; 
import {useTable} from "react-table"
import axios from 'axios'

import 'reactflow/dist/style.css';



class InterestList extends Component{
  constructor(props){
    super(props)
    this.state = {
      SelectedInterest: []
    }

    // Initialize the values of the interest list: 
    let tomasVector = []
    for(let i = 0; i < this.props.tagList.length; i++){
      let newString = this.props.tagList[i]
      let omar = {
        "name" : newString,
        "value" : false 
      }
      this.state.SelectedInterest.push(omar)
    }

    
  }

  handleCheck(e){
    let interest = e.target.id 
    let stateCopy = Object.assign(this.state.SelectedInterest) 
    for(let i = 0; i < stateCopy.length; i++){
        if(stateCopy[i].name == interest){
          stateCopy[i]["value"] = !stateCopy[i]["value"] 
        }
    }
    this.setState({SelectedInterest : stateCopy},  
    this.props.assignTags(this.state.SelectedInterest))



  }



  render(){
    return(
      <div>
        {this.props.tagList.map((category, key) => 
        <div key = {key}>
        <label id = "interestTag" for = {category}>{category}</label>
        <input id = {category} type="checkbox" onChange = {(e) => this.handleCheck(e)}/>
        </div>)}
      </div>
    )
  }


}

class RegisterForm extends Component{
  constructor(props){
    super(props)
    this.state = {
      Email : " ", 
      Username : " ", 
      Password : " ", 
      ConfirmPassword : " ", 
      InterestList : []
    }
  }
  async postState(elementToSend){
    await axios.post("http://localhost:5000/api/register", elementToSend)
    .then(
      response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
  }
  onChangeEmail(e){
    this.setState({Email : e.target.value})
  }
  onChangeUsername(e){
    this.setState({Username : e.target.value})
  }
  onChangePassword(e){
    this.setState({Password : e.target.value})
  }
  onChangeConfPass(e){
    this.setState({ConfirmPassword : e.target.value})
  }
  setInterestState(e){
    this.setState({InterestList : e})
    console.warn(this.state.InterestList)
  }
  onSubmit(e){
    e.preventDefault() 
    let tempList= []
    for(let i = 0 ; i < this.state.InterestList.length; i++){
      let name = this.state.InterestList[i].name 
      let incl = this.state.InterestList[i].value
      if(incl){
        tempList.push(name)
      }
    }
    this.setState({InterestList : tempList}, () => this.postState(this.state))

  }



  render(){
    return(
      <div>
        <form onSubmit = {(e)=>this.onSubmit(e)}>
          <h6>Enter Email:</h6>
          <input type="email" onChange = {(e)=>this.onChangeEmail(e)}/>
          <h6>Enter Username</h6>
          <input type="text" onChange = {(e)=>this.onChangeUsername(e)}/>
          <h6>Enter Password:</h6>
          <input type="password" onChange = {(e)=>this.onChangePassword(e)}/>
          <h6>Confirm Password:</h6>
          <input type="password" onChange = {(e)=>this.onChangeConfPass(e)}/>
          <h6>Choose Interests:</h6>
          <InterestList tagList = {["Algorithms", "Biology", 
          "Mathematics", "Ecology", "Finance", "Supply Chain",
          "Programming"]} assignTags = {(e) => this.setInterestState(e)}/>
          <br></br>
          <input type="Submit" value = "Add Account"/>
        </form>
        


      </div>
    )
  }

}


class Register extends Component{

  constructor(props){
    super(props)
    this.state = {
      Username : " ", 
      Password : " ", 
    }
  }

  render(){
    return(
      <div>
        <RegisterForm/>
      </div>
    )
  }



}
   





function App() {


  return (
    <div className="App">
      <h1>Chronetex</h1>
      <Register/>
    </div>
  );
}

export default App;
