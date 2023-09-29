import React, {Component, useCallback } from "react";
import {Handle, Position} from 'reactflow'
import axios from 'axios'



class Form extends Component{
    constructor(props){
        super(props); 
        this.state = {
            FormValue : ""
        }
    }

    handleChange(e){
        this.setState({FormValue : e.target.value}); 
    }

    handleSubmit(e){
        e.preventDefault(); 
        this.setState({FormValue : e.target.value});
        this.props.AssignValue(this.state.FormValue)
        }

    render(){
        return(
            <div>
                <form onSubmit = {(e)=>this.handleSubmit(e)}>
                    <label for="TextForm">{this.props.label}</label>
                    <input type="text" placeholder = {this.props.label} value = {this.state.FormValue}
                    onChange = {(e)=>this.handleChange(e)} />
                    <input type="submit" value = {"Apply"} />
                </form> 
            </div> 
        )
    }
}


export class Table extends Component{
    constructor(props){
        super(props); 
    }

    handleRowEdit(e){
        console.log(e.target.id); 
        this.props.getRowID(e.target.id); 
    }

    render(){
        const {varLabels, entries} = this.props; 

        return(
            <div className = "scrobj">
                { 
                this.props.Editable ?
                <div>
                <table className = "Register_Table">
                    <thead>
                        <tr>
                        {varLabels.map((name, val)=><th key = {val} >{name}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((row, value)=><tr key = {value}>
                        <td>{value}</td>{row.map((value, count) => <td key={count}>{value}</td>)} <td>
                        <button onClick = {(e)=>this.handleRowEdit(e)} id={value}>Edit</button></td> 
                        </tr>)}
                    </tbody>
                </table>
                </div>

                :

                <div>
                <table className = "Register_Ref">
                    <thead>
                        <tr>
                        {varLabels.map((name, val)=><th key = {val} >{name}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((row, value)=><tr key = {value}>
                        <td>{value}</td>{row.map((value, count) => <td key={count}>{value}</td>)}
                        </tr>)}
                    </tbody>
                </table>
                </div>}
            </div>            

        )
    }
}

export class TableCutID extends Component{
    constructor(props){
        super(props); 
    }

    handleRowEdit(e){
        console.log(e.target.id); 
        this.props.getRowID(e.target.id); 
    }

    render(){
        const {varLabels, entries} = this.props; 

        return(
            <div className = "scrobj">
                { 
                this.props.Editable ?
                <div>
                <table className = "Register_Table" style = {{minWidth : '300px'}}>
                    <thead>
                        <tr>
                        {varLabels.map((name, val)=><th key = {val} >{name}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((row, value)=><tr key = {value}>
                        {row.map((value, count) => <td key={count}>{value}</td>)} <td>
                        <button onClick = {(e)=>this.handleRowEdit(e)} id={value}>Edit</button></td> 
                        </tr>)}
                    </tbody>
                </table>
                </div>

                :

                <div>
                <table className = "Register_Ref">
                    <thead>
                        <tr>
                        {varLabels.map((name, val)=><th key = {val} >{name}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((row, value)=><tr key = {value}>
                        {row.map((value, count) => <td key={count}>{value}</td>)}
                        </tr>)}
                    </tbody>
                </table>
                </div>}
            </div>            

        )
    }
}

//Class for Register Functions
class RegisterFunction extends Component{
    constructor(props){
        super(props)
        this.state = {
            RegisterFunctions : this.props.srcList,
            EditRow : false, 
            EditTarget : -1,

            // New name: 
            newName : "Default",
            funcRule : "0", 
            servingVar : ""
        }

        this.handleUpdate = this.handleUpdate.bind(this); 
    }


    
    
    
    handleRowEdit(val){
    
        if(this.state.EditTarget != val){
            this.setState({EditRow : true})
            this.setState({EditTarget : val})
            console.log()
            const targetRow = this.state.RegisterFunctions[parseInt(val)] 

            this.setState({newName : targetRow[0]}) 
            this.setState({funcRule : targetRow[1]})
            this.setState({servingVar : targetRow[2]})
        }
        else{
            this.setState({EditRow : false})
            this.setState({EditTarget : -1})
        }
    }

    handleSubmission(e){
        e.preventDefault() 
        const newArray = [this.state.newName, this.state.funcRule, this.state.servingVar]
        if(this.state.EditRow == false){
        this.setState({RegisterFunctions : [...this.state.RegisterFunctions, newArray]})
        }
        if(this.state.EditRow == true){
            const newRegF = this.state.RegisterFunctions; 
            newRegF[this.state.EditTarget] = newArray;
            this.setState({RegisterFunctions : newRegF})
        }
    }

    handleUpdate(){
        this.props.handleUpdate(this.state.RegisterFunctions)
    }

    render(){
        return(
            <div style={{display : "flex"}}>
                <div className = "RegReference">
                    <Table className = "RegReference" varLabels = {["ID", "Vars"]} 
                    entries = {this.props.RegList} Editable = {false}/> 
                
                    <button onClick = {this.handleUpdate}>Update</button>
                
                
                </div>

                <div className = "RegName" style = {{marginLeft : "20%"}}>
                    <Table className = "RegName" varLabels = {["ID", "Func Name", 
                    "Func Rule", "Applies", "Edit"]} entries = {this.state.RegisterFunctions} Editable = {true}
                    getRowID = {(e) => this.handleRowEdit(e)}/>
                    <form onSubmit = {(e)=>this.handleSubmission(e)}>
                    <label for = "NameEntry">Name</label>
                    <input type="text" id = "NameEntry" onChange = {(e) => this.setState({newName : e.target.value})}
                    value = {this.state.newName}/>
                    <label for = "FuncRule">Function Rule</label>
                    <input type = "text" id = "FuncRule" onChange = {(e) => this.setState({funcRule : e.target.value})}
                    value = {this.state.funcRule}/> 
                    <label for = "ApplyEntry">Applies To</label>
                    <input type = "text" id = "ApplyEntry" onChange = {(e) => this.setState({servingVar : e.target.value})}
                    value = {this.state.servingVar}/>
                    <input type = "submit"/>
                    </form>
                </div>

            </div>


        )
    }


}

class OutputSetup extends Component{
    constructor(props){
        super(props);
        this.state = {
            Outputs : this.props.srcList, 
            EditRow : false, 
            targetRow : -1,

            // Output Addition  
            OutputName : "",
            OutputFunction : "",
            OutputType : "",
            CostRegister : "",
            CostFunction : "" 
            
        }

        this.handleUpdate = this.handleUpdate.bind(this)
    }

    componentDidUpdate(prevProps){
        if (prevProps.srcList !== this.props.srcList){
            this.setState({Outputs : this.props.srcList})
        }
    }

    handleRowEdit(val){
        if(this.targetRow != val){
            this.state.EditRow = true
            this.state.targetRow = val; 

            const tempRow = this.state.Outputs[val]
            this.setState({OutputName : tempRow[0]})
            this.setState({OutputFunction : tempRow[1]})
            this.setState({OutputType : tempRow[2]})
            this.setState({CostRegister : tempRow[3]})
            this.setState({CostFuction : tempRow[4]})
        }
        else{
            this.state.EditRow = false 
            this.state.targetRow = -1 
        }

    }

    handleSubmit(e){
        e.preventDefault() 
        const newArray = [this.state.OutputName, 
            this.state.OutputType, this.state.OutputFunction,
            this.state.CostRegister, this.state.CostFunction]


        if(this.state.EditRow == true){
            const CopyArry = this.state.Outputs;
            CopyArry[this.state.targetRow] = newArray; 
            this.setState({Outputs : CopyArry})
        }
        else{
            this.setState({Outputs : [...this.state.Outputs, newArray]})
        }

    }

    handleUpdate(){
        this.props.handleUpdate(this.state.Outputs)
    }


    render(){
        return(
            <div>
                <div>

                    <Table varLabels = {["ID", "Output Name", "Output Type", "Output Function",
                    "Cost Register", "Cost Function", "Edit"]} entries = {this.state.Outputs}
                    Editable = {true} getRowID = {(val) => this.handleRowEdit(val)}/>


                    <button onClick = {this.handleUpdate}>Update</button>

                </div>


                <div>

                    <form onSubmit = {(e) => this.handleSubmit(e)}> 

                    <label for = "OutputName">Output Name: </label>
                    <input type = "text" placeholder = "Output Name" id = "CommandVars"
                    onChange = {(e) => this.setState({OutputName : e.target.value})} 
                    value = {this.state.commandVars}/>

                    <label for = "OutputType">Output Type: </label> 
                    <input type = "text" placeholder = "Output Type" id = "OutputType"
                    onChange = {(e) => this.setState({OutputType : e.target.value})}
                    value = {this.state.OutputType}/>

                    <label for = "OutputFunction">Output Function: </label> 
                    <input type = "text" placeholder = "Output Function" id = "OutputFunction"
                    onChange = {(e)=>this.setState({OutputFunction : e.target.value})}
                    value = {this.state.OutputFunction}/>
                    

                    <label for = "CostFunction">Cost Register</label> 
                    <input type = "text" placeholder = "Destination Node" id = "CostRegister"
                    onChange = {(e) => this.setState({CostRegister : e.target.value})}
                    value = {this.state.CostRegister}/>
                    
                    
                    <label for = "CostFunction">Cost Register</label> 
                    <input type = "text" placeholder = "Cost Function" id = "CostFunction" 
                    onChange = {(e) => this.setState({CostFunction : e.target.value})}
                    value = {this.state.CostFunction}/>


                    <input type = "Submit" value = "Apply"/>

                    </form> 

                 </div>
                
            </div>

        )
    }
}




class CommandMapping extends Component{
    constructor(props){
        super(props); 
        this.state = {
            CmdMappings : this.props.srcList,
            EditRow : false, 
            targetRow : -1, 

            // For adding new mappings 
            commandVars : "", 
            RegisterFunction : "",
            SrcPrt : "", 
            DestNode : "", 
            DestPort : ""
        }

        this.handleUpdate = this.handleUpdate.bind(this)
    }

    componentDidUpdate(prevProps){
        if (prevProps.srcList !== this.props.srcList){
            this.setState({CmdMappings : this.props.srcList})
        }
    }

    handleSubmit(e){
        e.preventDefault() 
        const newMap = [this.state.commandVars, 
            this.state.RegisterFunction, 
            this.state.SrcPrt,
            this.state.DestNode, 
            this.state.DestPort]; 


        if(this.state.EditRow == false){
            this.setState({CmdMappings : [...this.state.CmdMappings, newMap]})
        }
        else{
            console.log("Editing Row")
            const tempCmdMapping = this.state.CmdMappings; 
            tempCmdMapping[this.state.targetRow] = newMap; 
            this.setState({CmdMapings : tempCmdMapping})
        }

    }

    handleRowEdit(val){
        if(val != this.state.targetRow){
            this.state.targetRow = val;
            this.setState({EditRow : true})
            
            const tempRow = this.state.CmdMappings[this.state.targetRow]
            this.setState({commandVars : tempRow[0]})
            this.setState({RegisterFunction : tempRow[1]})
            this.setState({SrcPrt : tempRow[2]})
            this.setState({DestNode : tempRow[3]})
            this.setState({DestPort : tempRow[4]})

        } 
        else{
            this.state.targetRow = -1 
            this.setState({EditRow: false})
        }
    }

    handleUpdate(){
        this.props.handleUpdate(this.state.CmdMappings)
    }


    render(){
    

        return(
            <div>
                <div className = "CommandTable">
                    <Table varLabels = {["ID", "CommandString", "Reg Function", 
                    "Source Port", "Dest Node", "Dest Port", "Edit"]} entries = {this.state.CmdMappings}
                    Editable = {true} getRowID = {(val) => this.handleRowEdit(val)}/>
                    
                    <button onClick = {this.handleUpdate}>Update</button>




                </div>

                <br></br>
                <br></br>


                <form onSubmit = {(e) => this.handleSubmit(e)}>
                    <label for = "CommandVars">Command Variable: </label>
                    <input type = "text" placeholder = "Command Variable" id = "CommandVars"
                    onChange = {(e) => this.setState({commandVars : e.target.value})} 
                    value = {this.state.commandVars}/>

                    <label for = "RegisterFunc">Register Function: </label> 
                    <input type = "text" placeholder = "Register Function" id = "RegisterFunc"
                    onChange = {(e)=>this.setState({RegisterFunction : e.target.value})}
                    value = {this.state.RegisterFunction}/>
                    
                    <label for = "srcPrt">Source Port: </label>
                    <input type = "text" placeholder = "Source Port" id = "srcPrt"
                    onChange = {(e) => this.setState({SrcPrt : e.target.value})}
                    value = {this.state.SrcPrt}/> 

                    <label for = "DestNode">Destination Node</label> 
                    <input type = "text" placeholder = "Destination Node" id = "DestNode"
                    onChange = {(e) => this.setState({DestNode : e.target.value})}
                    value = {this.state.DestNode}/>

                    <label for = "DestPort">Destination Port</label>
                    <input type = "text" placeholder = "Destination Port" id = "DestPort"
                    onChange = {(e) => this.setState({DestPort : e.target.value})}
                    value = {this.state.DestPort}/>

                    <input type="submit" value = "Apply"/> 
                </form>
            </div>
        )
    }


}


class RegisterMenu extends Component{
    constructor(props){
        super(props)
        this.state = {
            RegVarList : this.props.srcList, 
            EditRow : false, 
            EditTarget : -1, 


            // Adding Register value states 
            newName : "Default", 
            newType : "F", 
            newInitVal : "0"        
        }

        this.handleUpdate = this.handleUpdate.bind(this)
    }

    componentDidUpdate(prevProps){
        if (prevProps.srcList !== this.props.srcList){
            this.setState({RegVarList : this.props.srcList})
        }
    }


    // On change functions for variable addition 
    onNameChange(e){
        this.setState({newName : e.target.value})
    }
    onTypeChange(e){
        this.setState({newType : e.target.value})
    }
    onValueChange(e){
        this.setState({newInitVal : e.target.value})
    }
    onRegVarSubmit(e){
        e.preventDefault()

        if (this.state.EditRow == true){
            const newArry = [this.state.newName, this.state.newType, this.state.newInitVal]
            const RegVarCopy = [...this.state.RegVarList] 
            RegVarCopy[this.state.EditTarget] = newArry
            this.setState({RegVarList : RegVarCopy}); 
        } 
        else{
            const newArry = [this.state.newName, this.state.newType, this.state.newInitVal]
            const LCopy = [...this.state.RegVarList, newArry];
            this.setState({RegVarList : LCopy}, 
            console.log(this.state.RegVarList));

        }

        
        
    }

    // Capture the changes When there edit is clicked
    onEditChange(targetVal){
        if(targetVal == this.state.EditTarget){
            this.setState({EditRow : false})
        }
        else{
            this.setState({EditTarget : targetVal})
            this.setState({EditRow : true})
            let newInfo = this.state.RegVarList[targetVal]
            this.setState({newName : newInfo[0]})
            this.setState({newType : newInfo[1]})
            this.setState({newInitVal : newInfo[2]})
        }
    }

    handleUpdate(){
        this.props.handleUpdate(this.state.RegVarList)
    }




    
    render(){
        return(
            
            <div className = "RegTableEncapsulation">
                <div className = "RegisterTable">
                {/* Contains the Table for the Register Values */} 
                <Table varLabels = {["ID", "Name", "Type", "Value", "Edit"]} entries = {this.state.RegVarList} 
                getRowID = {(e) => this.onEditChange(e)} Editable = {true}/>

                <button onClick = {this.handleUpdate}>Update</button>
                
                </div> 
                <div>
                    {/*Add Register*/}
                    <form onSubmit = {(e) => this.onRegVarSubmit(e)}>
                    <label for = "RegName">Register Name: </label>
                    <input id = "RegName" type = "text" placeholder = "Name" onChange = {(e) => this.onNameChange(e)} value = {this.state.newName}/>
                    <label for = "RegType">Register Type: </label>
                    <input id = "RegType" type = "text" placeholder = "type" onChange = {(e) => this.onTypeChange(e)} value = {this.state.newType} /> 
                    <label for = "RegInitVal">Register InitVal: </label>
                    <input id = "RegInitVal" type = "text" placeholder = "Initial Value" onChange = {(e) => this.onValueChange(e)} value = {this.state.newInitVal}/> 
                    <input type = "submit"/> 
                    </form>
                    <p>{this.state.EditTarget}</p>
                </div>
            </div> 
        ) 
    }
}

export class InputMenu extends Component{
    constructor(props){
        super(props)
        this.state = {
            InputName : "", 
            InputType : "", 
            InputList : this.props.srcList, 

            Editrow : false, 
            Targetrow : -1 
        }

        this.handleUpdate = this.handleUpdate.bind(this)
    }

    componentDidUpdate(prevProps){
        if (prevProps.srcList !== this.props.srcList){
            this.setState({InputList : this.props.srcList})
        }
    }

    handleRowIDEdit(val){
        if (this.state.TargetRow  == val){
            this.setState({Editrow : false}); 
            this.setState({Targetrow : -1})
        }
        else{
            this.setState({Editrow : true})
            this.setState({TargetRow : val}) 
        }
    }




    handleSubmit(e){
        e.preventDefault()
        const newArry = [this.state.InputList.length, this.state.InputName, this.state.InputType]

        if (this.state.Editrow == false){
            this.setState({InputList : [...this.state.InputList, newArry]})
        } 
        else{
            const inputArryCopy = [...this.state.InputList]; 
            inputArryCopy[this.state.TargetRow] = newArry; 
            this.setState({InputList : inputArryCopy})
        }
    }



    handleUpdate(){
        this.props.handleUpdate(this.state.InputList)
    }




    render(){
        return(
            <div>
                <div className = "InputTable">
                    <Table varLabels = {["ID", "PosID", "InputName", "Input", "Edit"]} 
                    entries = {this.state.InputList} Editable = {true}
                    getRowID = {(val) => this.handleRowIDEdit(val)} /> 


                    <br></br>

                    <button onClick = {this.handleUpdate}>Update</button> 

                </div>


                <div className = "InputAdd">
                    <form onSubmit = {(e) => this.handleSubmit(e)}>
                        <label for = "in_name">Input Name</label>
                        <input type="text" id = "in_name" value = {this.state.InputName} 
                        onChange = {(e) => this.setState({InputName : e.target.value})}/>
                        
                        <label for = "in_type">Input Type</label>
                        <input type = "text" id = "in_type" value = {this.state.InputType}
                        onChange = {(e) => this.setState({InputType : e.target.value})}/>

                        <input type = "Submit" value = "Apply"/> 

                    </form>
                    </div> 

                </div> 

        )
    }




}



export class ObjectMenu extends Component{ 
    constructor(props){
        super(props); 
        this.state = {
            Register : this.props.ObjQual.registerList, 
            RegisterFunctions : this.props.ObjQual.regFuncList, 
            Outputs : this.props.ObjQual.outPutList,
            Inputs : this.props.ObjQual.inputList,
            CommandMaps : this.props.ObjQual.commandMaps, 
            MenuMode : "Default"
        }

        this.handleObjectSubmission = this.handleObjectSubmission.bind(this); 
    }

    componentDidUpdate(prevProps) {
        if (prevProps.ObjQual !== this.props.ObjQual) {
          console.log("hello ", this.props.ObjQual)
          this.setState({
            Register: this.props.ObjQual.registerList,
            RegisterFunctions: this.props.ObjQual.regFuncList,
            Outputs: this.props.ObjQual.outPutList,
            Inputs: this.props.ObjQual.inputList,
            CommandMaps: this.props.ObjQual.commandMaps,
          }, () => console.log(this.state)) 
        }



       
      }

    forceUpdateHandler(){
        this.forceUpdate() 
    }

    

    handleNameForm(val){
        this.setState({ObjectName : val})
    }

    handleModeChg(e){
        this.setState({MenuMode : e.target.id}); 
    }

    // Handle 

    handleRegister(RegList){
        this.setState({Register : RegList})
    }

    handleRegisterFunction(RegFuncList){
        this.setState({RegisterFunctions : RegFuncList})
    }

    handleCmdMap(CmdMapList){
        this.setState({CommandInputs : CmdMapList})
    }

    handleOutputList(OutList){
        this.setState({Outputs : OutList})
    }

    handleValueInputs(InputList){
        this.setState({Inputs : InputList})
        
    }

    handleCmdMap(CmdList){
        this.setState({CommandMaps : CmdList})
    }

    async handleObjectSubmission(){
        

        // Send Data to Backend: 

        const SendData = {
            "ObjectName" : this.props.ObjectName,
            "ObjectID" : this.props.ObjectID,  
            "SimulationID" : this.props.SimulationID, 
            "Register" : this.state.Register, 
            "RegisterFunction" : this.state.RegisterFunctions,
            "Outputs" : this.state.Outputs, 
            "Inputs" : this.state.Inputs,
            "CommandMaps" : this.state.CommandMaps, 
            "MenuMode" : this.state.MenuMode

        }

        console.log(SendData)

        console.log(SendData["ObjectID"])
        console.log(SendData["SimulationID"])


        await axios.post("http://127.0.0.1:5000/api/ObjectSchema", SendData)
        .then(
          response => {
            console.log(response)
            if(response.data["Issue"] === true){
                // Handle Incorrect error here
            }
            else{
                // pass the input and output names to the parent component 
                const inputNameList = [] 
                const outputNameList = []
                for(let i = 0 ; i < this.state.Inputs.length; i++){
                    inputNameList.push(this.state.Inputs[i][1]) 
                }

                for(let i = 0 ; i < this.state.Outputs.length; i++){
                    outputNameList.push(this.state.Outputs[i][0])
                }
                
               const NodeVisData = {
                    new_inputs : inputNameList, 
                    new_outputs : outputNameList
                }

                this.props.VisualNodesEdit(NodeVisData)


             
            }
          })
          .catch(error => {
            console.log(error)
          })
    }

    
    render(){
        return(
            <div>
            <div className = "ModeSelect">
            <button id = "Register" onClick = {(e) => this.handleModeChg(e)}>Edit Register</button>
            <button id = "RegisterFunction" onClick = {(e) => this.handleModeChg(e)}>Edit Register Function</button>
            <button id = "Output" onClick = {(e) => this.handleModeChg(e)}>Edit Outputs</button>
            <button id = "Input" onClick = {(e) => this.handleModeChg(e)}>Edit Input</button>
            <button id= "CmdMap" onClick = {(e) => this.handleModeChg(e)}>Edit Command Maps</button>
            <button id="Default" onClick = {(e) => this.handleModeChg(e)}>Move to Home</button>
            </div>
            <div>
                {this.state.MenuMode == "Register" ? <RegisterMenu srcList = {this.state.Register} handleUpdate = {(val) => this.handleRegister(val)}/>  : null}
                {this.state.MenuMode == "RegisterFunction" ? <RegisterFunction srcList = {this.state.RegisterFunctions} handleUpdate = {(val) => this.handleRegisterFunction(val)} RegList = {this.state.Register}/> : null} 
                {this.state.MenuMode == "CmdMap" ? <CommandMapping srcList = {this.state.CommandMaps} handleUpdate = {(val) => this.handleCmdMap(val)}/> : null} 
                {this.state.MenuMode == "Output" ? <OutputSetup srcList = {this.state.Outputs} handleUpdate = {(val) => this.handleOutputList(val)}/> : null} 
                {this.state.MenuMode == "Input" ? <InputMenu srcList = {this.state.Inputs} handleUpdate = {(val) => this.handleValueInputs(val)}/> : null} 
               
                
                
                {this.state.MenuMode == "Default" ? 
                
                <div>
                    <p>Object name: {this.state.ObjectName}</p>
                    <button onClick = {this.handleObjectSubmission}>Submit Changes</button>

                </div> : null}
            </div>
        
            </div> 
        )
    }
}


export class DynamicForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            InputDict : {}
        }
    }

    EqualityTest(omar, omar2){
        let condition = true
        if(omar.length == omar2.length){
        for(let i=0; i < omar.length; i++){
            if(!omar2.includes(omar[i])){
                condition = false
                break; 
            }
        }
        }
        else{
            condition = false
        }
        return condition
    }


    componentDidUpdate(prevProps) {
          if (!this.EqualityTest(this.props.InputNames, prevProps.InputNames)) {

            // Call the method when propValue changes
            console.log("dam")
            const newDict = {}
            for(let i = 0; i < this.props.InputNames.length; i++){
                newDict[this.props.InputNames[i]] = ""
            }
            this.setState({InputDict : newDict});
          }
        }

        EditList(e){
            let id = e.target.id
            let newDict = JSON.parse(JSON.stringify(this.state.InputDict));
            newDict[id] = e.target.value
            this.props.ReadData({"Index" : this.props.index  ,"State_Dict" : newDict})
            this.setState({InputDict : newDict})
        }

    
    render(){
        return(
            <div>
            {this.props.InputNames.map((InputName, index) =>  
            <div key = {index} style = {{width: "200px", clear: "both"}}>
                <label style = {{color : "#1ac6e5", display : "inline"}} for = {InputName}>{InputName}: </label>
                <input style = {{width : "100%", clear : "both"}} key={index} type="text" id = {InputName} onChange = {(e) => this.EditList(e)}
                value = {this.state.InputDict[InputName]} placeholder = {InputName}/>
            </div>
            )}
            </div>
        )
    }
}

// Method Name: String: 
// SubDevices = ["Hello", "World", "Deadwing"]
// Command Operations = ["Run", "Rotate", "Twist"]
// Method InputList = [["King", 'Joe'], ["Bob", "Omar"], ["James", "Scottson"]]

class DropDownMenu extends Component{
    constructor(props){
        super(props)
        this.state = {
            SetType : "LED", 
            SelectList : [],
        }


    }

    componentDidMount(){
        this.GetDeviceMethods()
    }

    componentDidUpdate(prevProps){
        if (prevProps.srcList !== this.props.srcList){
            this.setState({Outputs : this.props.srcList})
        }
    }

    async GetDeviceMethods(){
        const PostString = "http://127.0.0.1:5000/api/GetMethods/DeviceType=" + this.props.SetType

        await axios.get(PostString).then(
          response => {
            this.setState({SelectList : response.data})
          })
          .catch(error=>{console.log(error)
        })
    }


    componentDidUpdate(prevProps){
        if (prevProps.type != this.props.type){
            this.GetDeviceMethods()
        }  
    }

    async SendMethodParams(){
        const PostString = "http://127.0.0.1:5000/api/GetParams/DeviceType=" + this.props.SetType + ":" + this.state.SetValue
        await axios.get(PostString).then(
          response => {
            let inObj = {}
            for(let i = 0; i < response.data.length; i++){
                inObj[response.data[i]] = ""
            }
            const omar = {index : this.props.index, method : [this.state.SetValue], Params : inObj}
            this.props.SendTo(omar)
            console.log(omar)
          })
          .catch(error=>{console.log(error)
        })
    }

    componentDidUpdate(prevProps){
        if (prevProps.type != this.props.type){
            this.GetDeviceMethods()
        }  
    }
    

    render(){
        return(
            <div>
                <select name="ObjectSelect"onChange = {(e) =>  this.setState({SetValue : e.target.value}, () => this.SendMethodParams())}>
                    {this.state.SelectList.map((option, index)=> 
                    <option key={index} value={option}>{option}</option>)}
                </select>
            </div>
        )
    }

}

class MethodVars extends Component{
    constructor(props){
        super(props)
        this.state = {
            VarName : "",
            VarType : "", 
            VariableList : {}
        }
    }

    ExtractRows(){
        let NewList = []
        Object.keys(this.state.VariableList).map((name, index) => NewList.push([name, this.state.VariableList[name]]))
        return NewList
    }

    ObjEquTest(Obj1, Obj2){
        let key_list_1 = Object.keys(Obj1)
        let key_list_2 = Object.keys(Obj2)
        
        if(key_list_1.length != key_list_2.length){
            return false 
        }
        else{
            for(let i = 0; i < key_list_1.length; i++){
                if(key_list_2.includes(key_list_1[i])){
                   if(!Obj2[key_list_1[i]] == Obj1[key_list_1[i]]){
                       return false 
                   }
                }
            }

            for(let i = 0; i < key_list_2.length; i++){
                if(key_list_1.includes(key_list_2[i])){
                   if(!Obj2[key_list_2[i]] == Obj1[key_list_2[i]]){
                       return false 
                   }
                }
            }

            return true  
        }

    }

    componentWillUpdate(nextProps){
        if(!this.ObjEquTest(nextProps.VarDictProps, this.props.VarDictProps)){
            this.setState({VariableList : nextProps.VarDictProps}, 
                () => console.log(this.state.prevDict))
        }
    }


    AddVariable(e){
        e.preventDefault()
        let varCopy = JSON.parse(JSON.stringify(this.state.VariableList));
        varCopy[this.state.VarName] = this.state.VarType
        this.setState({VariableList : varCopy}, () => this.props.AddMasterVar(this.state.VariableList))
        
    }

    render(){
        return(
            <div>
                <form onSubmit={(e)=>this.AddVariable(e)}>
                    <input type = "text" placeholder = "Variable Name" onChange = {(e)=>this.setState({VarName : e.target.value})} value = {this.state.VarName}/>
                    <input type = "text" placeholder = "Variable Type" onChange = {(e)=>this.setState({VarType : e.target.value})} value = {this.state.VarType}/>
                    <br></br>
                    <input type="submit" value = "Add"/>
                </form>
                <Table varLabels = {["Index", "Name", "Type"]} Editable = {false} entries = {this.ExtractRows()}/>
            </div>
        )
    }

}

class MethodTable2 extends Component{ 
    constructor(props){
        super(props)
        this.state = {
            MethodName : "", 
            MethodList : [], 
            MethodObject : [], 
            CommandOperation : [], 
            MethodInputList : [], 
        }
    }

    EqualityTest(omar, omar2){
        let condition = true
        if(omar.length == omar2.length){
            for(let i =0; i < omar.length; i++){
                if(!omar2.includes(omar[i])){
                    condition = false
                    break; 
                }
            }
            for(let i = 0; i < omar2.length; i++){
                if(!omar.includes(omar2[i])){
                    condition = false 
                    break; 
                }
            }
        }
        else{
            condition = false
        }
        return condition
    }


    PrecProc(omar){
        let NewArry = []
        for(let i = 0; i < omar.length; i++){
            let newStr = ""
            for(let k = 0; k < omar[i].length;k++){
                newStr += omar[i][k] + ":"
            }
            newStr = newStr.slice(0, newStr.length - 1)
            NewArry.push(newStr)
        }
        return NewArry
    }

    ListMethObj(MethObj){
        let main_list = [] 
        for(let i = 0; i < MethObj.length; i++){
            let Sim_List = [MethObj[i]["NAME"], MethObj[i]["TYPE"], ...Object.values(MethObj[i]["PARAMS"])] 
            main_list.push(Sim_List)
        }
        return main_list
    }
    
    MethEqu(MethObj1, MethObj2){
        const ListMeth1 = this.ListMethObj(MethObj1)
        const ListMeth2 = this.ListMethObj(MethObj2)

        
        let omar = this.EqualityTest(this.PrecProc(ListMeth1), this.PrecProc(ListMeth2))
        return omar 
    }
    

    componentWillMount(){
        let InitialList = []
        for(let i = 0 ; i < this.props.MethodHeader.length; i++){
            InitialList.push({"NAME" : this.props.MethodHeader[i][0], "TYPE": this.props.MethodHeader[i][1], "PARAMS": {'King' : '', 'Ass' : ''}})
        }
        this.setState({MethodObject : InitialList}, () => console.log("omar: " , this.state.MethodObject))
        
    }

    componentWillUpdate(nextProps){
        //Manages the external send of new Method Objects: 
        let ChgMeth = false

        if(!this.MethEqu(nextProps.MethodObjProp, this.props.MethodObjProp)){
            console.log("New Prop Obj: ", nextProps.MethodObjProp)
            console.log("Old Props Obj: ", this.props.MethodObjProp)
            this.setState({MethodObject : nextProps.MethodObjProp})
            ChgMeth = true 
        }

        // Manages the internal adddition of Method Header ethods 
        if(!this.EqualityTest(this.PrecProc(this.props.MethodHeader), this.PrecProc(nextProps.MethodHeader)) && !ChgMeth){
            let SepList = this.GetListDifference(this.props.MethodHeader, nextProps.MethodHeader)
            let oldListCopy = [...this.state.MethodObject] 
            for(let i = 0; i < SepList["new_diff"].length; i++){
                const spt_list = SepList["new_diff"][i].split(":")
                oldListCopy.push({"NAME" : spt_list[0], "TYPE" : spt_list[1], "PARAMS" : {'King' : ' ', 'Ass' : ' '}})
            }
            this.setState({MethodObject : oldListCopy})
        }


        
    }    

   

    GetListDifference(old_list, new_list){
        let ProcL1 = this.PrecProc(old_list)
        let ProcL2  = this.PrecProc(new_list)

        let L1Diff = []
        let L2Diff = []
        

        for(let i = 0; i < ProcL2.length; i++){
           if(!ProcL1.includes(ProcL2[i])){
               L2Diff.push(ProcL2[i])
           }
        }

        for(let k = 0; k < ProcL1.length; k++){
            if(!ProcL2.includes(ProcL1[k])){
                L1Diff.push(ProcL1[k])
            }
        }

        return {"old_diff" : L1Diff, "new_diff" : L2Diff}
    }




    SendToCarry(e){
        let ObjectCopy = [...this.state.MethodObject]
        console.log(e)
        let ch_index = e["index"]
        let ch_params = e["Params"]
        let sub_method = e["method"][0]
        
        ObjectCopy[ch_index]["PARAMS"] = ch_params
        ObjectCopy[ch_index]["METHOD"] = sub_method
        this.setState({MethodObject : ObjectCopy})
        console.log(e)
    }

    ReadDataCont(e){
        let ObjectCopy = [...this.state.MethodObject]
        let ch_index = e["Index"]
        let ch_params = e["State_Dict"]

        ObjectCopy[ch_index]["PARAMS"] = ch_params 
        this.setState({MethodObject : ObjectCopy}, 
            console.log(this.state.MethodObject))
    }

    handleSave(){
        console.log("ReversedDirection: ", this.state.MethodObject)
        this.props.MasterSend(this.state.MethodObject)
    }


    render(){
        return(
            <div>
                <table className = "DeviceMethodTable">
                    <thead> 
                    <tr><th>
                    Device Name</th>
                    <th>
                    Device Type</th>
                    <th>  
                    Device Command</th>
                    <th>
                    Parameters Set</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.MethodObject.map((ObjectItem, index) => <tr>
                        <td style = {{fontFamily : "monospace", fontSize : "15px", color : "#afe0bc", textAlign : "center"}}>{ObjectItem["NAME"]}</td>
                            <td style = {{fontFamily : "monospace", fontSize : "15px", color : "#afe0bc", textAlign : "center"}}>{ObjectItem["TYPE"]}</td>
                            <td><DropDownMenu SetType = {ObjectItem["TYPE"]} index = {index} SendTo = {(e) => this.SendToCarry(e)}
                            name = {ObjectItem["NAME"]}/></td>
                            <td><DynamicForm index = {index} InputNames = {Object.keys(ObjectItem["PARAMS"])} ReadData = {(e) => this.ReadDataCont(e)}/></td>
                    </tr>)}
                </tbody>
                </table> 
                <button onClick = {(e) => this.handleSave(e)}>Save</button>
            </div>
        )
    }
}


export class SampleMethod2 extends Component{
    
    
    
    MasterSendHandle(e){
        console.log(e)
    }

    render(){
        return(
            <div>
            <MethodTable2 MethodHeader = {[["BOB", "LED"], ["ERIC", "LED"], ["THREAD_SEP", "GLOBAL"], ["BOB", "LED"]]}
            MasterSend = {(e) => this.MasterSendHandle(e)}/>
            </div>
        )
    }
}





export class MethodTable extends Component{
    constructor(props){
        super(props)

        this.state = {
            MethodName : "", 
            MethodList : [], 
            MethodObject : {}, 
            CommandOperation : [], 
            MethodInputList : [], 
            RevisedMethodList : []
        }
    }

    EqualityTest(omar, omar2){
        let condition = true
        if(omar.length == omar2.length){
        for(let i =0; i < omar.length; i++){
            if(!omar2.includes(omar[i])){
                condition = false
                break; 
            }
        }
        }
        else{
            condition = false
        }
        return condition
    }

    PrecProc(omar){
        let NewArry = []
        for(let i = 0; i < omar.length; i++){
            let newStr = ""
            for(let k = 0; k < omar[i].length;k++){
                newStr += omar[i][k] + ":"
            }
            newStr = newStr.slice(0, newStr.length - 1)
            NewArry.push(newStr)
        }
        return NewArry
    }

    componentDidMount() {
        let initialMethodObject = {};
        
        for (let i = 0; i < this.props.MethodMenu.length; i++) {
          const [name, type] = this.props.MethodMenu[i];
          initialMethodObject[name] = { [type]: { king: '', ass: '' } };
        }
        console.log("prec", initialMethodObject)

        this.setState({MethodObject  : initialMethodObject, MethodList : this.props.MethodMenu}, () =>
            console.log("DLF", this.state.MethodObject));
      }

   

    componentDidUpdate(prevProps) {
        if (!this.EqualityTest(this.PrecProc(prevProps.MethodMenu), this.PrecProc(this.props.MethodMenu))){
          const NewMethodObject = {};
          const RevisedList = []
          for (let i = 0; i < this.props.MethodMenu.length; i++) {
            const [name, type] = this.props.MethodMenu[i];
            NewMethodObject[name] = {[type]: { king: "", ass: "" }};
            RevisedList.push({[name] : {[type] : {king : " ", ass : " "}}})
          }

          this.setState({ MethodList: this.props.MethodMenu, MethodObject: NewMethodObject, 
        RevisedMethodList : RevisedList }, () => {
            console.log("BLACK_LIST: ", this.state.RevisedList);
          });
        }
      }

    SendTo(NewObj){
        let name = Object.keys(NewObj)[0]
        let MethObjCopy = JSON.parse(JSON.stringify(this.state.MethodObject));
        MethObjCopy[name] = NewObj[name]
        console.log(MethObjCopy)
        this.setState({MethodObject : MethObjCopy})
    }

    ReadData(loc, e_input){
        let MethObjCopy = JSON.parse(JSON.stringify(this.state.MethodObject));
        console.log(loc[1])
        MethObjCopy[loc[0]][loc[1]] = e_input
        this.setState({MethodObject : MethObjCopy})
        console.log("omar: ", this.state.RevisedMethodList)
    }

    MasterCompSend(){
        console.log("Finalized Method Menu: ",  this.state.MethodList)
        this.props.MasterTabSend(this.state.MethodObject)
    }


    render(){
        return(
            <div className = "DeviceMethodTable">
                <table>
                <tr><th>
                Device Name</th>
                <th>
                Device Type</th>
                <th>  
                Device Command</th>
                <th>
                Parameters Set</th>
                </tr>
                {this.state.MethodList.map((ObjectItem, index) => 
                    <tr key = {index}>
                        <td style = {{fontFamily : "monospace", fontSize : "15px", color : "#afe0bc", textAlign : "center"}}>{ObjectItem[0]}</td>
                        <td style = {{fontFamily : "monospace", fontSize : "15px", color : "#afe0bc", textAlign : "center"}}>{ObjectItem[1]}</td>
                        <td><DropDownMenu SetType = {ObjectItem[1]} SendTo = {(e) => this.SendTo(e)}
                        name = {ObjectItem[0]}/></td>
                        <td><DynamicForm InputNames = 
                        {Object.keys(this.state.MethodObject[ObjectItem[0]][Object.keys(this.state.MethodObject[ObjectItem[0]])[0]])}
                        ReadData ={(e) => this.ReadData([ObjectItem[0], Object.keys(this.state.MethodObject[ObjectItem[0]])[0]] ,e)}/></td>
                    </tr>
                )}
                </table>
                <button onClick ={(e)=>this.MasterCompSend(e)}>Save</button>
            </div>
        )
    }
}

export class DeviceMethodContainer extends Component{
    constructor(props){
        super(props)

        this.state = {
            VarDict : {}, 
            MethodDict : {}, 
            MethodHeaderList : [], 
            NewItemValue : ""
        }

    }


    TabMasterHandle(in_MethodDict){
        this.setState({MethodDict : in_MethodDict}, 
            () => 
            {
                const RevisedState = {
                    "VARIABLES" : this.state.VarDict, 
                    "COMMANDS" : this.state.MethodDict, 
                    "HEADER_LIST" : this.state.MethodHeaderList
                }
                
                console.log("HOLY SHIT: ", RevisedState)
                this.props.MasterHandler(RevisedState)
            }     
        )
    }

    VarMasterHandle(in_VarDict){
        this.setState({VarDict : in_VarDict})
    }

    handleFormSubmit(e){
        e.preventDefault()
        let found = false  
        console.log('Holy Shit Lois: ', this.state.NewItemValue)

        for(let i = 0; i < this.props.port_map.length; i++){
            if(this.props.port_map[i][2] == this.state.NewItemValue){
                let SetItem = this.props.port_map[i][1]
                let MethCopy = [...this.state.MethodHeaderList]
                MethCopy.push([this.state.NewItemValue, SetItem, this.state.MethodHeaderList.length])
                this.setState({MethodHeaderList : MethCopy})
    
            }
            else{
                console.log("FIEN")
            }
        }
    }

    render(){
        return(
            <div>
                <form  onSubmit = {(e) =>  this.handleFormSubmit(e)}>
                    <label style = {{fontFamily : 'monospace', color : "#21d1de"}} for = "CompNameEntry">Component Name</label> 
                    <input id = "CompNameEntry" type="text" placeholder="Component Name" onChange = {(e) => this.setState({NewItemValue : e.target.value})}
                    value = {this.state.NewItemValue} />
                    <input type="submit" value="+"/>

                </form>
                <MethodVars AddMasterVar = {(e)=>this.VarMasterHandle(e)} VarDictProps = {this.props.VarDictProps}/>
                <MethodTable2  MasterSend = {(e) => this.TabMasterHandle(e)} MethodHeader= {this.state.MethodHeaderList} MethodObjProp = {this.props.MethodObjProp}/>
            </div>
        )
    }
}
































    








