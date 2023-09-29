import {Buttons, TextBox, DisplayText, VariableMenu, ProcessMenu, RadioSelect} from './ComponentList.js'
import {ObjectMenu, Table, TableCutID, DeviceMethodContainer} from './ComponentsList2'
import { create } from 'zustand';
import { Component, useCallback, useEffect, useMemo, useState} from 'react';
import ReactFlow, {Handle, useNodesState, useEdgesState, addEdge, applyEdgeChanges, applyNodeChanges} from 'react-flow-renderer';
import { Background, BackgroundVariant, ReactFlowProvider } from 'reactflow';
import {useTable} from "react-table"
import {ProcessNode, RevisedNode, DeviceNode, MethodNodeVal, DevMethodVisualize} from "./playground.js"


import 'reactflow/dist/style.css';
import ButtonEdge from './ButtonEdge.js';
import { render } from '@testing-library/react';
import axios from 'axios';
import { redirect } from 'react-router';


const nodeTypes = {ProcNode  : ProcessNode, RevNode : RevisedNode, MethNode : MethodNodeVal, DevNode : DeviceNode}


class ClickableLeftSideBar extends Component{
    constructor(props){
        super(props)
        this.state = {
            
        }
    }
    
    handleOptionChange(e){
        this.props.SelectModChange(e.target.id)
    }

    render(){
        return(
            <div>
                <table className = "MethTable" style={{"border" : '50px'}}>
                    <div style={{color:'#00FFFA', fontSize:"20px"}}>
                        <tr>
                            <th>Object Components:</th>
                        </tr>
                        <tr>
                            <th>Name : {this.props.ObjName}</th>
                        </tr>
                        
                        {this.props.Options.map((value, index) => 
                            <tr key = {index}><td onClick = {(e) => this.handleOptionChange(e)} 
                            id = {value} className="ObjectMenuOption">{value}</td></tr>
                        )}
                    </div>
                </table>

            </div>
        )
    }
}

class Checkbox extends Component{
    constructor(props){
        super(props)
        this.state = {
            Sel_Features : [] 
        }
    }

    handleSelect(new_Item){
        if(this.state.Sel_Features.includes(new_Item)){
            let Sel_Index = this.state.Sel_Features.indexOf(new_Item);
            let copy_state = [...this.state.Sel_Feature].splice(1, Sel_Index);
            this.setState({Sel_Features : copy_state})
        }
        else{
            let copy_state = [...this.state.Sel_Feature].push(new_Item)
            this.setState({Sel_Features : copy_state})
        }
    }

    render(){
        return(
            <div>
                {this.props.ParamList.map((value, index) =>
                    <div key = {index} style = {{display:"flex"}}>
                        <input id={value}  name = "selection" type="checkbox"/>
                        <label style={{fontFamily: "monospace", color : "lightgreen"}} for={value}>{value}</label>
                    </div>
                )}
            </div> 
            
        )
    }
}

class QueryWriter extends Component{
    constructor(props){
        super(props)
        this.state = {
            comp_text_map : {}
        }
    }

    CompareArrys1d(arr1, arr2){
        if(arr1.length != arr2.length){
            return false 
        }
        for(let i = 0; i < arr1.length; i++){
            if(!arr2.includes(arr1[i])){
                return false
            }
        }
        return true 
    }

    componen

    componentDidUpdate(prevprops){
        if(!this.CompareArrys1d(prevprops.CompMap, this.props.CompMap)){
            let NewCompQueryMap = {} 
            for(let i = 0; i < this.props.CompMap.length; i++){
                NewCompQueryMap[this.props.compList[i]] = "" 
            }
            this.setState({comp_text_map : NewCompQueryMap}) 
        }
    }

    render(){
        return(
            <div>
                <form>
                {this.props.CompMap.map((value, index) =>  
                    <div key = {index} style = {{display : "flex", alignItems : "center"}}>
                        <label htmlFor = {value} style={{ fontFamily : "monospace", color :
                        '#00FFFA', width: "70px" }}>{value}</label>
                        <input style = {{padding:"5px", width:"250px"}} id type="text"/>
                    </div> 
                
                )}
                </form> 
            </div>
        )
    }
    

}



class QueryTable extends Component{ 

    



}


export const ObjectMenuNew = ({simID}) =>{
    const [selectMode, setSelectMode] = useState("Inputs")

    
    return(
        <div> 
        <Checkbox ParamList = {["hello", "world", "Richard"]}/>
        <ClickableLeftSideBar Options = {["Inputs", "Register", "Register Function",
        "Outputs", "Command Maps"]} ObjName = "Rohan" SelectModChange = {(val) => setSelectMode(val)}/>
        <QueryWriter CompMap = {["I", "Was", "Frozen", "Today"]}/>


        <h1>{selectMode}</h1>
        <TableCutID varLabels = {["Name", "Edit"]} entries={[["Hoe"], ["Patrick"]]} Editable={true}/>
        </div>
    ) 



}
