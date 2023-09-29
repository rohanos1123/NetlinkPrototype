import axios from 'axios';
import { Component, useCallback, useMemo} from 'react';
import ReactFlow, { Handle } from 'react-flow-renderer';

export class AddSimButton extends Component{

}

export class ProcessInfo extends Component{
    constructor(props){
        super(props)
        this.state = {
            SimName = " ", 
            SimDescription = " ", 
        }
    }

    async postState(elementToSent){
        await axios.post("http://localhost:5000/api/register", elementToSend)
        .then(
            response =>{
                console.log(response)
            })
        .catch(error =>{
                console.warn(error)
            })
        }
        
    onChangeName(e){
        this.setState({name : e.target.event}) 
    }

    onChangeDescription(e){
        this.setState({SimDescription : e.target.event})
    }

    handleSubmit(e){
        e.preventDefault() 
        this.postState(this.state)
        
    }

    

    render(){
        return(
            <div>
                <form onSubmit = {(e) => this.handleSubmit(e)}>
                    <label for = "Name">Simulation Name</label>
                    <input id = "Name" text = "input" onChange = {(e)=>this.onChangeName(e)} value = {this.state.SimName}/>
                    <label for = "Desc">Simulation Description</label>
                    <input id = "Desc" text = "input" onChange = {(e) => this.onChangeDescription(e)} value = {this.state.SimDescription}/>
                </form> 
            </div>

        )
    }

}


export default class Navbar extends Component{
    render(){
        return(
           <nav className = "nav">
               <a href="/">Chronotex</a>
               <ul>
                   <li>
                       <a href = "/graph">MyAccount</a>
                   </li>
                   <li>
                       <a href = "/user/MySimulations">MySimulations</a>
                   </li>
               </ul>

           </nav>
        )
    }
}

